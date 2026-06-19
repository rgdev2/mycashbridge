"use strict";

/**
 * grievance.route.js — Grievance management system.
 *
 * RBI Digital Lending Guidelines (2022) & DPDP Act 2023 Section 13 require:
 * - A named Grievance Officer
 * - Ticket-based tracking with unique reference numbers
 * - 48-hour acknowledgement timeline
 * - 30-business-day resolution target
 *
 * Route: POST /api/grievance/create
 *
 * This connects the existing grievance.html page (currently email-only) to
 * a proper backend workflow with MongoDB persistence and acknowledgement emails.
 *
 * New MongoDB collection: grievances
 */

const { Router }   = require("express");
const rateLimit    = require("express-rate-limit");
const { getDb }    = require("../db/client");
const { generateTicketId }            = require("../utils/ticket");
const { logAudit }                    = require("../utils/audit");
const { sanitize }                    = require("../middleware/validate");
const { sendGrievanceAcknowledgement } = require("../utils/mailer");

const router = Router();

/** Grievance rate limiter — stricter than lead (5/IP/hour) */
const grievanceLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders:   false,
  handler: (_req, res) =>
    res.status(429).json({ error: "Too many requests. Please try again later." }),
});

/* ── POST /api/grievance/create ─────────────────────────────── */
router.post("/api/grievance/create", grievanceLimiter, async (req, res) => {
  try {
    const name        = sanitize(req.body.name,        100);
    const rawMobile   = sanitize(req.body.mobile,       20);
    const email       = sanitize(req.body.email,       200);
    const category    = sanitize(req.body.category,    100) || "General";
    const description = sanitize(req.body.description, 3000);

    const mobile = rawMobile.replace(/\D/g, "").slice(-10);

    if (!name || name.length < 2) {
      return res.status(400).json({ error: "Please enter your full name." });
    }
    if (mobile.length !== 10 || !/^[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).json({ error: "Please enter a valid 10-digit mobile number." });
    }

    const db       = getDb();
    const ticketId = generateTicketId("GRV");
    const now      = new Date();

    const doc = {
      ticketId,
      category,
      status:   "open",    // open → acknowledged → in_progress → resolved → closed
      priority: "normal",  // normal | high | urgent (set by compliance team)
      name,
      mobile,
      email:       email || null,
      description: description || null,
      createdAt:   now,
      updatedAt:   now,
      resolvedAt:  null,
      assignedTo:  null,
      auditTrail: [{
        action:    "created",
        timestamp: now,
        ip:        req.ip,
        userAgent: req.headers["user-agent"] || "",
        note:      `Grievance submitted via website. Category: ${category}`,
      }],
    };

    await db.collection("grievances").insertOne(doc);

    logAudit(db, {
      action:   "GRIEVANCE_CREATED",
      entity:   "grievances",
      entityId: ticketId,
      ip:       req.ip,
      userAgent: req.headers["user-agent"],
      metadata: { category, mobile },
    });

    sendGrievanceAcknowledgement({ to: email || null, name, ticketId, category }).catch(() => {});

    return res.status(201).json({
      ok:       true,
      ticketId,
      message:  `Grievance received. Reference: ${ticketId}. We will acknowledge within 48 hours.`,
    });

  } catch (err) {
    console.error("[Grievance] Create error:", err.message);
    return res.status(500).json({ error: "Could not submit grievance. Please email grievance@mycashbridge.com" });
  }
});

/* ── GET /api/grievance/status/:ticketId ────────────────────── */
router.get("/api/grievance/status/:ticketId", async (req, res) => {
  try {
    const { ticketId } = req.params;

    if (!ticketId || !/^GRV-\d{8}-[A-F0-9]{8}$/i.test(ticketId)) {
      return res.status(400).json({ error: "Invalid ticket ID format." });
    }

    const db  = getDb();
    const doc = await db.collection("grievances").findOne(
      { ticketId },
      {
        projection: {
          ticketId:   1,
          category:   1,
          status:     1,
          priority:   1,
          createdAt:  1,
          updatedAt:  1,
          resolvedAt: 1,
          _id:        0,
        },
      }
    );

    if (!doc) {
      return res.status(404).json({ error: "Ticket not found." });
    }

    return res.json({ ok: true, ticket: doc });

  } catch (err) {
    console.error("[Grievance] Status error:", err.message);
    return res.status(500).json({ error: "Could not retrieve ticket status." });
  }
});

module.exports = router;
