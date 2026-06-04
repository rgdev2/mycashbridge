"use strict";

const { Router } = require("express");
const { leadLimiter }  = require("../middleware/rateLimiter");
const { validateLead } = require("../middleware/validate");
const { getCollection } = require("../db/client");

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
          product_type, loan_amount, source_page,
          utm_source, utm_medium, utm_campaign } = req.leadData;

  try {
    const col = getCollection();

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
      loan_amount,
      source_page,
      utm_source,
      utm_medium,
      utm_campaign,
      submitted_at: new Date(),
      ip:           req.ip,   // stored for fraud analysis, never exposed to client
      status:       "new",    // CRM states: new → contacted → converted
    };

    await col.insertOne(doc);
    res.status(200).json({ ok: true });

  } catch (err) {
    console.error("[lead] DB error:", err.message);
    res.status(500).json({ error: "Could not save your request. Please try again." });
  }
});

module.exports = router;
