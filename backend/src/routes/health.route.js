"use strict";

const { Router } = require("express");
const { isConnected } = require("../db/client");

const router = Router();

/**
 * GET /health
 * Used by load balancers, uptime monitors, and deployment health checks.
 */
router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    db:     isConnected() ? "connected" : "disconnected",
    ts:     new Date().toISOString(),
  });
});

module.exports = router;
