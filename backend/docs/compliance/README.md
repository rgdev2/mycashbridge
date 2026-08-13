# Compliance Documentation — mycashbridge.com

**Entity**: Reddington Global Consultancy Private Limited  
**CIN**: U72501HR2022PTC104372  
**Role**: Lending Service Provider (LSP) — not a bank or NBFC  
**Domain**: mycashbridge.com  
**Framework versions**: DPDP Act 2023, RBI Digital Lending Guidelines (Sep 2022), IT Act 2000 s.43A

---

## Index

| Document | Description |
|---|---|
| [data-flow.md](./data-flow.md) | End-to-end data flow: form → API → MongoDB → partners |
| [consent-workflow.md](./consent-workflow.md) | Consent collection, storage, and versioning |
| [dsr-workflow.md](./dsr-workflow.md) | Data Subject Rights (DSR) ticket lifecycle |
| [grievance-workflow.md](./grievance-workflow.md) | Grievance Officer escalation matrix |
| [retention-workflow.md](./retention-workflow.md) | Retention periods, anonymisation schedule |
| [audit-logging.md](./audit-logging.md) | Audit log schema and what is recorded |

---

## Compliance Status Summary

| Area | Status | Gap |
|---|---|---|
| DPDP s.5 — Purpose notice | ✅ Implemented | None |
| DPDP s.6 — Granular consent | ✅ Implemented | None |
| DPDP s.11 — DSR handling | ✅ Implemented | DPA execution with processors pending |
| DPDP s.9 — Data retention | ✅ Automated (daily cron) | None |
| RBI — No third-party data sharing without consent | ✅ Implemented | None |
| RBI — Grievance Redressal | ✅ Backend + page exists | Appoint named GO formally |
| Cookie consent evidence | ✅ Server-side storage | None |
| Processor inventory | ✅ Seeded in MongoDB | Execute formal DPAs |
| Nonce-based CSP | ❌ Deferred | Requires server-side rendering |
| Formal DPIA | ❌ Not done | Commission before scale |

---

## Key Contacts

| Role | Contact |
|---|---|
| Grievance Officer | grievance@mycashbridge.com |
| Data Principal Rights | grievance@mycashbridge.com |
| Legal / DPO | (appoint — required under DPDP Rules when notified) |

---

## Package Installation (Required)

After cloning, run in `backend/`:

```bash
npm install node-cron nodemailer --save
```

These packages are used by `src/jobs/retention.job.js` and `src/utils/mailer.js` respectively.  
Both fail gracefully if not installed (retention job logs a warning; mailer is silently disabled).

---

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `MONGO_URI` | ✅ | MongoDB Atlas connection string |
| `DB_NAME` | ✅ | Database name (`mycashbridge`) |
| `PORT` | optional | Default 3001 |
| `ALLOWED_ORIGIN` | ✅ | CORS origin (production domain) |
| `ADMIN_API_KEY` | ✅ | Protects `/api/admin/*` compliance endpoints |
| `SMTP_HOST` | optional | Email (acknowledgements) |
| `SMTP_PORT` | optional | Usually 465 or 587 |
| `SMTP_SECURE` | optional | `true` for 465, `false` for 587 |
| `SMTP_USER` | optional | SMTP username |
| `SMTP_PASS` | optional | SMTP password |
| `SMTP_FROM` | optional | From address |
| `NOTIFICATION_EMAIL` | optional | Internal compliance alert address |
