# Consent Workflow — mycashbridge.com

## Regulatory Basis

- **DPDP Act 2023, s.6** — Consent must be free, specific, informed, unconditional, unambiguous, and by a clear affirmative action
- **DPDP Act 2023, s.6(1)(a)** — Each purpose must have a separate consent item
- **DPDP Act 2023, s.6(4)** — Right to withdraw consent at any time (via DSR)
- **RBI DL Guidelines** — No data collection beyond stated purpose

## Consent Architecture

### Service Consent (Required)

Displayed on every lead form before the submit button:

> "I authorise [Brand] and its partner banks/NBFCs to contact me regarding my loan enquiry via call, SMS, email or WhatsApp to process my application, and I accept the Terms & Privacy Policy. This overrides my DND/NDNC registration."

- User must tick the checkbox to submit the form
- Stored in `consent.serviceConsent = true` on the lead document
- Canonical text SHA256-hashed and stored in `consent.consentTextHash`

### Marketing Consent (Optional, separate)

Displayed immediately below service consent:

> "I also consent to receive promotional communications about other financial products from [Brand] and its partners. (Optional)"

- Separate checkbox; pre-unchecked
- Not required for form submission
- Stored in `consent.marketingConsent = true/false`

## What is Stored (Consent Sub-Document)

```js
{
  serviceConsent:   Boolean,   // always true (required to submit)
  marketingConsent: Boolean,   // user choice
  consentVersion:   "v1.0",   // bump on any text change
  consentTimestamp: ISODate,
  consentIP:        String,    // DPDP audit requirement
  consentUserAgent: String,    // DPDP audit requirement
  consentChannel:   "website",
  consentTextHash:  "sha256:abc123..." // integrity check for canonical text
}
```

## Consent Versioning

| Version | Change | Date |
|---|---|---|
| v1.0 | Initial consent text with DPDP-compliant language | 2025-01 |

**When to bump the version**:  
Any change to service consent text, marketing consent text, or privacy policy that materially affects data processing. Update `CONSENT_VERSION` in both:
- `backend/src/utils/consent.js`
- `frontend/assets/site.js`

On version bump, existing users without the new version will be shown the new consent on next form submission.

## Cookie Consent

- Banner shown on first visit if `cb_cookie` not in localStorage
- User accepts/customises categories: necessary (always on), analytics, marketing
- On save: persisted to localStorage AND POST to `/api/cookie-consent`
- Server-side record in `cookieConsents` collection for audit trail

## Consent Withdrawal

Users may withdraw consent via the DSR form at `/pages/user-rights.html`.  
Select request type: **"Withdraw consent"**.  
Processing time: 30 days per DPDP s.11.
