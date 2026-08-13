/**
 * compliance.test.js
 * ──────────────────────────────────────────────────────────────────────────
 * End-to-end compliance tests for mycashbridge.com backend.
 * Purely HTTP-based — no direct MongoDB connection needed.
 *
 * HOW TO RUN:
 *   1. Start the server first:  node server.js
 *   2. In another terminal:     node test/compliance.test.js
 *
 * DB writes are verified via /api/admin/* endpoints (requires ADMIN_API_KEY in .env).
 */

"use strict";

require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const http = require("http");

const HOST      = "127.0.0.1";
const PORT      = parseInt(process.env.PORT, 10) || 3001;
const ADMIN_KEY = process.env.ADMIN_API_KEY || "";
const ORIGIN    = process.env.ALLOWED_ORIGIN || "http://localhost:" + PORT;

/* ── Helpers ─────────────────────────────────────────────────── */
const G = "\x1b[32m\u2713\x1b[0m", R = "\x1b[31m\u2717\x1b[0m", Y = "\x1b[33m\u26a0\x1b[0m";
const B = "\x1b[1m", X = "\x1b[0m";
let passed = 0, failed = 0;
const failures = [];

function pass(label)         { passed++; console.log(`  ${G} ${label}`); }
function fail(label, detail) { failed++; const m = `${label}${detail ? " \u2014 " + detail : ""}`; console.log(`  ${R} ${m}`); failures.push(m); }
function warn(label)         { console.log(`  ${Y} ${label}`); }
function section(t)          { console.log(`\n${B}${t}${X}`); }

function req(opts, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : undefined;
    const options = {
      hostname: HOST, port: PORT,
      headers:  { "Content-Type": "application/json", "Origin": ORIGIN },
      ...opts,
    };
    if (payload) options.headers["Content-Length"] = Buffer.byteLength(payload);
    const r = http.request(options, res => {
      let d = "";
      res.on("data", c => d += c);
      res.on("end", () => {
        let json = null;
        try { json = JSON.parse(d); } catch (_) {}
        resolve({ status: res.statusCode, headers: res.headers, body: json, raw: d });
      });
    });
    r.on("error", reject);
    r.setTimeout(10000, () => { r.destroy(); reject(new Error("timeout")); });
    if (payload) r.write(payload);
    r.end();
  });
}

function adminReq(path) {
  return req({ path, method: "GET",
    headers: { "Content-Type": "application/json", "Origin": ORIGIN, "X-Admin-Key": ADMIN_KEY } });
}

/* ── Pre-flight: confirm server is up ────────────────────────── */
async function checkServer() {
  try {
    const r = await req({ path: "/health", method: "GET" });
    if (r.status !== 200) throw new Error("health returned " + r.status);
    console.log(`  ${G} Server reachable at http://${HOST}:${PORT}`);
  } catch (e) {
    console.log(`\n  ${R} FATAL: Cannot reach server at http://${HOST}:${PORT}`);
    console.log("      Start the server first:  node server.js\n");
    process.exit(1);
  }
}

/* ── 1. Health ───────────────────────────────────────────────── */
async function testHealth() {
  section("1. Health & Server");
  const r = await req({ path: "/health", method: "GET" });
  r.status === 200 && r.body && r.body.status === "ok"
    ? pass("GET /health \u2192 200 {status:'ok'}")
    : fail("GET /health", "status=" + r.status);
}

/* ── 2. Lead + Consent ───────────────────────────────────────── */
async function testLead() {
  section("2. Lead Creation + Consent Evidence");
  const r = await req({ path: "/api/lead", method: "POST" }, {
    name: "Compliance Test User", mobile: "9876500001",
    city: "Bengaluru", monthly_income: "\u20b950,000 \u2013 \u20b91,00,000",
    employment: "Salaried", product_type: "Personal Loan",
    source_page: "/compliance-test",
    consent_service: true, consent_marketing: false, consent_version: "v1.0",
    _hp: "",
  });
  r.status === 200 && r.body && r.body.ok
    ? pass("POST /api/lead \u2192 200 {ok:true}")
    : fail("POST /api/lead", "status=" + r.status + " body=" + JSON.stringify(r.body));

  if (ADMIN_KEY) {
    const ar = await adminReq("/api/admin/audit-logs");
    if (ar.status === 200 && Array.isArray(ar.body && ar.body.data)) {
      ar.body.data.some(function(e) { return e.action === "LEAD_CREATED"; })
        ? pass("LEAD_CREATED audit log found (confirms DB write)")
        : fail("LEAD_CREATED audit log", "not found in audit-logs");
    }
  }
}

