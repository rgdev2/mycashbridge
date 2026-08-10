"use strict";

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";

/**
 * CSRF guard — verify the request comes from our own origin.
 * Checks the Origin header (set automatically by browsers on cross-origin fetch).
 * Skipped when ALLOWED_ORIGIN=* (local development).
 */
function isTrustedOrigin(req) {
  if (ALLOWED_ORIGIN === "*") return true;  // dev mode — skip check
  const origin  = req.headers.origin  || "";
  const referer = req.headers.referer || "";
  return origin.startsWith(ALLOWED_ORIGIN) || referer.startsWith(ALLOWED_ORIGIN);
}

/**
 * Sanitize a value: trim, cap length, strip HTML/XSS chars and control chars.
 * Safe to call on any untrusted input.
 */
function sanitize(val, maxLen) {
  if (val === null || val === undefined) return "";
  return String(val)
    .trim()
    .slice(0, maxLen || 300)
    .replace(/[<>"'`]/g, "")                         // strip XSS vectors
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F]/g, ""); // strip control chars
}

/** Indian mobile: optional +91, then [6-9] followed by 9 digits. */
function isValidMobile(m) {
  return /^(\+91[\s-]?)?[6-9]\d{9}$/.test((m || "").replace(/\s/g, ""));
}

/** Name: 2–100 printable characters. */
function isValidName(n) {
  return typeof n === "string" && n.trim().length >= 2 && n.trim().length <= 100;
}

/**
 * Express middleware that validates the lead payload.
 * Attaches `req.leadData` (sanitized doc) on success.
 * Sends 400 JSON with { error } on failure.
 */
function validateLead(req, res, next) {
  // CSRF guard — reject requests not originating from our own domain
  if (!isTrustedOrigin(req)) {
    return res.status(403).json({ error: "Forbidden." });
  }

  // Honeypot: bots fill the hidden _hp field; humans leave it blank.
  // Return 200 silently so bots think they succeeded — don't reveal detection.
  if (req.body._hp !== undefined && req.body._hp !== "") {
    return res.status(200).json({ ok: true });
  }

  const name   = sanitize(req.body.name,   100);
  const mobile = sanitize(req.body.mobile, 20);
  const city   = sanitize(req.body.city,   100);

  if (!isValidName(name)) {
    return res.status(400).json({ error: "Invalid name — must be 2 to 100 characters." });
  }
  if (!isValidMobile(mobile)) {
    return res.status(400).json({ error: "Invalid mobile — enter a 10-digit Indian mobile number." });
  }

  const product_type = sanitize(
    req.body.loan_type      ||
    req.body.insurance_type ||
    req.body.card_type      ||
    req.body.invest_type    ||
    req.body.product_type   ||
    "General", 100
  );

  // Derive service_category so the route handler stores data in the right collection
  const service_category = resolveCategory(product_type);

  // Attach sanitized data so the route handler doesn't touch req.body directly
  req.leadData = {
    name,
    mobile,
    city,
    monthly_income:   sanitize(req.body.monthly_income, 50),
    employment:       sanitize(req.body.employment,     50),
    age:              sanitize(String(req.body.age || ""), 5),
    outstanding_debt: sanitize(req.body.outstanding_debt || "None", 50),
    product_type,
    service_category,
    loan_amount:  sanitize(String(req.body.loan_amount || ""), 30),
    source_page:  sanitize(req.body.source_page, 200),
    utm_source:   sanitize(req.body.utm_source,  100),
    utm_medium:   sanitize(req.body.utm_medium,  100),
    utm_campaign: sanitize(req.body.utm_campaign, 100),

    // ── DPDP Act 2023 Phase 1: Consent Evidence Fields ─────────────────
    // Extract client-provided consent metadata for server-side storage.
    // The route handler will merge these with server-derived fields
    // (IP, UA, timestamp) to build the full consent sub-document.
    //
    // consent_service:   boolean — required service consent checkbox
    // consent_marketing: boolean — optional marketing consent checkbox
    // consent_version:   string  — version of consent text shown to user
    //
    // Stored as a structured consent sub-document on every lead record.
    // Existing records without a consent field remain valid (backward-compatible).
    consent_service:   req.body.consent_service   === true || req.body.consent_service   === "true",
    consent_marketing: req.body.consent_marketing === true || req.body.consent_marketing === "true",
    consent_version:   sanitize(req.body.consent_version || "v1.0", 20),
  };

  next();
}

/**
 * Map a product_type string to a stable service category.
 * This determines which MongoDB collection the lead is stored in.
 */
function resolveCategory(product_type) {
  const pt = (product_type || "").toLowerCase();

  // Cards first — "card" contains "car" which would falsely match the loan regex
  if (/credit.?card|debit.?card|cashback|reward.?card|secured.?card|travel.?card|\bcard\b/.test(pt)) {
    return "cards";
  }
  if (/invest|mutual.?fund|sip|demat|stock|equity|portfolio/.test(pt)) {
    return "investments";
  }
  // "car loan", "car auto" etc — use \bcar\b so "card" doesn't match
  if (/loan|mortgage|lap|gold|\bcar\b|auto|vehicle|education|student|property/.test(pt)) {
    return "loans";
  }
  if (/insurance|health|life|motor|travel|term|ulip/.test(pt)) {
    return "insurance";
  }
  return "general";
}

module.exports = { sanitize, isValidMobile, isValidName, validateLead, resolveCategory };
