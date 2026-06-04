"use strict";

const { MongoClient, ServerApiVersion } = require("mongodb");

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME   = process.env.DB_NAME || "mycashbridge";
const COLLECTION = "leads";

if (!MONGO_URI) {
  console.error("FATAL: MONGO_URI is not set in .env");
  process.exit(1);
}

const client = new MongoClient(MONGO_URI, {
  serverApi: {
    version:           ServerApiVersion.v1,
    strict:            true,
    deprecationErrors: true,
  },
  maxPoolSize:               20,   // max concurrent connections
  minPoolSize:                2,   // warm connections kept alive
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS:         45000,
  connectTimeoutMS:         8000,
});

let _db;

async function connect() {
  await client.connect();
  _db = client.db(DB_NAME);

  // Idempotent index creation — safe to run on every restart
  const col = _db.collection(COLLECTION);
  await col.createIndex({ mobile: 1, submitted_at: -1 }); // dedup lookup
  await col.createIndex({ submitted_at: -1 });            // dashboard sort
  await col.createIndex({ status: 1, submitted_at: -1 }); // CRM filter

  console.log(`[DB] Connected — ${DB_NAME}.${COLLECTION}`);
}

function getDb() {
  if (!_db) throw new Error("Database not connected. Call connect() first.");
  return _db;
}

function getCollection() {
  return getDb().collection(COLLECTION);
}

function isConnected() {
  return !!(client.topology && client.topology.isConnected());
}

async function close() {
  await client.close();
}

module.exports = { connect, getCollection, isConnected, close };
