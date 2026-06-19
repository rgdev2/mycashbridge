"use strict";

/**
 * mailer.js — Optional email notification service for DPDP compliance workflows.
 *
 * Used for:
 * - DSR acknowledgement emails (DPDP Act 2023 Section 11 — response within 72 hours)
 * - Grievance acknowledgement emails
 * - Internal compliance team notifications
 *
 * CONFIGURATION (all optional — gracefully disabled if not set):
 *   SMTP_HOST     e.g. "smtp.gmail.com" or "smtp.hostinger.com"
 *   SMTP_PORT     e.g. 587 (STARTTLS) or 465 (SSL)
 *   SMTP_SECURE   "true" for port 465, leave unset for 587
 *   SMTP_USER     SMTP account username / email
 *   SMTP_PASS     SMTP account password
 *   SMTP_FROM     Display name + address: "MyCashBridge Compliance <compliance@mycashbridge.com>"
 *   NOTIFICATION_EMAIL  Internal team email for compliance alerts
 *
 * If SMTP_HOST is not set, the mailer is disabled and all send calls return
 * silently — no errors, no crashes. This means the application is fully
 * functional without email configuration.
 */

let transporter = null;

/**
 * Initialises the nodemailer transporter if SMTP is configured.
 * Called once during server startup.
 */
function initMailer() {
  if (!process.env.SMTP_HOST) {
    console.log("[Mailer] SMTP_HOST not set — email notifications disabled");
    return;
  }
  try {
    const nodemailer = require("nodemailer");
    transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST,
      port:   parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log(`[Mailer] SMTP configured — ${process.env.SMTP_HOST}:${process.env.SMTP_PORT || 587}`);
  } catch (err) {
    console.error("[Mailer] Failed to initialise (nodemailer not installed?):", err.message);
  }
}

/**
 * Sends an email. Fire-and-forget safe — errors are logged, never thrown.
 *
 * @param {object} opts
 * @param {string}  opts.to      Recipient address(es)
 * @param {string}  opts.subject Email subject
 * @param {string}  opts.text    Plain-text body
 * @param {string}  [opts.html]  HTML body (optional)
 */
async function sendEmail({ to, subject, text, html }) {
  if (!transporter) return; // silently skip if not configured
  try {
    await transporter.sendMail({
      from:    process.env.SMTP_FROM || "MyCashBridge Compliance <noreply@mycashbridge.com>",
      to,
      subject,
      text,
      html,
    });
  } catch (err) {
    console.error("[Mailer] Send error:", err.message);
  }
}

/**
 * Sends a DSR acknowledgement to the data principal and the compliance team.
 * DPDP Act 2023 requires acknowledgement and response within 72 hours.
 */
async function sendDSRAcknowledgement({ to, name, ticketId, requestType }) {
  const subject = `Data Rights Request Received — Reference ${ticketId}`;
  const text = [
    `Dear ${name || "Data Principal"},`,
    "",
    `We have received your ${requestType || "data rights"} request.`,
    `Your reference number is: ${ticketId}`,
    "",
    "We will process your request within 72 hours as required under the Digital Personal Data Protection Act, 2023.",
    "",
    "You can check the status of your request at any time at:",
    "https://mycashbridge.com/pages/user-rights.html",
    "",
    "If you have questions, contact us at grievance@mycashbridge.com",
    "",
    "— MyCashBridge Compliance Team",
    "Reddington Global Consultancy Private Limited",
    "CIN: U72501HR2022PTC104372",
  ].join("\n");

  // Send to data principal (if email provided)
  if (to) await sendEmail({ to, subject, text });

  // Always notify the internal compliance team
  const notifyEmail = process.env.NOTIFICATION_EMAIL;
  if (notifyEmail) {
    await sendEmail({
      to:      notifyEmail,
      subject: `[DSR] New ${requestType} request — ${ticketId}`,
      text:    `Name: ${name}\nTicket: ${ticketId}\nType: ${requestType}\n\nReview in admin dashboard.`,
    });
  }
}

/**
 * Sends a grievance acknowledgement to the complainant and the compliance team.
 */
async function sendGrievanceAcknowledgement({ to, name, ticketId, category }) {
  const subject = `Grievance Received — Reference ${ticketId}`;
  const text = [
    `Dear ${name || "Customer"},`,
    "",
    `We have received your grievance regarding: ${category || "General"}.`,
    `Your reference number is: ${ticketId}`,
    "",
    "We will acknowledge your complaint within 48 hours and aim to resolve it within 30 business days,",
    "as per our Grievance Redressal Policy.",
    "",
    "Grievance Officer: grievance@mycashbridge.com",
    "",
    "— MyCashBridge Customer Support",
    "Reddington Global Consultancy Private Limited",
  ].join("\n");

  if (to) await sendEmail({ to, subject, text });

  const notifyEmail = process.env.NOTIFICATION_EMAIL;
  if (notifyEmail) {
    await sendEmail({
      to:      notifyEmail,
      subject: `[GRV] New grievance — ${ticketId}`,
      text:    `Name: ${name}\nTicket: ${ticketId}\nCategory: ${category}\n\nReview in admin dashboard.`,
    });
  }
}

module.exports = { initMailer, sendEmail, sendDSRAcknowledgement, sendGrievanceAcknowledgement };
