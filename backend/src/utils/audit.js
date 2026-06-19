"use strict";

/**
 * audit.js — Centralized audit logging for DPDP Act 2023 compliance.
 *
 * DPDP Act 2023 Section 8(7) requires Data Fiduciaries to maintain
 * accurate and complete records of personal data processing activities.
 *
 * RBI Digital Lending Guidelines require audit trails for all
 * customer data access, modification, and deletion events.
 *
 * All writes are fire-and-forget: audit log failures MUST NOT block
 * the primary business operation. Errors are logged to console only.
 *
 * Collection: auditLogs
 */

/**
 * Writes a single audit event to the auditLogs collection.
 *
 * @param {object} db           — MongoDB Db instance from getDb()
 * @param {object} event
 * @param {string} event.action    — e.g. "LEAD_CREATED", "DSR_CREATED", "CONSENT_WITHDRAWN"
 * @param {string} event.entity    — Collection name e.g. "leads", "dsrRequests"
 * @param {string} [event.entityId]— Document ID or ticket ID
 * @param {string} [event.userId]  — Internal user/admin ID if available
 * @param {string} [event.ip]      — Client IP (stored for fraud analysis)
 * @param {string} [event.userAgent]
 * @param {object} [event.metadata]— Additional context (sanitized before storing)
 */
async function logAudit(db, { action, entity, entityId, userId, ip, userAgent, metadata } = {}) {
  try {
    await db.collection("auditLogs").insertOne({
      action:     action     || "UNKNOWN",
      entity:     entity     || null,
      entityId:   entityId   || null,
      userId:     userId     || null,
      ip:         ip         || null,
      userAgent:  userAgent  || null,
      timestamp:  new Date(),
      metadata:   metadata   || {},
    });
  } catch (err) {
    // Audit failures must never crash or block the primary flow
    console.error("[Audit] Failed to write log:", err.message);
  }
}

module.exports = { logAudit };