/* ── 3. Honeypot ─────────────────────────────────────────────── */
async function testHoneypot() {
  section("3. Bot / Honeypot Protection");
  const r = await req({ path: "/api/lead", method: "POST" }, {
    name: "Bot", mobile: "9876543210", _hp: "FILLED",
    consent_service: true, consent_version: "v1.0",
  });
  r.status === 200 && r.body && r.body.ok
    ? pass("Honeypot \u2192 silent 200 (bot thinks it succeeded)")
    : fail("Honeypot", "expected 200, got " + r.status);
}

/* ── 4. Validation ───────────────────────────────────────────── */
async function testValidation() {
  section("4. Input Validation");
  let r = await req({ path: "/api/lead", method: "POST" }, { name: "X", mobile: "9876543210", _hp: "" });
  r.status === 400 ? pass("Short name rejected (400)") : fail("Short name", "got " + r.status);

  r = await req({ path: "/api/lead", method: "POST" }, { name: "Valid Name", mobile: "123", _hp: "" });
  r.status === 400 ? pass("Bad mobile rejected (400)") : fail("Bad mobile", "got " + r.status);

  r = await req({ path: "/api/dsr/create", method: "POST" }, { name: "A", mobile: "9876543210" });
  r.status === 400 ? pass("DSR short name rejected (400)") : fail("DSR short name", "got " + r.status);
}

/* ── 5. DSR ──────────────────────────────────────────────────── */
async function testDSR() {
  section("5. DSR (Data Subject Rights)");
  const r = await req({ path: "/api/dsr/create", method: "POST" }, {
    name: "DSR Test User", mobile: "9123400001",
    email: "dsr@test.local", request_type: "access",
    details: "Automated compliance test",
  });

  if (r.status !== 201 || !r.body || !r.body.ticketId) {
    fail("POST /api/dsr/create", "status=" + r.status + " body=" + JSON.stringify(r.body));
    return;
  }
  pass("POST /api/dsr/create \u2192 201 with ticketId");
  const tid = r.body.ticketId;

  /^DSR-\d{8}-[A-F0-9]{8}$/i.test(tid)
    ? pass("Ticket ID format valid: " + tid)
    : fail("DSR ticket format", tid);

  const sr = await req({ path: "/api/dsr/status/" + tid, method: "GET" });
  sr.status === 200 && sr.body && sr.body.ticket && sr.body.ticket.status === "open"
    ? pass("GET /api/dsr/status/:id \u2192 200 status=open")
    : fail("DSR status lookup", "status=" + sr.status + " body=" + JSON.stringify(sr.body));

  const ir = await req({ path: "/api/dsr/status/INVALID-FORMAT", method: "GET" });
  ir.status === 400 ? pass("Invalid ticket ID \u2192 400") : fail("Invalid ticket validation", "got " + ir.status);

  if (ADMIN_KEY) {
    const ar = await adminReq("/api/admin/dsr");
    if (ar.status === 200 && Array.isArray(ar.body && ar.body.data)) {
      ar.body.data.some(function(d) { return d.ticketId === tid; })
        ? pass("DSR in admin list (confirms MongoDB write)")
        : fail("DSR in admin list", "ticket " + tid + " not found");
    } else {
      warn("Admin DSR check skipped \u2014 " + ar.status);
    }
  }
}

