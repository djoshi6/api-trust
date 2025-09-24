// src/app/api/probes/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const apiId = url.searchParams.get("apiId");

  if (!apiId) return NextResponse.json({ rows: [] });

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const rows = await db.probe.findMany({
    where: { apiId, ts: { gte: since } },
    select: { ts: true, region: true, latencyMs: true, status: true },
    orderBy: { ts: "desc" },
    take: 200,
  });

  // LatencyTable expects { ts, region, latencyMs, status }
  return NextResponse.json({ rows });
}