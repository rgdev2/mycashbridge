"use strict";

/*
  MyCashBridge — Main Server
  ──────────────────────────────────────────────────────────────
  Serves BOTH the frontend static site AND the REST API from a
  single process so there are zero CORS issues in production.

  Architecture:
    backend/
      server.js                ← you are here (entry point)
      src/
        db/client.js           ← MongoDB connection pool
        middleware/
          rateLimiter.js       ← express-rate-limit (5/IP/15 min)
          validate.js          ← honeypot + sanitisation + validation
        routes/
          health.route.js      ← GET  /health
          leads.route.js       ← POST /api/lead
    frontend/                  ← served as static files

  Environment (.env):
    MONGO_URI        MongoDB Atlas connection string
    DB_NAME          Database name (default: mycashbridge)
    PORT             Port to listen on (default: 3001)
    ALLOWED_ORIGIN   CORS origin — set to your domain in production
*/

require("dotenv").config();

const path    = require("path");
const express = require("express");
const helmet  = require("helmet");
const cors    = require("cors");

const { connect, close } = require("./src/db/client");
const healthRoute         = require("./src/routes/health.route");
const leadsRoute          = require("./src/routes/leads.route");

// ── DPDP Compliance Routes ──────────────────────────────────────────────────
// Phase 3/4: Data Subject Rights — replaces FormSubmit dependency
const dsrRoute            = require("./src/routes/dsr.route");
// Phase 5:   Grievance management
const grievanceRoute      = require("./src/routes/grievance.route");
// Phase 8:   Cookie consent server-side evidence
const cookieConsentRoute  = require("./src/routes/cookie-consent.route");
// Phase 11:  Compliance admin reporting
const adminRoute          = require("./src/routes/admin.route");

// ── Retention job (Phase 6) ─────────────────────────────────────────────────
const { startRetentionJob } = require("./src/jobs/retention.job");

// ── Email service (Phase 4/5) ───────────────────────────────────────────────
const { initMailer } = require("./src/utils/mailer");

const PORT           = parseInt(process.env.PORT, 10) || 3001;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;
if (!ALLOWED_ORIGIN) {
  console.error("FATAL: ALLOWED_ORIGIN is not set in .env — refusing to start without a CORS origin.");
  process.exit(1);
}

// ── Express app ─────────────────────────────────────────────
const app = express();

// Trust first proxy (Nginx / Cloudflare / Heroku) so req.ip is the real IP
app.set("trust proxy", 1);

// HTTPS redirect — in production, force all HTTP traffic to HTTPS
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.headers["x-forwarded-proto"] !== "https") {
      return res.redirect(301, "https://" + req.headers.host + req.url);
    }
    next();
  });
}

// Security headers (OWASP A05) — helmet + Content Security Policy
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:      ["'self'"],
      scriptSrc:       ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com", "https://www.google-analytics.com", "https://ssl.google-analytics.com", "https://googleads.g.doubleclick.net", "https://www.googleadservices.com", "https://pagead2.googlesyndication.com"],
      // Issue #1 Fix: allow Google Fonts stylesheet (loaded by colors_and_type.css @import)
      styleSrc:        ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      // Issue #1 Fix: allow Google Fonts webfont files (served from fonts.gstatic.com)
      fontSrc:         ["'self'", "https://fonts.gstatic.com"],
      imgSrc:          ["'self'", "data:", "blob:", "https://www.googletagmanager.com", "https://www.google-analytics.com", "https://ssl.google-analytics.com", "https://www.google.com", "https://googleads.g.doubleclick.net", "https://www.googleadservices.com", "https://td.doubleclick.net", "https://pagead2.googlesyndication.com"],
      connectSrc:      ["'self'", "https://www.google-analytics.com", "https://analytics.google.com", "https://stats.g.doubleclick.net", "https://region1.google-analytics.com", "https://www.googletagmanager.com", "https://googleads.g.doubleclick.net", "https://www.googleadservices.com", "https://td.doubleclick.net"],
      objectSrc:       ["'none'"],
      // GTM noscript fallback + DoubleClick conversion tracking use iframes
      frameSrc:        ["https://www.googletagmanager.com", "https://td.doubleclick.net", "https://googleads.g.doubleclick.net"],
      frameAncestors:  ["'self'"],
      formAction:      ["'self'"],
      baseUri:         ["'self'"],
      upgradeInsecureRequests: [],
    },
  },
  // Phase 9: Additional security headers
  hsts: {
    maxAge:            31536000, // 1 year
    includeSubDomains: true,
    preload:           true,
  },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  crossOriginEmbedderPolicy: false,  // allow fonts/images to load without COEP headers
  crossOriginResourcePolicy: { policy: "same-site" },
}));

// Phase 9: Block direct access to sensitive server-side files
// Prevents accidental exposure of README, .env, package-lock, config files
app.use((req, res, next) => {
  const blocked = /\.(env|md|lock|log)$|package\.json$|package-lock\.json$|\.git\//i;
  if (blocked.test(req.path)) {
    return res.status(404).send("Not found.");
  }
  next();
});

// CORS — restrict to configured origin
if (ALLOWED_ORIGIN === "*") {
  console.warn("[WARN] ALLOWED_ORIGIN=* — set your production domain in .env");
}
app.use(cors({
  origin:  ALLOWED_ORIGIN,
  methods: ["GET", "POST", "OPTIONS"],
}));

// Parse JSON bodies, cap at 10 KB to block payload-flooding DoS
app.use(express.json({ limit: "10kb" }));

// ── API Routes ───────────────────────────────────────────────
app.use(healthRoute);
app.use(leadsRoute);

// DPDP Compliance Routes (Phases 3–5, 8, 11)
app.use(dsrRoute);
app.use(grievanceRoute);
app.use(cookieConsentRoute);
app.use(adminRoute);

// ── Serve Frontend ───────────────────────────────────────────
// The Express server serves the entire frontend/ folder as static files.
// This means one "npm start" runs both the site AND the API — no CORS issues.
const FRONTEND_DIR = path.resolve(__dirname, "..", "frontend");
app.use(express.static(FRONTEND_DIR, {
  setHeaders(res, filePath) {
    // Short cache for HTML so updates reach users quickly
    if (filePath.endsWith(".html")) {
      res.setHeader("Cache-Control", "public, max-age=300");
    } else {
      // Longer cache for CSS / JS / images (they have hashed names or change rarely)
      res.setHeader("Cache-Control", "public, max-age=86400");
    }
  },
}));

// Fallback: any unmatched path returns the homepage
// (supports clean URLs like /loans/personal-loan without .html)
app.use((_req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});

// ── Start ────────────────────────────────────────────────────
connect()
  .then(() => {
    // Initialise optional email service (SMTP config in .env)
    initMailer();

    // Start daily retention job (runs at 02:00 server time)
    startRetentionJob();

    const server = app.listen(PORT, () => {
      console.log(`\n  ╔══════════════════════════════════╗`);
      console.log(`  ║  MyCashBridge server running      ║`);
      console.log(`  ║  http://localhost:${PORT}             ║`);
      console.log(`  ╚══════════════════════════════════╝\n`);
    });

    // Graceful shutdown for PM2 / Docker / Kubernetes
    process.on("SIGTERM", () => {
      console.log("[server] SIGTERM — shutting down gracefully…");
      server.close(async () => {
        await close();
        process.exit(0);
      });
    });
  })
  .catch(err => {
    console.error("[server] DB connection failed:", err.message);
    process.exit(1);
  });

