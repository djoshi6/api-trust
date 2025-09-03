import React from "react";

type Snapshot = {
  name: string;
  uptime: number;        // e.g. 99.98
  latency_ms: number;    // e.g. 220
  cost_per_req: number;  // e.g. 0.05
  trust_score: number;   // e.g. 92
  updated_at: string;    // "2025-08-22"
};

export default function TrustCard({ data }: { data: Snapshot }) {
  const d = data;

  return (
    <section
      className="
        mx-auto max-w-4xl
        rounded-2xl bg-paper ring-1 ring-ring
        p-6 sm:p-8 md:p-10
        shadow-[var(--shadow-card)]
      "
      aria-label={`${d.name} trust summary`}
    >
      {/* Score circle */}
      <div className="flex justify-center">
        <div className="
          flex h-28 w-28 items-center justify-center
          rounded-full bg-tile text-ink-900
          ring-1 ring-ring
        ">
          <div className="text-center">
            <div className="text-4xl font-extrabold leading-none">
              {Math.round(d.trust_score)}
            </div>
            <p className="mt-1 text-xs uppercase tracking-wide text-ink-500">
              Trust Score
            </p>
          </div>
        </div>
      </div>

      {/* KPI tiles */}
      <div
        className="
          mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3
        "
      >
        <KpiTile label="Uptime" value={`${d.uptime.toFixed(2)}%`} />
        <KpiTile label="Latency" value={`${Math.round(d.latency_ms)}ms`} hint="(p95)" />
        <KpiTile label="Cost" value={`$${d.cost_per_req.toFixed(2)}/req`} />
      </div>

      {/* Footer line */}
      <p className="mt-8 text-center text-sm text-ink-500">
        <span className="font-medium text-ink-700">{d.name}</span>{" "}
        • Updated {new Date(d.updated_at).toLocaleDateString()}
      </p>
    </section>
  );
}

function KpiTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div
      className="
        rounded-xl bg-pill ring-1 ring-ring
        px-4 py-3 sm:px-5 sm:py-4
        text-center shadow-[var(--shadow-card)]
      "
    >
      <div className="text-xl sm:text-2xl font-bold text-ink-900">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wide text-ink-500">
        {label} {hint && <span className="lowercase">{hint}</span>}
      </div>
    </div>
  );
}