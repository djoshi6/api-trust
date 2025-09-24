import fs from "node:fs";
import { performance } from "node:perf_hooks";
import db from "./db";
import { fetch } from "undici";

type Check = {
  slug: string; name: string; method: "GET"|"POST"|"HEAD";
  url: string; headers?: Record<string,string>;
  auth?: "bearer"; env?: string;
  cost_per_req: number;
};

function loadChecks(): Check[] {
  const raw = fs.readFileSync("./monitor/checks.json", "utf8");
  return JSON.parse(raw);
}

async function oneCall(c: Check, timeoutMs = 10000) {
  const headers = { ...(c.headers || {}) };
  if (c.auth === "bearer" && c.env) {
    const key = process.env[c.env];
    if (key) headers["Authorization"] = `Bearer ${key}`;
  }
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);

  const start = performance.now();
  try {
    const res = await fetch(c.url, { method: c.method, headers, signal: ctrl.signal });
    const ok = res.ok;
    return { ok, ms: performance.now() - start };
  } catch {
    return { ok: false, ms: timeoutMs };
  } finally {
    clearTimeout(t);
  }
}

function saveSample(slug: string, ok: boolean, ms: number) {
  db.prepare("INSERT INTO samples (slug, ts, ok, ms) VALUES (?, ?, ?, ?)")
    .run(slug, Date.now(), ok ? 1 : 0, ms);
}

export async function runProbes({ repeats = 3 } = {}) {
  const checks = loadChecks();
  for (const c of checks) {
    for (let i = 0; i < repeats; i++) {
      const r = await oneCall(c);
      saveSample(c.slug, r.ok, r.ms);
      await new Promise(r => setTimeout(r, 200)); // gentle
    }
  }
  return { ok: true, count: checks.length * repeats };
}
