"use strict";

const { MongoClient, ServerApiVersion } = require("mongodb");

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME   = process.env.DB_NAME || "mycashbridge";

/**
 * One collection per service category.
 * Each category maps to its own MongoDB collection so leads are
 * naturally segmented and can be queried / exported independently.
 */
const COLLECTIONS = {
  loans:       "leads_loans",
  insurance:   "leads_insurance",
  cards:       "leads_cards",
  investments: "leads_investments",
  general:     "leads_general",
};

/** Fallback for unknown categories */
const DEFAULT_COLLECTION = "leads_general";

/** Master collection — every lead regardless of category */
const MASTER_COLLECTION = "leads";

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

  // Create indexes on every category collection — idempotent, safe on every restart
  for (const [category, colName] of Object.entries(COLLECTIONS)) {
    const col = _db.collection(colName);
    await col.createIndex({ mobile: 1, submitted_at: -1 }); // dedup lookup
    await col.createIndex({ submitted_at: -1 });            // dashboard sort
    await col.createIndex({ status: 1, submitted_at: -1 }); // CRM filter
    await col.createIndex({ product_type: 1 });             // filter by product
    console.log(`[DB] Indexes ready — ${DB_NAME}.${colName} (${category})`);
  }

  // Master collection indexes
  const master = _db.collection(MASTER_COLLECTION);
  await master.createIndex({ mobile: 1, submitted_at: -1 });
  await master.createIndex({ submitted_at: -1 });
  await master.createIndex({ service_category: 1, submitted_at: -1 });
  await master.createIndex({ status: 1, submitted_at: -1 });
  await master.createIndex({ product_type: 1 });
  console.log(`[DB] Indexes ready — ${DB_NAME}.${MASTER_COLLECTION} (master)`);
}

function getDb() {
  if (!_db) throw new Error("Database not connected. Call connect() first.");
  return _db;
}

/**
 * Returns the MongoDB collection for a given service_category.
 * Falls back to leads_general for any unknown value.
 */
function getCollectionByCategory(category) {
  const colName = COLLECTIONS[category] || DEFAULT_COLLECTION;
  return getDb().collection(colName);
}

/** Returns the master leads collection (all services combined). */
function getMasterCollection() {
  return getDb().collection(MASTER_COLLECTION);
}

/** @deprecated use getCollectionByCategory(category) instead */
function getCollection() {
  return getDb().collection(DEFAULT_COLLECTION);
}

function isConnected() {
  return !!(client.topology && client.topology.isConnected());
}

async function close() {
  await client.close();
}

module.exports = { connect, getCollection, getCollectionByCategory, getMasterCollection, isConnected, close };
