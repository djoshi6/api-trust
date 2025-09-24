// src/app/page.tsx
import TrustCard from "../components/TrustCard";
import SearchBar from "../components/SearchBar";
import { WaitlistForm } from "../components/WaitlistForm";
import Pricing from "../components/Pricing";
import { Faq } from "../components/Faq";
import LatencyTable from "../components/LatencyTable";
import { db } from "../lib/db";
import { headers } from "next/headers";

type CardData = {
  name: string;
  trust_score: number;
  uptime_pct: number;
  p95_ms: number;
  cost_per_req: number;
  updated_at: string;
};

async function getCardData(): Promise<CardData> {
  const h = await headers();                      // ✅ await it
  const host =
    h.get("x-forwarded-host") ??                  // vercel / proxies
    h.get("host") ??
    "localhost:3000";

  const proto = h.get("x-forwarded-proto") ?? (process.env.VERCEL ? "https" : "http");
  const url = `${proto}://${host}/api/snapshot`;

  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`snapshot fetch failed: ${res.status}`);
  return (await res.json()) as CardData;
}

export default async function Page() {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [data, apiWithRecentProbes] = await Promise.all([
    getCardData(),
    db.api.findFirst({
      where: { probes: { some: { ts: { gte: since } } } },
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const firstApi =
    apiWithRecentProbes ??
    (await db.api.findFirst({
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true },
    }));

  return (
    <main className="min-h-screen bg-[var(--color-sage-500)] py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* HERO */}
        <header className="text-center">
          <h1
            className="text-center font-semibold tracking-tight leading-tight
                       mx-auto px-4 text-[clamp(28px,5vw,52px)] md:whitespace-nowrap max-w-none"
          >
            API Performance You Can Trust
          </h1>

          <p
            className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base
                       text-[var(--on-sage)]/80 max-w-3xl mx-auto"
          >
            Independent reliability & cost benchmarks for the APIs you depend on.
          </p>

          <div className="mt-6 flex justify-center">
            <div className="w-full sm:w-[560px]">
              <SearchBar />
            </div>
          </div>
        </header>

        {/* CONTENT + RIGHT RAIL */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
          {/* LEFT: main content */}
          <div className="space-y-8">
            <section>
              <TrustCard data={data} />
            </section>

            <div className="flex justify-center">
              <a
                href="#beta"
                className="inline-flex items-center justify-center px-7 py-3 rounded-full
                           bg-[var(--color-forest-700)] text-white border-2 border-[var(--color-forest-700)]
                           shadow-sm hover:bg-[var(--color-forest-600)]
                           focus:outline-none focus:ring-4 focus:ring-[var(--color-forest-700)]/30 transition-colors"
              >
                Join Beta
              </a>
            </div>

            <Pricing />

            <section id="beta" className="scroll-mt-24">
              <WaitlistForm endpoint="https://formspree.io/f/mblajbyr" />
            </section>

            <Faq />
          </div>

          {/* RIGHT RAIL: live latency table */}
          <aside className="lg:sticky lg:top-6">
            {firstApi ? (
              <LatencyTable apiId={firstApi.id} />
            ) : (
              <div className="rounded-2xl bg-white/70 backdrop-blur p-4 shadow-sm text-sm text-neutral-500">
                Add an API to see live latency here.
              </div>
            )}
          </aside>
        </div>

        <footer className="mt-16 pb-8 text-center text-xs text-[var(--on-sage)]/70">
          © {new Date().getFullYear()} API Trust — all rights reserved.
        </footer>
      </div>
    </main>
  );
}