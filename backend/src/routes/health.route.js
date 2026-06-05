"use strict";

const { Router } = require("express");
const { isConnected } = require("../db/client");

const router = Router();

const HEALTH_TOKEN = process.env.HEALTH_TOKEN || "";

/**
 * GET /health
 * Protected by a Bearer token so infrastructure info is not public.
 * Set HEALTH_TOKEN in .env. Load balancers/monitors must send:
 *   Authorization: Bearer <HEALTH_TOKEN>
 */
router.get("/health", (req, res) => {
  if (HEALTH_TOKEN) {
    const auth = req.headers.authorization || "";
    if (auth !== `Bearer ${HEALTH_TOKEN}`) {
      return res.status(401).json({ error: "Unauthorized." });
    }
  }
  res.json({
    status: "ok",
    db:     isConnected() ? "connected" : "disconnected",
    ts:     new Date().toISOString(),
  });
});

module.exports = router;
