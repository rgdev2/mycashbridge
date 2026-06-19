"use strict";

/**
 * retention.job.js — Automated data retention enforcement engine.
 *
 * DPDP Act 2023 Section 8(7): Data Fiduciaries must not retain personal
 * data for longer than necessary for the stated purpose.
 *
 * MyCashBridge retention rules (per data-retention.html policy):
 *   - Uncontacted leads (status: "new") older than 90 days → anonymize
 *   - Processed leads (status: "contacted"/"converted") older than 3 years → anonymize
 *   - DSR requests older than 2 years → archive (anonymize PII, keep ticket metadata)
 *   - Grievances older than 2 years → archive
 *
 * "Anonymize" means replacing PII fields with "[anonymized]" — NOT deleting
 * the record, so that aggregate analytics (count, category, date) remain valid.
 * This follows the principle of data minimization while preserving business records.
 *
 * All retention actions are written to the immutable retentionLogs collection
 * so they can be produced as evidence in regulatory audits.
 *
 * Schedule: Runs daily at 02:00 server time (node-cron).
 * Can also be triggered manually via runRetentionJob().
 */

const { getDb }    = require("../db/client");
const { logAudit } = require("../utils/audit");

/** Try to load node-cron. If unavailable, retention job simply does not schedule. */
let cron = null;
try {
  cron = require("node-cron");
} catch (_) {
  console.warn("[Retention] node-cron not installed — scheduled job disabled. Run: npm install node-cron");
}

/** Lead collections to process */
const LEAD_COLLECTIONS = [
  "leads_loans",
  "leads_insurance",
  "leads_cards",
  "leads_investments",
  "leads_general",
  "leads",
];

/**
 * Anonymizes PII fields on a document without deleting the record.
 * Preserves: _id, service_category, product_type, submitted_at, status,
 *            utm_*, source_page (non-PII) for analytics.
 */
const ANONYMIZED_FIELDS = {
  name:           "[anonymized]",
  mobile:         "[anonymized]",
  city:           "[anonymized]",
  monthly_income: "[anonymized]",
  employment:     "[anonymized]",
  ip:             "[anonymized]",
  loan_amount:    "[anonymized]",
  // Consent sub-document PII — keep version/hash for audit, clear IP/UA
  "consent.consentIP":        "[anonymized]",
  "consent.consentUserAgent": "[anonymized]",
};

/**
 * Runs a single retention sweep.
 * @returns {Promise<{anonymized: number, archived: number}>}
 */
