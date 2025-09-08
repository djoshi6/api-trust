// src/components/Pricing.tsx
export function Pricing() {
    return (
      <section className="mt-16" aria-labelledby="pricing-title">
        <h2
          id="pricing-title"
          className="text-center text-2xl sm:text-3xl font-semibold text-[var(--on-sage)]"
        >
          Pricing
        </h2>
        <p className="mt-2 text-center text-[13px] text-[var(--on-sage)]/80">
          Start free. Upgrade when your team needs more APIs and history.
        </p>
  
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {/* Free */}
          <div className="rounded-2xl bg-[var(--color-paper)] ring-1 ring-[var(--color-ring)] p-5 shadow-[var(--shadow-card)]">
            <h3 className="text-lg font-semibold text-[var(--ink-900)]">Free</h3>
            <p className="mt-1 text-sm text-[var(--ink-500)]">For solo devs</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-semibold text-[var(--ink-900)]">$0</span>
              <span className="text-[var(--ink-500)]">/mo</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-[var(--ink-700)]">
              <li>• 3 tracked APIs</li>
              <li>• Daily checks</li>
              <li>• 7-day history</li>
            </ul>
            <a
              href="#beta"
              className="mt-5 inline-flex w-full justify-center rounded-xl bg-[var(--color-forest-700)] px-4 py-2 text-white hover:bg-[var(--color-forest-600)]"
            >
              Get started
            </a>
          </div>
  
          {/* Team (featured) */}
          <div className="rounded-2xl bg-[var(--color-paper)] ring-2 ring-[var(--color-forest-700)] p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[var(--ink-900)]">Team</h3>
              <span className="rounded-full bg-[var(--color-forest-700)]/10 px-2 py-0.5 text-xs text-[var(--color-forest-700)]">
                Popular
              </span>
            </div>
            <p className="mt-1 text-sm text-[var(--ink-500)]">For small teams</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-semibold text-[var(--ink-900)]">$49</span>
              <span className="text-[var(--ink-500)]">/mo</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-[var(--ink-700)]">
              <li>• 25 tracked APIs</li>
              <li>• Hourly checks</li>
              <li>• 90-day history</li>
              <li>• Email alerts</li>
            </ul>
            <a
              href="#beta"
              className="mt-5 inline-flex w-full justify-center rounded-xl bg-[var(--color-forest-700)] px-4 py-2 text-white hover:bg-[var(--color-forest-600)]"
            >
              Start trial
            </a>
          </div>
  
          {/* Enterprise */}
          <div className="rounded-2xl bg-[var(--color-paper)] ring-1 ring-[var(--color-ring)] p-5 shadow-[var(--shadow-card)]">
            <h3 className="text-lg font-semibold text-[var(--ink-900)]">Enterprise</h3>
            <p className="mt-1 text-sm text-[var(--ink-500)]">For platforms</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-semibold text-[var(--ink-900)]">Custom</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-[var(--ink-700)]">
              <li>• Unlimited APIs</li>
              <li>• 5-minute checks</li>
              <li>• 1-year history</li>
              <li>• Webhooks & SSO</li>
              <li>• Dedicated support</li>
            </ul>
            <a
              href="#beta"
              className="mt-5 inline-flex w-full justify-center rounded-xl bg-[var(--color-forest-700)] px-4 py-2 text-white hover:bg-[var(--color-forest-600)]"
            >
              Contact sales
            </a>
          </div>
        </div>
      </section>
    );
  }  