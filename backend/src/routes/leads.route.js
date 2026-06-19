"use strict";

const { Router } = require("express");
const https      = require("https");
const http       = require("http");
const { URL }    = require("url");
const { leadLimiter }  = require("../middleware/rateLimiter");
const { validateLead } = require("../middleware/validate");
const { getCollectionByCategory, getMasterCollection } = require("../db/client");

// ── DPDP Phase 1: Consent evidence imports ─────────────────────────────────
const { CONSENT_VERSION, SERVICE_CONSENT_HASH } = require("../utils/consent");
const { logAudit } = require("../utils/audit");

/**
 * forwardToDomesticLMS — fire-and-forget forward to domestic LMS intake API.
 * Called after our own DB write succeeds.
 * Never blocks the response to the user.
 * All errors are caught and logged only.
 */
function forwardToDomesticLMS(doc) {
  const baseUrl = process.env.DOMESTIC_LMS_URL;
  const apiKey  = process.env.DOMESTIC_LMS_API_KEY;

  if (!baseUrl || !apiKey) {
    // Domestic LMS not configured — skip silently
    return;
  }

  const payload = JSON.stringify({
    name:           doc.name           || "",
    mobile:         doc.mobile         || "",
    city:           doc.city           || "",
    monthly_income: doc.monthly_income || "",
    employment:     doc.employment     || "",
    product_type:   doc.product_type   || "General enquiry",
    source_page:    doc.source_page    || "",
    utm_source:     doc.utm_source     || "",
    utm_medium:     doc.utm_medium     || "",
    utm_campaign:   doc.utm_campaign   || "",
    _hp:            "",  // honeypot always empty from server
  });

  try {
    const parsed   = new URL(baseUrl + "/domestic-api/intake/lead");
    const lib      = parsed.protocol === "https:" ? https : http;
    const options  = {
      hostname: parsed.hostname,
      port:     parsed.port || (parsed.protocol === "https:" ? 443 : 80),
      path:     parsed.pathname,
      method:   "POST",
      headers: {
        "Content-Type":   "application/json",
        "Content-Length": Buffer.byteLength(payload),
        "x-api-key":      apiKey,
      },
    };

    const req = lib.request(options, (res) => {
      res.resume(); // drain the response
      if (res.statusCode !== 200) {
        console.warn("[DomesticLMS] Intake returned status:", res.statusCode);
      }
    });

    req.on("error", (err) => {
      console.error("[DomesticLMS] Forward error:", err.message);
    });

    req.setTimeout(8000, () => {
      req.destroy();
      console.warn("[DomesticLMS] Forward request timed out.");
    });

    req.write(payload);
    req.end();
  } catch (err) {
    console.error("[DomesticLMS] Forward setup error:", err.message);
  }
}

const router = Router();

/**
 * POST /api/lead
 *
 * Security stack (in order):
 *   1. leadLimiter     — rate limit 5/IP/15 min
 *   2. validateLead    — honeypot check + server-side validation + sanitization
 *   3. deduplication   — same mobile in last 10 min → silent 200
 *   4. insertOne       — store clean document
 */
router.post("/api/lead", leadLimiter, validateLead, async (req, res) => {
  const { name, mobile, city, monthly_income, employment,
          product_type, service_category, loan_amount, source_page,
          utm_source, utm_medium, utm_campaign } = req.leadData;
  try {
    // Route to the collection matching the service category (loans / insurance / cards / investments / general)
    const col = getCollectionByCategory(service_category);

    // 10-minute deduplication: same mobile → silently accept but don't double-record
    const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000);
    const existing = await col.findOne(
      { mobile, submitted_at: { $gte: tenMinsAgo } },
      { projection: { _id: 1 } }
    );
    if (existing) {
      return res.status(200).json({ ok: true });
    }

    // Build clean document — no raw req.body passthrough (OWASP A03)
    const doc = {
      name,
      mobile,
      city,
      monthly_income,
      employment,
      product_type,
      service_category,   // e.g. "loans", "insurance", "cards", "investments", "general"
      loan_amount,
      source_page,
      utm_source,
      utm_medium,
      utm_campaign,
      submitted_at: new Date(),
      ip:           req.ip,   // stored for fraud analysis, never exposed to client
      status:       "new",    // CRM states: new → contacted → converted

      // ── DPDP Act 2023 Phase 1: Consent Evidence Sub-Document ──────────────
      // Stores verifiable proof of consent at the moment of lead submission.
      //
      // Section 6 of DPDP Act 2023 requires that:
      // - Consent be specific, informed, and freely given.
      // - A record of consent must be maintained for audit purposes.
      //
      // serviceConsent is always true here because the form requires the checkbox.
      // marketingConsent is optional — false does NOT block lead creation.
      //
      // Existing records without this sub-document remain valid (backward-compatible).
      consent: {
        serviceConsent:      req.leadData.consent_service !== false, // always true (form requires it)
        marketingConsent:    !!req.leadData.consent_marketing,       // optional, defaults false
        consentVersion:      req.leadData.consent_version || CONSENT_VERSION,
        consentTimestamp:    new Date(),
        consentIP:           req.ip,
        consentUserAgent:    req.headers["user-agent"] || "",
        consentChannel:      "website",
        // SHA256 hash of the canonical service consent text bound to the version.
        // If the consent text ever changes, the version bumps and the hash changes,
        // creating an immutable link between what was shown and what was agreed to.
        consentTextHash:     SERVICE_CONSENT_HASH,
      },
    };

    await col.insertOne(doc);

    // Also write to master leads collection (all services in one place, filterable by service_category)
    try {
      await getMasterCollection().insertOne(Object.assign({}, doc));
    } catch (_) { /* master write failure must not block the primary response */ }

    // Forward lead to Domestic LMS (fire-and-forget — website keeps its own copy regardless)
    forwardToDomesticLMS(doc);

    // ── DPDP Phase 7: Audit Log ──────────────────────────────────────────
    // Log every lead creation for compliance audit trail.
    // Fire-and-forget — audit failure must NOT block the lead response.
    const { getDb } = require("../db/client");
    logAudit(getDb(), {
      action:   "LEAD_CREATED",
      entity:   "leads",
      entityId: doc._id ? doc._id.toString() : null,
      ip:       req.ip,
      userAgent: req.headers["user-agent"],
      metadata: {
        service_category,
        product_type,
        consentVersion: doc.consent.consentVersion,
        marketingConsent: doc.consent.marketingConsent,
      },
    }).catch(() => {});

    res.status(200).json({ ok: true });

  } catch (err) {
    console.error("[lead] DB error:", err.message);
    res.status(500).json({ error: "Could not save your request. Please try again." });
  }
});

module.exports = router;