async function runRetentionJob() {
  const db  = getDb();
  const now = new Date();

  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const threeYearsAgo = new Date(now.getTime() - 3  * 365 * 24 * 60 * 60 * 1000);
  const twoYearsAgo   = new Date(now.getTime() - 2  * 365 * 24 * 60 * 60 * 1000);

  let anonymized = 0;
  let archived   = 0;

  /* ── 1. Lead retention ───────────────────────────────────── */
  for (const colName of LEAD_COLLECTIONS) {
    try {
      // Rule A: Uncontacted leads older than 90 days
      const staleNew = await db.collection(colName)
        .find({
          status:       "new",
          submitted_at: { $lt: ninetyDaysAgo },
          name:         { $ne: "[anonymized]" }, // skip already-anonymized
        }, { projection: { _id: 1 } })
        .toArray();

      for (const lead of staleNew) {
        await db.collection(colName).updateOne(
          { _id: lead._id },
          {
            $set: {
              ...ANONYMIZED_FIELDS,
              anonymized_at:          now,
              anonymization_reason:   "Retention rule: uncontacted lead > 90 days (DPDP s.8(7))",
            },
          }
        );
        await db.collection("retentionLogs").insertOne({
          collection: colName,
          recordId:   lead._id.toString(),
          action:     "anonymized",
          reason:     "Uncontacted lead older than 90 days",
          timestamp:  now,
        });
        anonymized++;
      }

      // Rule B: Processed leads older than 3 years
      const oldProcessed = await db.collection(colName)
        .find({
          status:       { $in: ["contacted", "converted"] },
          submitted_at: { $lt: threeYearsAgo },
          name:         { $ne: "[anonymized]" },
        }, { projection: { _id: 1 } })
        .toArray();

      for (const lead of oldProcessed) {
        await db.collection(colName).updateOne(
          { _id: lead._id },
          {
            $set: {
              ...ANONYMIZED_FIELDS,
              anonymized_at:        now,
              anonymization_reason: "Retention rule: processed lead > 3 years (DPDP s.8(7))",
            },
          }
        );
        await db.collection("retentionLogs").insertOne({
          collection: colName,
          recordId:   lead._id.toString(),
          action:     "anonymized",
          reason:     "Processed lead older than 3 years",
          timestamp:  now,
        });
        anonymized++;
      }

    } catch (err) {
      console.error(`[Retention] Error processing ${colName}:`, err.message);
    }
  }

  /* ── 2. DSR request archive ─────────────────────────────── */
  try {
    const oldDSR = await db.collection("dsrRequests")
      .find({
        createdAt: { $lt: twoYearsAgo },
        name:      { $ne: "[archived]" },
      }, { projection: { _id: 1, ticketId: 1 } })
      .toArray();

    for (const dsr of oldDSR) {
      await db.collection("dsrRequests").updateOne(
        { _id: dsr._id },
        {
          $set: {
            name:             "[archived]",
            mobile:           "[archived]",
            email:            "[archived]",
            details:          "[archived]",
            archived_at:      now,
            archive_reason:   "Retention rule: DSR record > 2 years",
          },
        }
      );
      await db.collection("retentionLogs").insertOne({
        collection: "dsrRequests",
        recordId:   dsr.ticketId || dsr._id.toString(),
        action:     "archived",
        reason:     "DSR PII archived after 2 years",
        timestamp:  now,
      });
      archived++;
    }
  } catch (err) {
    console.error("[Retention] DSR archive error:", err.message);
  }

  /* ── 3. Grievance archive ───────────────────────────────── */
  try {
    const oldGrv = await db.collection("grievances")
      .find({
        createdAt: { $lt: twoYearsAgo },
        name:      { $ne: "[archived]" },
      }, { projection: { _id: 1, ticketId: 1 } })
      .toArray();

    for (const grv of oldGrv) {
      await db.collection("grievances").updateOne(
        { _id: grv._id },
        {
          $set: {
            name:           "[archived]",
            mobile:         "[archived]",
            email:          "[archived]",
            description:    "[archived]",
            archived_at:    now,
            archive_reason: "Retention rule: grievance record > 2 years",
          },
        }
      );
      await db.collection("retentionLogs").insertOne({
        collection: "grievances",
        recordId:   grv.ticketId || grv._id.toString(),
        action:     "archived",
        reason:     "Grievance PII archived after 2 years",
        timestamp:  now,
      });
      archived++;
    }
  } catch (err) {
    console.error("[Retention] Grievance archive error:", err.message);
  }

  const total = anonymized + archived;
  if (total > 0) {
    console.log(`[Retention] ${now.toISOString()} — anonymized ${anonymized}, archived ${archived} records`);
    // Log to audit trail
    logAudit(getDb(), {
      action:   "RETENTION_JOB_COMPLETED",
      entity:   "retentionLogs",
      metadata: { anonymized, archived, runAt: now.toISOString() },
    }).catch(() => {});
  }

  return { anonymized, archived };
}

/**
 * Registers the daily 02:00 cron job.
 * Called once from server.js after DB connects.
 */
function startRetentionJob() {
  if (!cron) {
    console.warn("[Retention] Scheduler not started — node-cron unavailable");
    return;
  }
  // "0 2 * * *" = at 02:00 every day
  cron.schedule("0 2 * * *", async () => {
    console.log("[Retention] Starting daily retention sweep…");
    try {
      await runRetentionJob();
    } catch (err) {
      console.error("[Retention] Job failed:", err.message);
    }
  });
  console.log("[Retention] Daily retention job scheduled at 02:00");
}

module.exports = { startRetentionJob, runRetentionJob };