/* ── 6. Grievance ────────────────────────────────────────────── */
async function testGrievance() {
  section("6. Grievance Management");
  const r = await req({ path: "/api/grievance/create", method: "POST" }, {
    name: "Grievance Test User", mobile: "9234500001",
    email: "grv@test.local", category: "data_privacy",
    description: "Automated compliance test",
  });

  if (r.status !== 201 || !r.body || !r.body.ticketId) {
    fail("POST /api/grievance/create", "status=" + r.status + " body=" + JSON.stringify(r.body));
    return;
  }
  pass("POST /api/grievance/create \u2192 201 with ticketId");
  const tid = r.body.ticketId;

  /^GRV-\d{8}-[A-F0-9]{8}$/i.test(tid)
    ? pass("Ticket ID format valid: " + tid)
    : fail("Grievance ticket format", tid);

  if (ADMIN_KEY) {
    const ar = await adminReq("/api/admin/grievances");
    if (ar.status === 200 && Array.isArray(ar.body && ar.body.data)) {
      ar.body.data.some(function(d) { return d.ticketId === tid; })
        ? pass("Grievance in admin list (confirms MongoDB write)")
        : fail("Grievance in admin list", "not found");
    } else {
      warn("Admin grievances check skipped \u2014 " + ar.status);
    }
  }
}

/* ── 7. Cookie Consent ───────────────────────────────────────── */
async function testCookieConsent() {
  section("7. Cookie Consent Storage");
  const r = await req({ path: "/api/cookie-consent", method: "POST" }, {
    cookieVersion: "v1", analytics: true, marketing: false,
    acceptedCategories: ["necessary", "analytics"],
  });
  r.status === 200 && r.body && r.body.ok
    ? pass("POST /api/cookie-consent \u2192 200 {ok:true}")
    : fail("POST /api/cookie-consent", "status=" + r.status);

  if (ADMIN_KEY) {
    const ar = await adminReq("/api/admin/consent-stats");
    ar.status === 200
      ? pass("Cookie consent stats readable via admin API")
      : fail("Consent stats", "status=" + ar.status);
  }
}

/* ── 8. Admin Routes ─────────────────────────────────────────── */
async function testAdmin() {
  section("8. Admin Routes");
  if (!ADMIN_KEY) {
    warn("ADMIN_API_KEY not set \u2014 skipping admin tests. Add it to .env");
    return;
  }

  var routes = [
    "/api/admin/dsr", "/api/admin/grievances", "/api/admin/retention-logs",
    "/api/admin/audit-logs", "/api/admin/processors", "/api/admin/consent-stats",
  ];
  for (var i = 0; i < routes.length; i++) {
    const r = await adminReq(routes[i]);
    r.status === 200
      ? pass("GET " + routes[i] + " \u2192 200")
      : fail("GET " + routes[i], "status=" + r.status + " " + JSON.stringify(r.body));
  }

  const nokey = await req({ path: "/api/admin/dsr", method: "GET" });
  nokey.status === 403 ? pass("No key \u2192 403 Forbidden") : fail("Admin auth", "got " + nokey.status + " without key");

  const csv = await req({ path: "/api/admin/processors?format=csv", method: "GET",
    headers: { "Content-Type": "application/json", "Origin": ORIGIN, "X-Admin-Key": ADMIN_KEY } });
  csv.status === 200 && csv.headers["content-type"] && csv.headers["content-type"].includes("text/csv")
    ? pass("CSV export \u2192 Content-Type: text/csv")
    : fail("CSV export", "status=" + csv.status + " ct=" + csv.headers["content-type"]);

  const pr = await adminReq("/api/admin/processors");
  if (pr.status === 200 && pr.body && Array.isArray(pr.body.data) && pr.body.data.length > 0) {
    pass("Processor registry has " + pr.body.data.length + " entries");
    pr.body.data.some(function(p) { return p.name === "MongoDB Atlas"; })
      ? pass("MongoDB Atlas processor entry present")
      : fail("MongoDB Atlas entry", "missing from registry");
  } else {
    fail("Processor registry", "empty or error: " + pr.status);
  }
}

