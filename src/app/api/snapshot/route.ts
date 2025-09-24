// src/app/api/snapshot/route.ts
import { NextResponse } from "next/server";
import db from "../../../../monitor/db";
import { trustScore } from "../../../../monitor/score";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Row = {
  p95_ms: number;       // milliseconds (p95)
  uptime: number;       // 0..1
  cost_per_req: number; // $
  day?: string;         // YYYY-MM-DD
};

export async function GET() {
  // Note: generics are <ParamsTuple, RowType>
  const stmt = db.prepare<[string], Row>(`
    SELECT p95_ms, uptime, cost_per_req, day
    FROM daily
    WHERE slug = ?
    ORDER BY day DESC
    LIMIT 1
  `);

  const row = stmt.get("openai-models"); // Row | undefined

  if (!row) {
    return NextResponse.json({ ok: false, message: "No data" }, { status: 404 });
  }

  const payload = {
    name: "OpenAI API",
    trust_score: trustScore(row.p95_ms, row.uptime, row.cost_per_req),
    uptime_pct: Number((row.uptime * 100).toFixed(2)),
    p95_ms: Math.round(row.p95_ms),
    cost_per_req: row.cost_per_req,
    updated_at: row.day ?? new Date().toISOString().slice(0, 10),
  };

  return NextResponse.json(payload, {
    headers: { "Cache-Control": "public, max-age=60" },
  });
}
