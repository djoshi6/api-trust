"use client";
import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
  return (
    <section className="mt-20">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--on-sage)]">
          Teams already asking for this
        </h2>
        <p className="text-[var(--on-sage)]/80 mt-2">
          A few early voices from the waitlist.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <article
            key={i}
            className="
              rounded-2xl p-6
              bg-[var(--color-paper)]
              shadow-[var(--shadow-card)]
              border border-[var(--color-ring)]
              hover:translate-y-[-2px] transition
            "
          >
            <div className="flex items-center gap-3 mb-4">
              {t.logo ? (
                <img src={t.logo} alt="" className="h-8 w-8 rounded-md object-contain" />
              ) : (
                <div className="h-8 w-8 rounded-md bg-[var(--color-sage-500)]" />
              )}
              <div>
                <p className="font-medium text-[var(--ink-900)]">{t.name}</p>
                <p className="text-sm text-[var(--ink-500)]">{t.role}</p>
              </div>
            </div>
            {/* stars */}
            <div className="flex gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, s) => (
                <svg key={s} className="h-4 w-4 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.09 3.355a1 1 0 00.95.69h3.532c.969 0 1.371 1.24.588 1.81l-2.857 2.077a1 1 0 00-.364 1.118l1.09 3.356c.3.92-.755 1.688-1.54 1.118L10 13.347l-2.94 2.104c-.784.57-1.838-.198-1.539-1.118l1.09-3.356a1 1 0 00-.364-1.118L3.39 8.782c-.783-.57-.38-1.81.588-1.81H7.51a1 1 0 00.95-.69l1.09-3.355z"/>
                </svg>
              ))}
            </div>
            <p className="text-[var(--ink-700)] leading-relaxed">“{t.quote}”</p>
          </article>
        ))}
      </div>
    </section>
  );
}
