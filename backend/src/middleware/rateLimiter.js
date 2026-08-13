"use strict";

const rateLimit = require("express-rate-limit");

/**
 * 5 lead submissions per IP per 15 minutes.
 * Applied only on POST /api/lead — not on static files.
 */
const leadLimiter = rateLimit({
  windowMs:       15 * 60 * 1000, // 15 minutes
  max:            5,
  standardHeaders: true,
  legacyHeaders:  false,
  handler: (_req, res) => {
    res.status(429).json({ error: "Too many requests. Please try again in a few minutes." });
  },
});

module.exports = { leadLimiter };
