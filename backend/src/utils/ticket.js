"use strict";

/**
 * ticket.js — Unique ticket ID generator for DSR and Grievance management.
 *
 * DPDP Act 2023 requirement: Every Data Subject Request and Grievance must
 * receive a unique, human-readable reference number so the data principal
 * can track the status of their request.
 *
 * Format: PREFIX-YYYYMMDD-XXXXXXXX
 *   e.g.  DSR-20250619-A3F2C1D8
 *         GRV-20250619-B8E4A7F1
 */

const crypto = require("crypto");

/**
 * Generates a unique, collision-resistant ticket ID.
 * @param {string} prefix  e.g. "DSR" or "GRV"
 * @returns {string}       e.g. "DSR-20250619-A3F2C1D8"
 */
function generateTicketId(prefix) {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const rand = crypto.randomBytes(4).toString("hex").toUpperCase();     // 8 hex chars
  return `${prefix}-${date}-${rand}`;
}

module.exports = { generateTicketId };
