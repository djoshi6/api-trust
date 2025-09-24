import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trustScore } from "@monitor/score"; // you already have this helper

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = process.env.CRON_SECRET;
  const got = url.searchParams.get("s");
  if (secret && got !== secret) return NextResponse.json({ ok: false }, { status: 401 });

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // get all apis
  const apis = await db.api.findMany({ select: { id: true, regions: true, name: true } });

  for (const api of apis) {
    const regions = api.regions?.length ? api.regions : ["us-east-1", "eu-west-1"];

    for (const region of regions) {
      const probes = await db.probe.findMany({
        where: { apiId: api.id, region, ts: { gte: since } },
        select: { status: true, latencyMs: true },
      });

      const total = probes.length;
      const oks = probes.filter((p) => p.status >= 200 && p.status < 300);

      const uptime = total ? oks.length / total : 0;
      const p95 = (() => {
        if (!oks.length) return 0;
        const arr = oks.map((p) => p.latencyMs).sort((a, b) => a - b);
        const idx = Math.floor(0.95 * (arr.length - 1));
        return arr[idx] ?? 0;
      })();

      // If you keep costs in checks.json, you can pass 0 and rely on your score() weighting,
      // or add a cost field to Api and read it here.
      const cost = 0;

      await db.dailyRollup.upsert({
        where: { apiId_region_day: { apiId: api.id, region, day: new Date(since.toISOString().slice(0,10)) } },
        update: { uptimePct: uptime, p95Ms: p95, errorRate: total ? 1 - uptime : 1 },
        create: {
          apiId: api.id, region,
          day: new Date(since.toISOString().slice(0,10)),
          uptimePct: uptime, p95Ms: p95, errorRate: total ? 1 - uptime : 1,
        },
      });

      const score = trustScore(p95, uptime, cost);
      await db.trustScore.upsert({
        where: { apiId_region_day: { apiId: api.id, region, day: new Date(since.toISOString().slice(0,10)) } },
        update: { score, base: uptime, penalty: p95 },
        create: { apiId: api.id, region, day: new Date(since.toISOString().slice(0,10)), score, base: uptime, penalty: p95 },
      });
    }
  }

  return NextResponse.json({ ok: true });
}
