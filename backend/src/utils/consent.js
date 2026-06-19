"use strict";

const crypto = require("crypto");

/**
 * consent.js — Centralized consent management for DPDP Act 2023 compliance.
 *
 * DPDP Act 2023 Section 6 requires:
 * - Consent must be free, specific, informed, unconditional and unambiguous.
 * - Consent must be obtained through a clear affirmative action.
 * - A record of consent must be maintained as evidence.
 * - Service consent (for processing the application) is REQUIRED.
 * - Marketing consent (for promotional comms) is OPTIONAL and must be separate.
 *
 * This file defines the authoritative consent text and version so that:
 * - Backend and frontend stay in sync.
 * - When consent text changes, the version is bumped and old records remain valid.
 * - SHA256 hash of the consent text is stored with every lead for audit proof.
 */

/** Bump this when the canonical consent text changes (triggers re-consent flow). */
const CONSENT_VERSION = "v1.0";

/**
 * Canonical consent text for service consent (Required).
 * Stored as-defined; SHA256 hash of this string (with version suffix) is persisted
 * in the consent sub-document of every lead record.
 */
const CONSENT_TEXT_SERVICE =
  "I authorise MyCashBridge and its partner banks/NBFCs to contact me regarding my " +
  "loan enquiry via call, SMS, email or WhatsApp to process my application, and I accept " +
  "the Terms & Conditions and Privacy Policy. This overrides my DND/NDNC registration.";

/**
 * Canonical consent text for marketing consent (Optional).
 * Stored separately; data principal may opt in without affecting the primary application.
 */
const CONSENT_TEXT_MARKETING =
  "I consent to receive promotional communications about other financial products and " +
  "services from MyCashBridge and its partners via call, SMS, email or WhatsApp.";

/**
 * Returns a SHA256 hash of the consent text bound to the current version.
 * If the text or version changes, the hash changes, creating an immutable audit trail.
 *
 * @param {string} text  The consent text to hash (use CONSENT_TEXT_SERVICE above)
 * @returns {string}     64-character hex SHA256 digest
 */
function hashConsentText(text) {
  return crypto
    .createHash("sha256")
    .update(text + " [" + CONSENT_VERSION + "]", "utf8")
    .digest("hex");
}

/** Pre-computed hash of the current service consent text — stored on every lead. */
const SERVICE_CONSENT_HASH = hashConsentText(CONSENT_TEXT_SERVICE);

module.exports = {
  CONSENT_VERSION,
  CONSENT_TEXT_SERVICE,
  CONSENT_TEXT_MARKETING,
  hashConsentText,
  SERVICE_CONSENT_HASH,
};
