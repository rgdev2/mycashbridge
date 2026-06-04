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

const PORT           = parseInt(process.env.PORT, 10) || 3001;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*"; // ← set your domain in prod

// ── Express app ─────────────────────────────────────────────
const app = express();

// Trust first proxy (Nginx / Cloudflare / Heroku) so req.ip is the real IP
app.set("trust proxy", 1);

// Security headers (OWASP A05) — helmet sets 14 headers automatically
// contentSecurityPolicy disabled here; set per-page via HTML meta tags
app.use(helmet({ contentSecurityPolicy: false }));

// CORS — restrict to configured origin
app.use(cors({
  origin:  ALLOWED_ORIGIN,
  methods: ["GET", "POST", "OPTIONS"],
}));

// Parse JSON bodies, cap at 10 KB to block payload-flooding DoS
app.use(express.json({ limit: "10kb" }));

// ── API Routes ───────────────────────────────────────────────
app.use(healthRoute);
app.use(leadsRoute);

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

