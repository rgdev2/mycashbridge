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
    monthly_income:  doc.monthly_income  || "",
    employment:      doc.employment      || "",
    age:             doc.age             || "",
    outstanding_debt: doc.outstanding_debt || "None",
    outstanding_amount: doc.outstanding_amount || "",
    cibil_score:     doc.cibil_score      || "",
    product_type:    doc.product_type    || "General enquiry",
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
          age, outstanding_debt, outstanding_amount, cibil_score,
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
      age,
      outstanding_debt,
      outstanding_amount,
      cibil_score,
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

/**
 * POST /api/bureau-consent
 *
 * Records a user's explicit consent to pull their credit report (soft inquiry).
 * Called from the QB popup Step 5 (bureau_gate) before showing lender results.
 *
 * This endpoint does NOT actually call a bureau API — it records consent evidence.
 * When a real bureau integration (CIBIL / Experian / Equifax) is added, the
 * bureau API call should be triggered here after consent is stored.
 *
 * Security stack:
 *   1. isTrustedOrigin  — CSRF guard (reused from validate.js)
 *   2. Honeypot         — bot detection
 *   3. PAN validation   — format check (XXXXX9999X)
 *   4. DOB validation   — present + 18+ check
 *   5. Consent flag     — must be explicitly true
 */
const { sanitize, isValidMobile } = require("../middleware/validate");

/** Indicative lenders per loan type — returned to UI after consent is recorded. */
const LENDER_MAP = {
  "Personal Loan":        ["HDFC Bank","ICICI Bank","Axis Bank","Kotak Mahindra Bank","IDFC FIRST Bank"],
  "Business Loan":        ["HDFC Bank","ICICI Bank","Axis Bank","Bank of Baroda","Kotak Mahindra Bank"],
  "Home Loan":            ["SBI","HDFC Bank","ICICI Bank","Axis Bank","Kotak Mahindra Bank"],
  "Car Loan":             ["HDFC Bank","ICICI Bank","SBI","Axis Bank","Kotak Mahindra Bank"],
  "Education Loan":       ["SBI","Bank of Baroda","HDFC Bank","ICICI Bank","Axis Bank"],
  "Gold Loan":            ["Muthoot Finance","Manappuram Finance","HDFC Bank","SBI","ICICI Bank"],
  "Loan Against Property":["HDFC Bank","Axis Bank","Kotak Mahindra Bank","ICICI Bank","IDFC FIRST Bank"],
};

function isValidPAN(pan) {
  return /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/.test((pan || "").trim());
}

function isAdult(dobStr) {
  if (!dobStr) return false;
  const dob    = new Date(dobStr);
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 18);
  return dob <= cutoff;
}

router.post("/api/bureau-consent", async (req, res) => {
  // CSRF guard
  const ALLOWED = process.env.ALLOWED_ORIGIN || "*";
  if (ALLOWED !== "*") {
    const origin  = req.headers.origin  || "";
    const referer = req.headers.referer || "";
    if (!origin.startsWith(ALLOWED) && !referer.startsWith(ALLOWED)) {
      return res.status(403).json({ error: "Forbidden." });
    }
  }

  // Honeypot
  if (req.body._hp !== undefined && req.body._hp !== "") {
    return res.status(200).json({ ok: true });
  }

  // Validate required fields
  const pan    = sanitize(req.body.pan || "", 10).toUpperCase();
  const dob    = sanitize(req.body.dob || "", 20);
  const mobile = sanitize(req.body.mobile || "", 20);

  if (!isValidPAN(pan)) {
    return res.status(400).json({ error: "Invalid PAN format." });
  }
  if (!isAdult(dob)) {
    return res.status(400).json({ error: "Date of birth required. Must be 18 or older." });
  }
  if (req.body.bureau_consent !== true && req.body.bureau_consent !== "true") {
    return res.status(400).json({ error: "Bureau consent is required." });
  }

  const loanType = sanitize(req.body.loan_type || "General", 100);

  try {
    const { getDb } = require("../db/client");
    const db = getDb();

    // Store bureau consent record — DPDP Act 2023 §6 evidence
    await db.collection("bureau_consents").insertOne({
      mobile,
      pan_last4:       pan.slice(-4),     // store only last 4 chars of PAN for privacy
      dob,
      loan_type:       loanType,
      loan_amount:     sanitize(String(req.body.loan_amount || ""), 30),
      bureau_consent:  true,
      consent_version: sanitize(req.body.consent_version || "v1.0", 20),
      consented_at:    new Date(),
      ip:              req.ip,
      user_agent:      req.headers["user-agent"] || "",
      source_page:     sanitize(req.body.source_page || "", 200),
      // bureau_pull_status: "pending" — set to "completed" when real bureau API is integrated
      bureau_pull_status: "pending",
    });

    // Audit log
    const { logAudit } = require("../utils/audit");
    logAudit(db, {
      action:    "BUREAU_CONSENT_RECORDED",
      entity:    "bureau_consents",
      ip:        req.ip,
      userAgent: req.headers["user-agent"],
      metadata:  { loan_type: loanType },
    }).catch(() => {});

    // Return indicative lender matches.
    // TODO: Replace this with a real bureau API call (CIBIL / Experian / Equifax)
    //       and return actual matched lenders and score-based offers.
    const matchedLenders = (LENDER_MAP[loanType] || LENDER_MAP["Personal Loan"]).slice(0, 4);

    res.status(200).json({
      ok:       true,
      lenders:  matchedLenders,
      note:     "Indicative matches — subject to lender assessment.",
    });

  } catch (err) {
    console.error("[bureau-consent] DB error:", err.message);
    res.status(500).json({ error: "Could not record consent. Please try again." });
  }
});

module.exports = router;
