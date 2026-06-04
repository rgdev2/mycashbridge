# CODING AGENTS: READ THIS FIRST

This is a **handoff bundle** from Claude Design (claude.ai/design).

A user mocked up designs in HTML/CSS/JS using an AI design tool, then exported this bundle so a coding agent can implement the designs for real.

## What you should do — IMPORTANT

**Find the primary design file under `cash-bridge/project/` and read it top to bottom.** Then **follow its imports**: open every file it pulls in (shared components, CSS, scripts) so you understand how the pieces fit together before you start implementing.

**If anything is ambiguous, ask the user to confirm before you start implementing.** It's much cheaper to clarify scope up front than to build the wrong thing.

## About the design files

The design medium is **HTML/CSS/JS** — these are prototypes, not production code. Your job is to **recreate them pixel-perfectly** in whatever technology makes sense for the target codebase (React, Vue, native, whatever fits). Match the visual output; don't copy the prototype's internal structure unless it happens to fit.

**Don't render these files in a browser or take screenshots unless the user asks you to.** Everything you need — dimensions, colors, layout rules — is spelled out in the source. Read the HTML and CSS directly; a screenshot won't tell you anything they don't.

## Bundle contents

- `cash-bridge/README.md` — this file
- `cash-bridge/project/` — the `# MyCashbridge — *Aapke Sapno Ka Financial Saathi*

> A production-grade financial services lead-capture platform.

---

## Project Structure

```
cash-bridge/
├── backend/                   ← Node.js / Express API server
│   ├── server.js              ← Entry point (also serves frontend/)
│   ├── .env                   ← Secrets (NEVER commit this)
│   ├── .env.example           ← Template for new environments
│   ├── package.json
│   └── src/
│       ├── db/
│       │   └── client.js      ← MongoDB connection pool + indexes
│       ├── middleware/
│       │   ├── rateLimiter.js ← 5 submissions / IP / 15 min
│       │   └── validate.js    ← Honeypot + sanitise + validate
│       └── routes/
│           ├── health.route.js   ← GET  /health
│           └── leads.route.js    ← POST /api/lead
│
└── frontend/                  ← Static HTML/CSS/JS site
    ├── index.html             ← Homepage
    ├── assets/
    │   ├── site.js            ← All UI behaviour (nav, QB popup, EMI calc…)
    │   ├── site.css           ← All shared styles + QB popup styles
    │   ├── colors_and_type.css ← Design tokens (CSS variables)
    │   └── image-slot.js      ← Lazy image loader
    ├── loans/                 ← Loan product pages
    ├── pages/                 ← Static pages (about, privacy, etc.)
    ├── guides/                ← Financial guides
    └── tools/                 ← EMI calc, credit score, eligibility
```

---

## Quick Start

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

```bash
cp backend/.env.example backend/.env
# Edit backend/.env and fill in your values
```

| Variable         | Description                                  | Example                          |
|------------------|----------------------------------------------|----------------------------------|
| `MONGO_URI`      | MongoDB Atlas connection string              | `mongodb+srv://user:pass@...`    |
| `DB_NAME`        | Database name                                | `mycashbridge`                   |
| `PORT`           | Port to listen on                            | `3001`                           |
| `ALLOWED_ORIGIN` | CORS origin — set your domain in production  | `https://mycashbridge.in`        |

### 3. Start the server

```bash
cd backend
npm start          # production
npm run dev        # with auto-reload (nodemon)
```

The server starts on **http://localhost:3001** and serves:
- `http://localhost:3001/` → full frontend site
- `http://localhost:3001/api/lead` → lead submission API
- `http://localhost:3001/health` → health check

---

## API Reference

### `POST /api/lead`

| Field            | Required | Notes                          |
|------------------|----------|--------------------------------|
| `name`           | ✅       | 2–100 characters               |
| `mobile`         | ✅       | 10-digit Indian mobile         |
| `city`           |          |                                |
| `monthly_income` |          |                                |
| `employment`     |          | Salaried / Self-employed       |
| `product_type`   |          | Loan / Insurance / Card etc.   |
| `loan_amount`    |          |                                |
| `source_page`    |          | URL of referring page          |
| `utm_source`     |          | UTM attribution                |
| `_hp`            |          | Must be empty (honeypot)       |

**Response:** `{ "ok": true }` on success.

### `GET /health`

Returns `{ "status": "ok", "db": "connected", "ts": "..." }`.

---

## Security

| Layer             | Implementation                                          |
|-------------------|---------------------------------------------------------|
| HTTP headers      | Helmet.js (14 headers — HSTS, X-Frame-Options, etc.)   |
| Rate limiting     | 5 submissions per IP per 15 minutes                     |
| Honeypot          | `_hp` field: bots fill it → silently dropped            |
| Input validation  | Server-side — client JS cannot be trusted               |
| Sanitisation      | Strips `<>"'\`` and control chars from all fields       |
| Deduplication     | Same mobile within 10 min → accepted but not re-stored  |
| CORS              | Locked to `ALLOWED_ORIGIN` env var                      |
| Secrets           | MongoDB URI in `.env` only — never sent to browser      |

---

## Production Deployment

1. Set `ALLOWED_ORIGIN=https://yourdomain.com` in `.env`
2. PM2: `pm2 start backend/server.js --name mycashbridge`
3. Put Nginx in front for SSL + gzip
4. Or deploy to **Railway / Render / DigitalOcean App Platform**
` project files (HTML prototypes, assets, components)
