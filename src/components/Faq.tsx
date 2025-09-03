export function Faq() {
    const qa = [
      {
        q: "How is the Trust Score calculated?",
        a: "We combine normalized uptime, p95 latency and per-request cost into a single 0–100 score. Weights will be tunable.",
      },
      {
        q: "How often are checks run?",
        a: "Daily during beta (more often for high-volatility APIs).",
      },
      {
        q: "Which APIs are on deck?",
        a: "Auth, payments, vector DBs, LLM providers, SMS, email, geocoding. Suggest more in the survey above.",
      },
    ];
  
    return (
      <section className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-center text-2xl font-semibold text-[var(--on-sage)] mb-6">
          FAQ
        </h2>
        <div className="space-y-3">
          {qa.map((item, i) => (
            <details
              key={i}
              className="rounded-xl bg-[var(--color-paper)] border border-[var(--color-ring)]
                         p-4 shadow-[var(--shadow-card)]"
            >
              <summary className="cursor-pointer font-medium text-[var(--ink-900)]">
                {item.q}
              </summary>
              <p className="mt-2 text-[var(--ink-700)]">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    );
  }
  