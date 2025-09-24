// src/app/api/run-probes/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trustScore } from "@monitor/score"; 
import { rollupLast24h } from "@monitor/rollup"; 

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const mock = url.searchParams.get("mock");
    const count = Math.max(1, Number(url.searchParams.get("count") ?? 50));
    const minutes = Math.max(1, Number(url.searchParams.get("minutes") ?? 60));
    const pickApiId = url.searchParams.get("apiId") ?? undefined;
    const doRollup = url.searchParams.get("rollup") === "1";

    // --- MOCK MODE: generate synthetic probes directly into Postgres via Prisma
    if (mock) {
      // Choose API (explicit apiId or first by createdAt)
      const api =
        (await db.api.findFirst({
          where: pickApiId ? { id: pickApiId } : undefined,
          orderBy: pickApiId ? undefined : { createdAt: "asc" },
          select: { id: true, regions: true },
        })) || null;

      if (!api) {
        return NextResponse.json(
          { ok: false, error: "No API found to attach probes to." },
          { status: 400 }
        );
      }

      // Use API's configured regions, fallback to two common regions
      const regions =
        api.regions && api.regions.length ? api.regions : ["us-east-1", "eu-west-1"];

      const now = Date.now();
      const windowMs = minutes * 60 * 1000;

      const rows = Array.from({ length: count }).map(() => {
        const ts = new Date(now - Math.floor(Math.random() * windowMs)); // last N minutes
        const region = regions[Math.floor(Math.random() * regions.length)];
        const ok = Math.random() < 0.9; // ~90% success
        const latencyMs = Math.floor(100 + Math.random() * 400); // 100–500ms

        return {
          apiId: api.id,
          region,
          ts,
          status: ok ? 200 : 500,
          latencyMs,
          errorType: ok ? null : "500",
        };
      });

      // Efficient bulk insert
      const { count: inserted } = await db.probe.createMany({ data: rows });

      // Optionally kick the rollup right away so the UI updates
      let rollupOk: boolean | undefined = undefined;
      if (doRollup) {
        const origin = new URL(req.url).origin;
        try {
          const res = await fetch(`${origin}/api/daily-rollup`, { cache: "no-store" });
          const j = (await res.json()) as { ok?: boolean };
          rollupOk = !!j?.ok;
        } catch {
          rollupOk = false;
        }
      }

      return NextResponse.json({ ok: true, inserted, rollupOk });
    }

    // TODO: real probe path (hit each API baseUrl from multiple regions and record results)
    return NextResponse.json({
      ok: true,
      note:
        "Add real probe logic here. For now, call /api/run-probes?mock=1 to insert synthetic probes. " +
        "Use &rollup=1 to recompute the daily rollup immediately.",
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "unknown" },
      { status: 500 }
    );
  }
}
