# Grievance Workflow — mycashbridge.com

## Regulatory Basis

- **DPDP Act 2023, s.11(5)** — Right to have grievance addressed
- **RBI Digital Lending Guidelines (Sep 2022), Para 10** — Grievance Redressal Officer (GRO) mandatory
- **RBI Master Direction on Grievance Redressal** — 30-day resolution for lending complaints

## Grievance Officer

| Field | Value |
|---|---|
| Email | grievance@mycashbridge.com |
| Response SLA | 30 days |
| DPDP Complaints | grievance@mycashbridge.com |

> **Action Required**: Formally appoint a named individual as Grievance Officer. Publish name + contact on the website and in loan documents. Required for RBI LSP compliance.

## Grievance Categories

| Category | Description | Priority |
|---|---|---|
| `data_privacy` | Data misuse, sharing without consent, DPDP violation | high |
| `loan_process` | Delay, rejection, incorrect assessment | normal |
| `communication` | Unwanted calls, spam SMS, harassment | high |
| `data_accuracy` | Wrong data in system, credit score impact | normal |
| `consent` | Consent not obtained, forced consent | high |
| `other` | Anything not covered above | normal |

## End-to-End Flow

```
1. Data Principal visits /pages/grievance.html (or equivalent contact page)
2. Submits POST /api/grievance/create with: name, mobile, category, description
3. Backend validates and assigns GRV-YYYYMMDD-XXXXXXXX ticket
4. Acknowledgement email sent to user
5. Internal alert to NOTIFICATION_EMAIL
6. User can track: GET /api/grievance/status/:ticketId
7. Compliance team resolves within 30 days
```

## Escalation Matrix

| Level | Threshold | Escalation Path |
|---|---|---|
| L1 | All incoming grievances | grievance@mycashbridge.com |
| L2 | Unresolved after 15 days | Grievance Officer personal attention |
| L3 | Unresolved after 30 days | Refer to RBI Ombudsman (if applicable) |
| DPDP | Data privacy violation | Data Protection Board (when constituted) |

## Grievance Document Schema

```json
{
  "_id": "ObjectId",
  "ticketId": "GRV-20250115-EF56GH78",
  "category": "data_privacy",
  "status": "open",
  "priority": "high",
  "name": "Priya Nair",
  "mobile": "9876543210",
  "email": "priya@example.com",
  "description": "I received calls from unknown banks after submitting enquiry",
  "createdAt": "ISODate",
  "updatedAt": "ISODate",
  "resolvedAt": null,
  "assignedTo": null,
  "resolutionNotes": null,
  "auditTrail": []
}
```

## Reporting

```bash
GET /api/admin/grievances?status=open&format=csv
Authorization: X-Admin-Key: <ADMIN_API_KEY>
```

Returns all grievances filterable by status. CSV export available for regulatory submissions.

## Regulatory Disclosure Requirement

Per RBI DL Guidelines, the Grievance Officer's name and contact details must be:
1. Published on the website homepage / footer
2. Included in the Key Fact Statement (KFS) provided to borrowers
3. Submitted to RBI in the LSP registration/renewal filing
