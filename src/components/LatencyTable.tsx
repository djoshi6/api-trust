// src/components/LatencyTable.tsx
"use client";

import useSWR from "swr";

type Row = { ts: string; region: string; latencyMs: number; status: number };
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function LatencyTable({ apiId }: { apiId: string }) {
  const { data, isLoading } = useSWR<{ rows: Row[] }>(
    apiId ? `/api/probes?apiId=${apiId}` : null,
    fetcher,
    { refreshInterval: 60_000 }
  );

  const rows = data?.rows ?? [];

  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur p-4 shadow-sm">
      <div className="text-lg font-semibold mb-2">Daily latency (p95)</div>
      <div className="text-xs text-neutral-500 mb-3">
        Last 24 hours • auto-refreshes every minute
      </div>

      {isLoading && <div className="text-sm text-neutral-500 py-4">Loading…</div>}

      {!isLoading && rows.length === 0 && (
        <div className="text-sm text-neutral-500 py-4">
          No probes yet — hit <code>/api/run-probes</code> once.
        </div>
      )}

      {rows.length > 0 && (
        <div className="max-h-80 overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-500">
                <th className="py-1 pr-2">Time</th>
                <th className="py-1 pr-2">Region</th>
                <th className="py-1 pr-2">Latency</th>
                <th className="py-1">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-neutral-200/60">
                  <td className="py-1 pr-2">{new Date(r.ts).toLocaleTimeString()}</td>
                  <td className="py-1 pr-2">{r.region}</td>
                  <td className="py-1 pr-2">{r.latencyMs} ms</td>
                  <td className="py-1">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}