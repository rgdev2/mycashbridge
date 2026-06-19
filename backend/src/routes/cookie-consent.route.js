"use strict";

/**
 * cookie-consent.route.js — Server-side cookie consent evidence storage.
 *
 * DPDP Act 2023 compliance:
 * - Section 6: Consent must be verifiable and auditable.
 * - The existing frontend stores consent in localStorage only.
 * - This route persists a server-side record so consent is provable
 *   independent of the user's device/browser/localStorage state.
 *
 * GDPR-equivalent standard (best practice for Indian LSPs):
 * - Record which categories were accepted, when, from which IP/UA.
 * - This evidence can be produced in regulatory inquiries.
 *
 * The existing UX is unchanged — this is a silent background POST
 * called from site.js whenever the user saves cookie preferences.
 *
 * New MongoDB collection: cookieConsents
 */

const { Router }  = require("express");
const rateLimit   = require("express-rate-limit");
const { getDb }   = require("../db/client");
const { sanitize } = require("../middleware/validate");

const router = Router();

const cookieLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30, // generous — valid user can refresh/save multiple times
  standardHeaders: true,
  legacyHeaders:   false,
  handler: (_req, res) =>
    res.status(429).json({ error: "Too many requests." }),
});

/* ── POST /api/cookie-consent ────────────────────────────────── */
router.post("/api/cookie-consent", cookieLimiter, async (req, res) => {
  try {
    // Body sent from site.js saveConsent():
    //   { cookieVersion, analytics, marketing, acceptedCategories[] }
    const cookieVersion       = sanitize(req.body.cookieVersion,  10) || "v1";
    const analytics           = !!req.body.analytics;
    const marketing           = !!req.body.marketing;
    const acceptedCategories  = Array.isArray(req.body.acceptedCategories)
      ? req.body.acceptedCategories.slice(0, 10).map(s => sanitize(String(s), 50))
      : [];

    const db = getDb();

    await db.collection("cookieConsents").insertOne({
      cookieVersion,
      analytics,
      marketing,
      acceptedCategories,
      timestamp: new Date(),
      ip:        req.ip,
      userAgent: sanitize(req.headers["user-agent"] || "", 300),
    });

    return res.json({ ok: true });

  } catch (err) {
    console.error("[CookieConsent] Error:", err.message);
    // Return 200 even on error — consent UX must never break
    return res.json({ ok: true });
  }
});

module.exports = router;
