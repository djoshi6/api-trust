// src/components/SurveyCta.tsx
export function SurveyCta() {
    return (
      <section className="mt-14">
        <div className="mx-auto max-w-3xl rounded-2xl bg-[var(--color-paper)] p-6 text-center shadow-[var(--shadow-card)] ring-1 ring-[var(--color-ring)]">
          <h3 className="text-base font-semibold text-[var(--ink-900)]">
            60-second survey
          </h3>
          <p className="mt-1 text-[13px] text-[var(--ink-500)]">
            Tell us which APIs you rely on and what you want to monitor.
          </p>
          <a
            href="https://forms.gle/your-form-id"
            target="_blank"
            rel="noreferrer"
            className="
              mt-4 inline-flex items-center justify-center rounded-full
              bg-[var(--color-forest-700)] px-5 py-3 text-white
              ring-1 ring-[var(--color-forest-700)]
              hover:bg-[var(--color-forest-600)]
            "
          >
            Take the survey
          </a>
        </div>
      </section>
    );
  }
  