# DSR Workflow — mycashbridge.com

## Regulatory Basis

- **DPDP Act 2023, s.11** — Data Principal rights: access, correction, erasure, grievance
- **DPDP Act 2023, s.12** — Right to nomination
- **DPDP Act 2023, s.13** — Right to withdraw consent
- **DPDP Rules (draft)** — Response within 30 days (48-hour acknowledgement expected)

## Request Types Supported

| Request Type | DPDP Section | Description |
|---|---|---|
| `access` | s.11(1)(a) | Summary of what data is held |
| `correction` | s.11(1)(b) | Correct inaccurate personal data |
| `erasure` | s.11(1)(c) | Delete personal data |
| `withdraw_consent` | s.13 | Withdraw processing consent |
| `portability` | s.11(3) | Export data in machine-readable format |
| `other` | — | Any other request |

## End-to-End Flow

```
1. Data Principal visits /pages/user-rights.html
2. Fills form: name, mobile, email (optional), request type, details
3. Accepts authorisation checkbox
4. Submits → POST /api/dsr/create
5. Backend validates: name (required), mobile 10-digit (required)
6. Ticket generated: DSR-YYYYMMDD-XXXXXXXX
7. Record inserted to dsrRequests MongoDB collection
8. Acknowledgement email sent to user (if SMTP configured)
9. Internal notification sent to NOTIFICATION_EMAIL
10. User sees ticket ID on confirmation screen
11. User can check status: GET /api/dsr/status/:ticketId
12. Compliance team processes via admin API or directly in MongoDB
13. On resolution: update status, add resolutionNotes, append to auditTrail[]
```

## Ticket Status Lifecycle

```
open → in_progress → resolved → closed
                   ↘ on hold (if identity verification needed)
```

## Ticket Document Schema

```json
{
  "_id": "ObjectId",
  "ticketId": "DSR-20250115-AB12CD34",
  "requestType": "erasure",
  "status": "open",
  "priority": "normal",
  "name": "Rohan Sharma",
  "mobile": "9876543210",
  "email": "rohan@example.com",
  "details": "Please erase all my personal data",
  "createdAt": "ISODate",
  "updatedAt": "ISODate",
  "assignedTo": null,
  "resolutionNotes": null,
  "auditTrail": [
    { "action": "CREATED", "by": "system", "timestamp": "ISODate" }
  ]
}
```

## SLA Targets

| Event | Target |
|---|---|
| Acknowledgement email | Within 48 hours |
| Identity verification request | Within 72 hours |
| Full response / resolution | Within 30 days |
| Complex requests (legal review) | Extension up to 30 additional days with notice |

## Admin Management

Compliance team accesses tickets via:

```bash
GET /api/admin/dsr
  ?status=open
  ?format=csv         ← downloads as spreadsheet
  Authorization: X-Admin-Key: <ADMIN_API_KEY>
```

## Audit Trail

Every status change must be recorded in `auditTrail[]` with:
- `action`: e.g., `STATUS_CHANGED`, `ASSIGNED`, `RESOLVED`
- `by`: admin identifier or `"system"`
- `timestamp`: ISODate
- `notes`: (optional) free text

This array is immutable from the data principal's perspective — used as evidence of processing.
