// src/components/TrustCard.tsx
type Snapshot = {
  name: string;
  // new schema
  trust_score?: number;
  uptime_pct?: number;
  p95_ms?: number;
  cost_per_req?: number;
  updated_at?: string;
  // legacy schema (fallback JSON)
  uptime?: number;
  latency_ms?: number;
};

export default function TrustCard({ data }: { data: Snapshot }) {
  const name = data.name ?? "API";
  const trust = Number.isFinite(data.trust_score as number) ? (data.trust_score as number) : 0;
  const uptimePct = (data.uptime_pct ?? data.uptime ?? 0) as number;
  const p95ms = (data.p95_ms ?? data.latency_ms ?? 0) as number;
  const costPerReq = (data.cost_per_req ?? 0) as number;
  const updatedAt = data.updated_at ?? new Date().toISOString().slice(0, 10);

  return (
    <section className="mx-auto max-w-4xl rounded-2xl bg-[var(--color-paper)] ring-1 ring-[var(--color-ring)] p-6 sm:p-8 md:p-10 shadow-[var(--shadow-card)]" aria-label={`${name} trust summary`}>
      <div className="flex justify-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[var(--color-pill)] text-[var(--ink-900)] ring-1 ring-[var(--color-ring)]">
          <div className="text-center">
            <div className="text-4xl font-extrabold leading-none">{Math.round(trust)}</div>
            <p className="mt-1 text-xs uppercase tracking-wide text-[var(--ink-500)]">Trust Score</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiTile label="Uptime" value={`${Number(uptimePct).toFixed(2)}%`} />
        <KpiTile label="Latency" value={`${Math.round(Number(p95ms))}ms`} hint="(p95)" />
        <KpiTile label="Cost" value={`$${Number(costPerReq).toFixed(2)}/req`} />
      </div>

      <p className="mt-8 text-center text-sm text-[var(--ink-500)]">
        <span className="font-medium text-[var(--ink-700)]">{name}</span> • Updated {new Date(updatedAt).toLocaleDateString()}
      </p>
    </section>
  );
}

function KpiTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl bg-[var(--color-pill)] ring-1 ring-[var(--color-ring)] px-4 py-3 sm:px-5 sm:py-4 text-center shadow-[var(--shadow-card)]">
      <div className="text-xl sm:text-2xl font-bold text-[var(--ink-900)]">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wide text-[var(--ink-500)]">
        {label} {hint && <span className="lowercase">{hint}</span>}
      </div>
    </div>
  );
}
