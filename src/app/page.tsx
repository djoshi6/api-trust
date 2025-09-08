// src/app/page.tsx
import TrustCard from "@/components/TrustCard";
import SearchBar from "@/components/SearchBar";
import Testimonials from "@/components/Testimonials";
import { WaitlistForm } from "@/components/WaitlistForm";
import { Pricing } from "@/components/Pricing";
import { Faq } from "@/components/Faq";

export default async function Page() {
  // Load the local snapshot for the card
  const data = await import("@/data/snapshot.json").then((m) => m.default);

  return (
    <main className="min-h-screen bg-[var(--color-sage-500)] py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* HERO */}
        <header className="text-center">
          <h1
            className="
              text-[34px] sm:text-5xl md:text-6xl lg:text-7xl
              font-semibold leading-tight tracking-tight
              text-[var(--on-sage)] md:whitespace-nowrap
            "
          >
            Know uptime & price for any API
          </h1>

          <p
            className="
              mt-2 sm:mt-3
              text-xs sm:text-sm md:text-base
              text-[var(--on-sage)]/80
              max-w-3xl mx-auto
            "
          >
            Daily checks rank latency, uptime & cost—one Trust Score before you
            integrate.
          </p>

          {/* Search (centered) */}
          <div className="mt-6 flex justify-center">
            <div className="w-full sm:w-[560px]">
              <SearchBar />
            </div>
          </div>
        </header>

        {/* KPI CARD */}
        <section className="mt-10">
          <TrustCard data={data} />
        </section>

        {/* Primary CTA under the card */}
        <div className="mt-8 flex justify-center">
          <a
            href="#beta"
            className="
              inline-flex items-center justify-center
              px-7 py-3 rounded-full
              bg-[var(--color-forest-700)] text-white
              border-2 border-[var(--color-forest-700)]
              shadow-sm
              hover:bg-[var(--color-forest-600)]
              focus:outline-none focus:ring-4 focus:ring-[var(--color-forest-700)]/30
              transition-colors
            "
          >
            Join Beta
          </a>
        </div>

        {/* Social proof */}
        <section className="mt-16">
          <Testimonials />
        </section>

        {/* Pricing */}
        <Pricing />

        {/* Email capture (anchor for the button above) */}
        <section id="beta" className="scroll-mt-24">
          <WaitlistForm endpoint="https://formspree.io/f/mblajbyr" />
        </section>

        {/* FAQ */}
        <Faq />

        {/* Simple footer */}
        <footer className="mt-16 pb-8 text-center text-xs text-[var(--on-sage)]/70">
          © {new Date().getFullYear()} API Trust — all rights reserved.
        </footer>
      </div>
    </main>
  );
}