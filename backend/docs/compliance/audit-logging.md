# Audit Logging — mycashbridge.com

## Purpose

The `auditLogs` MongoDB collection provides an immutable record of all significant data processing events for:

1. **DPDP Act 2023** — demonstrating lawful processing and consent evidence
2. **RBI Audit** — traceability of lead data flows
3. **Internal security** — anomaly detection, breach investigation
4. **Incident response** — forensic timeline reconstruction

## What is Logged

| Action | Triggered By | Entity |
|---|---|---|
| `LEAD_CREATED` | `POST /api/lead` | `leads` |
| `DSR_CREATED` | `POST /api/dsr/create` | `dsrRequests` |
| `GRIEVANCE_CREATED` | `POST /api/grievance/create` | `grievances` |
| `COOKIE_CONSENT_SAVED` | `POST /api/cookie-consent` | `cookieConsents` |

### Future events to add (raise PR)

| Action | Description |
|---|---|
| `DSR_STATUS_CHANGED` | Compliance team updates ticket |
| `LEAD_ANONYMIZED` | Retention job anonymises record |
| `ADMIN_EXPORT` | Admin downloads CSV |
| `LOGIN_ATTEMPT` | If admin portal is added |

## Audit Log Document Schema

```json
{
  "_id": "ObjectId",
  "action": "LEAD_CREATED",
  "entity": "leads",
  "entityId": "ObjectId (inserted document _id)",
  "userId": null,
  "ip": "103.x.x.x",
  "userAgent": "Mozilla/5.0 ...",
  "metadata": {
    "product_type": "Personal Loan",
    "consent_version": "v1.0"
  },
  "timestamp": "ISODate"
}
```

### Fields

| Field | Type | Description |
|---|---|---|
| `action` | String | Enum of action types (see above) |
| `entity` | String | MongoDB collection name affected |
| `entityId` | ObjectId | `_id` of the affected document |
| `userId` | String/null | Admin user ID if applicable; null for public actions |
| `ip` | String | Client IP address at time of action |
| `userAgent` | String | User-Agent header |
| `metadata` | Object | Action-specific context (no PII) |
| `timestamp` | Date | UTC timestamp |

## Important: No PII in Audit Logs

The `metadata` object must **never** contain name, mobile, email, PAN, or other direct identifiers. Reference the `entityId` to look up the original record if needed.

IP addresses are retained for 5 years as required for security/legal purposes.

## Querying Audit Logs

```bash
# All LEAD_CREATED events today
GET /api/admin/audit-logs?action=LEAD_CREATED
Authorization: X-Admin-Key: <ADMIN_API_KEY>

# CSV export for regulatory submission
GET /api/admin/audit-logs?format=csv
```

## Retention

Audit logs are retained for **5 years** (no anonymisation).  
After 5 years, documents may be archived to cold storage or deleted.

## Implementation Reference

- Logger utility: `backend/src/utils/audit.js`
- Function: `logAudit(db, { action, entity, entityId, userId, ip, userAgent, metadata })`
- All calls are fire-and-forget — logging failures never break the main request
- Collection indexed on: `timestamp` (desc), `action`, `entity`, `entityId`
