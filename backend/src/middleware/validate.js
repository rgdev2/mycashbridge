"use strict";

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

  // Attach sanitized data so the route handler doesn't touch req.body directly
  req.leadData = {
    name,
    mobile,
    city,
    monthly_income: sanitize(req.body.monthly_income, 50),
    employment:     sanitize(req.body.employment,     50),
    product_type:   sanitize(
      req.body.loan_type      ||
      req.body.insurance_type ||
      req.body.card_type      ||
      req.body.invest_type    ||
      req.body.product_type   ||
      "General", 100
    ),
    loan_amount:  sanitize(String(req.body.loan_amount || ""), 30),
    source_page:  sanitize(req.body.source_page, 200),
    utm_source:   sanitize(req.body.utm_source,  100),
    utm_medium:   sanitize(req.body.utm_medium,  100),
    utm_campaign: sanitize(req.body.utm_campaign, 100),
  };

  next();
}

module.exports = { sanitize, isValidMobile, isValidName, validateLead };