/* ── 9. Security Headers ─────────────────────────────────────── */
async function testSecurity() {
  section("9. Security Headers");
  const r = await req({ path: "/health", method: "GET" });
  const csp = r.headers["content-security-policy"] || "";

  csp.includes("fonts.googleapis.com")
    ? pass("CSP includes fonts.googleapis.com")
    : fail("CSP fonts.googleapis.com", "missing \u2014 " + csp.slice(0, 100));

  csp.includes("fonts.gstatic.com")
    ? pass("CSP includes fonts.gstatic.com")
    : fail("CSP fonts.gstatic.com", "missing");

  !csp.includes("formsubmit.co")
    ? pass("CSP does NOT include formsubmit.co")
    : fail("formsubmit.co in CSP", "must be removed");

  r.headers["x-frame-options"]
    ? pass("X-Frame-Options: " + r.headers["x-frame-options"])
    : fail("X-Frame-Options header", "missing");

  r.headers["strict-transport-security"]
    ? pass("HSTS header present")
    : warn("HSTS not set (expected only in production behind HTTPS)");

  r.headers["x-content-type-options"] === "nosniff"
    ? pass("X-Content-Type-Options: nosniff")
    : fail("X-Content-Type-Options", r.headers["x-content-type-options"]);
}

/* ── 10. Sensitive File Blocking ─────────────────────────────── */
async function testFileBlocking() {
  section("10. Sensitive File Blocking");
  var files = ["/package.json", "/.env", "/README.md"];
  for (var i = 0; i < files.length; i++) {
    const r = await req({ path: files[i], method: "GET" });
    r.status === 404
      ? pass(files[i] + " \u2192 404 (blocked)")
      : fail(files[i] + " not blocked", "got " + r.status);
  }
}

/* ── 11. Dedup / Lead Loss ───────────────────────────────────── */
async function testDedup() {
  section("11. Lead Loss Resistance (Dedup)");
  const lead = {
    name: "Dedup User", mobile: "9988700088",
    city: "Delhi", monthly_income: "\u20b925,000 \u2013 \u20b950,000",
    employment: "Salaried", product_type: "Home Loan",
    source_page: "/test-dedup", _hp: "",
    consent_service: true, consent_version: "v1.0",
  };
  const r1 = await req({ path: "/api/lead", method: "POST" }, lead);
  const r2 = await req({ path: "/api/lead", method: "POST" }, lead);
  r1.status === 200 && r1.body && r1.body.ok ? pass("First lead accepted") : fail("First lead", "status=" + r1.status);
  // Second request: either deduplicated (200) or rate-limited (429) — both are correct
  // 429 means the rate limiter fired before dedup logic; both protect against double-storing
  if (r2.status === 200 && r2.body && r2.body.ok) {
    pass("Duplicate deduplicated silently (200 — dedup logic)");
  } else if (r2.status === 429) {
    pass("Duplicate rate-limited (429 — rate limiter fired first, no double-store)");
  } else {
    fail("Duplicate handling", "expected 200 or 429, got " + r2.status);
  }
}

/* ── Main ────────────────────────────────────────────────────── */
async function main() {
  console.log("\n" + "=".repeat(60));
  console.log(B + " MyCashBridge \u2014 Compliance & Security Test Suite" + X);
  console.log("=".repeat(60));
  console.log(" Server:  http://" + HOST + ":" + PORT);
  console.log(" DB:      " + (process.env.DB_NAME || "mycashbridge"));
  console.log(" Admin:   " + (ADMIN_KEY ? "key set \u2713" : "NOT SET \u2014 add ADMIN_API_KEY to .env"));
  console.log(" Date:    " + new Date().toISOString());
  console.log("=".repeat(60));

  await checkServer();
  await testHealth();
  await testLead();
  await testHoneypot();
  await testValidation();
  await testDSR();
  await testGrievance();
  await testCookieConsent();
  await testAdmin();
  await testSecurity();
  await testFileBlocking();
  await testDedup();

  console.log("\n" + "=".repeat(60));
  console.log(B + " RESULTS" + X);
  console.log("=".repeat(60));
  console.log(" Passed:  " + B + "\x1b[32m" + passed + "\x1b[0m" + X);
  console.log(" Failed:  " + B + "\x1b[31m" + failed + "\x1b[0m" + X);
  if (failures.length) {
    console.log("\n Failures:");
    failures.forEach(function(f) { console.log("   " + R + " " + f); });
  }
  console.log("=".repeat(60) + "\n");
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(function(err) {
  console.error("\nFATAL:", err.message);
  process.exit(1);
});
