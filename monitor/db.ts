// monitor/db.ts
import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

// where to store the DB file (safe for local dev)
const dbPath = path.join(process.cwd(), ".data", "monitor.sqlite");
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

// Create tables if they don't exist yet
db.exec(`
  CREATE TABLE IF NOT EXISTS samples (
    slug TEXT NOT NULL,
    ts   INTEGER NOT NULL,
    ok   INTEGER NOT NULL,  -- 1 or 0
    ms   INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_samples_slug_ts ON samples(slug, ts);

  CREATE TABLE IF NOT EXISTS daily (
    slug         TEXT NOT NULL,
    day          TEXT NOT NULL,  -- 'YYYY-MM-DD'
    p95_ms       REAL NOT NULL,
    uptime       REAL NOT NULL,
    cost_per_req REAL NOT NULL,
    PRIMARY KEY (slug, day)
  );
`);

export default db;
