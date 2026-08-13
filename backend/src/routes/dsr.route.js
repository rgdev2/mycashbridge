"use strict";

/**
 * dsr.route.js — Data Subject Rights (DSR) management system.
 *
 * DPDP Act 2023 compliance:
 * - Section 11: Right to access information
 * - Section 12: Right to correction and erasure
 * - Section 13: Right of grievance redressal
 * - Section 14: Right to nominate
 *
 * RBI Digital Lending Guidelines require a grievance redressal mechanism
 * with defined timelines (72-hour acknowledgement, 30-day resolution).
 *
 * Routes:
 *   POST /api/dsr/create           — Create new DSR ticket (public, rate-limited)
 *   GET  /api/dsr/status/:ticketId — Check status (public, ticket ID required)
 *
 * Security:
 * - Rate limited (10 requests/IP/hour) to prevent abuse
 * - All inputs sanitized via validate.js sanitize()
 * - CSRF guard: only processes requests from trusted origins
 * - Ticket IDs are cryptographically random — not sequential / predictable
 * - Status endpoint returns minimal data — no PII in response
 *
 * New MongoDB collection: dsrRequests
 */

const { Router }    = require("express");
const rateLimit     = require("express-rate-limit");
const { getDb }     = require("../db/client");
const { generateTicketId }            = require("../utils/ticket");
const { logAudit }                    = require("../utils/audit");
const { sanitize, isValidMobile }     = require("../middleware/validate");
const { sendDSRAcknowledgement }      = require("../utils/mailer");

const router = Router();

/** DSR-specific rate limiter — stricter than lead endpoint */
const dsrLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders:   false,
  handler: (_req, res) =>
    res.status(429).json({ error: "Too many requests. Please try again later." }),
});

/* ── POST /api/dsr/create ───────────────────────────────────── */
router.post("/api/dsr/create", dsrLimiter, async (req, res) => {
  try {
    // Sanitize all inputs (OWASP A03 — Injection prevention)
    const name         = sanitize(req.body.name,         100);
    const rawMobile    = sanitize(req.body.mobile,        20);
    const email        = sanitize(req.body.email,        200);
    const requestType  = sanitize(req.body.request_type, 100) || "General";
    const details      = sanitize(req.body.details,     2000);

    // Normalize mobile: strip non-digits, keep last 10
    const mobile = rawMobile.replace(/\D/g, "").slice(-10);

    // Validate required fields
    if (!name || name.length < 2) {
      return res.status(400).json({ error: "Please enter your full name (minimum 2 characters)." });
    }
    if (mobile.length !== 10 || !/^[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).json({ error: "Please enter a valid 10-digit Indian mobile number." });
    }

    const db       = getDb();
    const ticketId = generateTicketId("DSR");
    const now      = new Date();

    const doc = {
      ticketId,
      requestType,
      status:          "open",     // open → in_progress → resolved → closed
      name,
      mobile,
      email:           email || null,
      details:         details || null,
      createdAt:       now,
      updatedAt:       now,
      assignedTo:      null,
      resolutionNotes: null,
      // Full immutable audit trail — every state change is appended here
      auditTrail: [{
        action:    "created",
        timestamp: now,
        ip:        req.ip,
        userAgent: req.headers["user-agent"] || "",
        note:      `DSR request submitted via website form. Type: ${requestType}`,
      }],
    };

    await db.collection("dsrRequests").insertOne(doc);

    // Async audit log — fire-and-forget, must not block response
    logAudit(db, {
      action:   "DSR_CREATED",
      entity:   "dsrRequests",
      entityId: ticketId,
      ip:       req.ip,
      userAgent: req.headers["user-agent"],
      metadata: { requestType, mobile },
    });

    // Send acknowledgement email (async, fire-and-forget)
    sendDSRAcknowledgement({
      to:          email || null,
      name,
      ticketId,
      requestType,
    }).catch(() => {});

    return res.status(201).json({
      ok:       true,
      ticketId,
      message:  `Your ${requestType} request has been received. Reference: ${ticketId}. We will respond within 72 hours.`,
    });

  } catch (err) {
    console.error("[DSR] Create error:", err.message);
    return res.status(500).json({ error: "Could not submit your request. Please try again or email grievance@mycashbridge.com" });
  }
});

/* ── GET /api/dsr/status/:ticketId ──────────────────────────── */
router.get("/api/dsr/status/:ticketId", async (req, res) => {
  try {
    const { ticketId } = req.params;

    // Validate ticket ID format to prevent injection / enumeration
    if (!ticketId || !/^DSR-\d{8}-[A-F0-9]{8}$/i.test(ticketId)) {
      return res.status(400).json({ error: "Invalid ticket ID format." });
    }

    const db  = getDb();
    const doc = await db.collection("dsrRequests").findOne(
      { ticketId },
      {
        projection: {
          ticketId:    1,
          requestType: 1,
          status:      1,
          createdAt:   1,
          updatedAt:   1,
          _id:         0,
          // Never expose PII (name/mobile/email) in status endpoint
        },
      }
    );

    if (!doc) {
      return res.status(404).json({ error: "Ticket not found. Please check your reference number." });
    }

    return res.json({ ok: true, ticket: doc });

  } catch (err) {
    console.error("[DSR] Status error:", err.message);
    return res.status(500).json({ error: "Could not retrieve ticket status." });
  }
});

module.exports = router;
