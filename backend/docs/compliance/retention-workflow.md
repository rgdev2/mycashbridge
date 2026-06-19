# Retention Workflow — mycashbridge.com

## Regulatory Basis

- **DPDP Act 2023, s.8(7)** — Personal data must be erased when the purpose is fulfilled or consent is withdrawn
- **RBI Guidelines** — Lending-related records: 5-10 years depending on category  
- **Indian Contract Act** — Limitation period 3 years for contractual claims

## Retention Periods

| Data Category | Collection | Retention | Action After |
|---|---|---|---|
| New/uncalled leads | `leads_*` where status=`new` | 90 days | Anonymise PII |
| Contacted/converted leads | `leads_*` where status=`contacted`/`converted` | 3 years | Anonymise PII |
| DSR request records | `dsrRequests` | 2 years | Anonymise PII in ticket |
| Grievance records | `grievances` | 2 years | Anonymise PII in ticket |
| Audit logs | `auditLogs` | 5 years | No action (no direct PII) |
| Cookie consent evidence | `cookieConsents` | 1 year | No action (IP already hashed) |

## Anonymisation vs Deletion

We **anonymise** rather than delete for these reasons:
1. Aggregate analytics / fraud detection still possible without PII
2. Audit trail integrity preserved (record count, timestamps, UTM data retained)
3. Easier reversibility if business or regulatory requirements change

### What is anonymised

```js
{
  name:           "[anonymized]",
  mobile:         "[anonymized]",
  email:          "[anonymized]",
  pan:            "[anonymized]",
  city:           "[anonymized]",
  monthly_income: "[anonymized]",
  employment:     "[anonymized]",
}
```

### What is preserved (non-PII)

```
_id, status, submitted_at, product_type, source_page,
utm_source, utm_medium, utm_campaign, utm_term, utm_content,
consent.serviceConsent, consent.marketingConsent,
consent.consentVersion, consent.consentTextHash,
consent.consentTimestamp
```

Note: `consent.consentIP` and `consent.consentUserAgent` are also anonymised as they are PII.

## Automated Schedule

The retention job runs daily at **02:00 UTC** via `node-cron`.

**Entry point**: `backend/src/jobs/retention.job.js`  
**Cron expression**: `0 2 * * *`

### Job Steps

1. Query leads older than threshold with PII intact
2. Bulk-update PII fields to `[anonymized]`
3. Write one `retentionLog` entry per affected record
4. Query old DSR/grievance records
5. Anonymise PII in old tickets
6. Write log entries

### Retention Log Schema

```json
{
  "_id": "ObjectId",
  "recordId": "ObjectId (reference to affected record)",
  "collection": "leads_personal_loan",
  "action": "ANONYMIZED",
  "reason": "Exceeded 90-day retention for uncalled lead",
  "timestamp": "ISODate"
}
```

## Manual Execution

To run the retention job manually (e.g., for testing or catch-up):

```js
const { runRetentionJob } = require("./src/jobs/retention.job");
runRetentionJob().then(() => console.log("Done"));
```

Or via admin API (future enhancement — raise a PR to add `POST /api/admin/run-retention`).

## Monitoring

Check recent retention activity:

```bash
GET /api/admin/retention-logs?limit=100
Authorization: X-Admin-Key: <ADMIN_API_KEY>
```

## Erasure on DSR Request

When a data principal submits an erasure request (`request_type: "erasure"` in DSR):
1. Compliance team locates records by mobile number
2. Manually anonymises records immediately (do not wait for cron)
3. Updates DSR ticket status to `resolved` with `resolutionNotes` documenting action
4. Confirms in writing to data principal within 30 days
