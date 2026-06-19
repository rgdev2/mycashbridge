# Data Flow — mycashbridge.com

## Overview

```
User Browser
    │
    │  HTTPS POST /api/lead
    ▼
Express Server (backend/server.js)
    │
    ├─ middleware/validate.js     ← sanitise, extract consent fields
    │
    ├─ routes/leads.route.js      ← build lead document + consent sub-doc
    │
    ▼
MongoDB Atlas (collection: leads_*)
    │
    ├─ auditLogs collection        ← LEAD_CREATED event recorded
    │
    └─ (async) partner banks/NBFCs via internal LMS (Domestic LMS)
```

## Lead Document Schema (at rest)

```json
{
  "_id": "ObjectId",
  "name": "Rohan Sharma",
  "mobile": "+91 9876543210",
  "city": "Pune",
  "monthly_income": "₹50,000 – ₹1,00,000",
  "employment": "Salaried",
  "product_type": "Personal Loan",
  "source_page": "/loans/personal-loan.html",
  "status": "new",
  "submitted_at": "ISODate",

  "consent": {
    "serviceConsent":   true,
    "marketingConsent": false,
    "consentVersion":   "v1.0",
    "consentTimestamp": "ISODate",
    "consentIP":        "103.x.x.x",
    "consentUserAgent": "Mozilla/5.0 ...",
    "consentChannel":   "website",
    "consentTextHash":  "sha256:..."
  },

  "utm_source":   "google",
  "utm_medium":   "cpc",
  "utm_campaign": "personal-loan-may-2025"
}
```

## Data Purpose (DPDP s.5 — stated purpose)

| Data Field | Purpose | Legal Basis |
|---|---|---|
| Name, Mobile, City | Loan enquiry processing; passed to partner banks | Consent (s.6) |
| Monthly income, Employment | Eligibility pre-screening by partners | Consent (s.6) |
| PAN (optional) | Credit profile lookup by partners | Consent (s.6) |
| UTM fields | Internal marketing analytics | Legitimate interest |
| IP address (consent doc) | Consent audit trail | Legal obligation (DPDP s.6) |
| User Agent (consent doc) | Consent audit trail | Legal obligation (DPDP s.6) |

## Third-Party Data Sharing

| Recipient | Data Shared | Basis | DPA Status |
|---|---|---|---|
| Partner Banks/NBFCs (via LMS) | Name, Mobile, City, Income, Employment | Consent | Pending execution |
| MongoDB Atlas (storage) | All fields | Processor agreement | Review SCC/DPA |
| Hostinger (hosting) | None (compute only) | Processor | Review DPA |

## Data NOT Shared

- PAN card is optional and explicitly not stored in the lead if not provided
- UTM data is not shared with partners
- Consent sub-document is internal audit use only

## Cookie / Analytics Data Flow

```
User accepts analytics cookies
    │
    ├─ localStorage: cb_cookie JSON
    │
    └─ POST /api/cookie-consent   ← server-side evidence stored in MongoDB
         │
         └─ cookieConsents collection
```

Google Analytics, if present, is only loaded after analytics consent.
