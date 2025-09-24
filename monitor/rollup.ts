// src/monitor/rollup.ts  (Prisma version)
import path from "node:path";
import fs from "node:fs";
import { db } from "@/lib/db";               // Prisma client
import { trustScore } from "./score";
import { rollupLast24h } from "@monitor/rollup"; 

type Checks = Array<{ slug: string; cost_per_req?: number }>;

function loadCosts(): Map<string, number> {
  const root = process.cwd();
  const primary = path.join(root, "src/monitor/checks.json");
  const fallback = path.join(root, "src/monitor/checks.sample.json");

  let raw = "[]";
  try {
    if (fs.existsSync(primary)) raw = fs.readFileSync(primary, "utf8");
    else if (fs.existsSync(fallback)) raw = fs.readFileSync(fallback, "utf8");
  } catch {
    // ignore
  }

  try {
    const arr = JSON.parse(raw) as Checks;
    const m = new Map<string, number>();
    for (const a of arr) {
      if (!a?.slug) continue;
      m.set(a.slug, Number(a.cost_per_req ?? 0));
    }
    return m;
  } catch {
    return new Map();
  }
}

function p95(values: number[]): number {
  if (!values.length) return 0;
  const s = [...values].sort((a, b) => a - b);
  const idx = Math.floor(0.95 * (s.length - 1));
  return s[idx] ?? 0;
}

export async function rollupLast24h() {
  const now = new Date();
  const from = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const dayDate = new Date(now.toISOString().slice(0, 10)); // 00:00 UTC today
  const costs = loadCosts();

  // Which (apiId, region) pairs had probes in the last 24h?
  const pairs = await db.probe.findMany({
    where: { ts: { gte: from } },
    select: { apiId: true, region: true },
    distinct: ["apiId", "region"],
  });

  for (const { apiId, region } of pairs) {
    const probes = await db.probe.findMany({
      where: { apiId, region, ts: { gte: from } },
      select: { status: true, latencyMs: true },
    });

    const total = probes.length;
    const oks = probes.filter((p) => p.status >= 200 && p.status < 400);
    const uptime = total ? oks.length / total : 0;
    const p95ms = p95(oks.map((p) => p.latencyMs));

    // Look up cost by the API's name (or provider) against checks.json slug
    const api = await db.api.findUnique({
      where: { id: apiId },
      select: { name: true, provider: true },
    });
    const cost =
      (api && (costs.get(api.name) ?? (api.provider ? costs.get(api.provider) : 0))) ?? 0;

    // Upsert daily rollup
    await db.dailyRollup.upsert({
      where: { apiId_region_day: { apiId, region, day: dayDate } },
      create: {
        apiId,
        region,
        day: dayDate,
        uptimePct: uptime,
        p95Ms: p95ms,
        errorRate: 1 - uptime,
        incidentH: 0,
      },
      update: {
        uptimePct: uptime,
        p95Ms: p95ms,
        errorRate: 1 - uptime,
      },
    });

    // Upsert trust score
    const score = trustScore(p95ms, uptime, cost);
    await db.trustScore.upsert({
      where: { apiId_region_day: { apiId, region, day: dayDate } },
      create: { apiId, region, day: dayDate, score, base: score, penalty: 0 },
      update: { score },
    });
  }

  // Optional: refresh homepage fallback snapshot (uses the first API as a sample)
  const first = await db.api.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true },
  });

  if (first) {
    const latest = await db.dailyRollup.findFirst({
      where: { apiId: first.id },
      orderBy: [{ day: "desc" }],
      select: { p95Ms: true, uptimePct: true },
    });

    if (latest && process.env.NODE_ENV === "development") {
      const cost = costs.get(first.name) ?? 0;
      const score = trustScore(latest.p95Ms, latest.uptimePct, cost);
      const snapshot = {
        name: first.name,
        trust_score: score,
        uptime_pct: Number((latest.uptimePct * 100).toFixed(2)),
        p95_ms: Math.round(latest.p95Ms),
        cost_per_req: cost,
      };
      try {
        const out = path.join(process.cwd(), "src/data/snapshot.json");
        fs.writeFileSync(out, JSON.stringify(snapshot, null, 2));
      } catch {/* ignore */}
    }
  }

  return { ok: true };
}