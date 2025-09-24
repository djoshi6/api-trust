"use client";

import { useState } from "react";
import { plansByPeriod, type BillingPeriod } from "../data/pricing";

export default function Pricing() {
  const [period, setPeriod] = useState<BillingPeriod>("monthly");
  const plans = plansByPeriod[period];

  return (
    <section id="pricing" className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-4xl font-semibold tracking-tight">Pricing</h2>
        <p className="mt-2 text-center text-sm text-neutral-300">
          Start free. Upgrade when your team needs more APIs and history.
        </p>

        {/* Toggle */}
        <div className="mt-6 flex justify-center">
          <div className="inline-flex rounded-full bg-neutral-800 p-1">
            <button
              onClick={() => setPeriod("monthly")}
              className={`px-4 py-2 text-sm rounded-full transition
                ${period === "monthly" ? "bg-neutral-50 text-neutral-900" : "text-neutral-200"}
              `}
            >
              Monthly
            </button>
            <button
              onClick={() => setPeriod("annual")}
              className={`px-4 py-2 text-sm rounded-full transition
                ${period === "annual" ? "bg-neutral-50 text-neutral-900" : "text-neutral-200"}
              `}
            >
              Annual
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl border p-6 md:p-8 shadow-sm bg-neutral-50/90
                ${plan.highlight ? "border-emerald-700 ring-1 ring-emerald-700/40" : "border-neutral-200"}
              `}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-neutral-900">{plan.name}</h3>
                  <p className="mt-1 text-sm text-neutral-500">
                    {plan.name === "Team" ? "For small teams" : "For platforms"}
                  </p>
                </div>
                {plan.highlight && (
                  <span className="rounded-full bg-neutral-900/5 px-3 py-1 text-xs text-neutral-600">
                    Popular
                  </span>
                )}
              </div>

              <div className="mt-6">
                <div className="text-4xl font-bold text-neutral-900">{plan.price}</div>
                {plan.priceNote && (
                  <div className="mt-1 text-xs text-neutral-500">{plan.priceNote}</div>
                )}
              </div>

              <ul className="mt-6 space-y-2 text-sm text-neutral-700">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span aria-hidden className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-neutral-400" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Gated CTA */}
              <a
                href={plan.anchor ?? "#beta"}
                className="mt-8 inline-flex w-full items-center justify-center rounded-2xl
                           bg-emerald-800 px-5 py-3 text-base font-medium text-white
                           shadow-sm hover:bg-emerald-900 transition"
              >
                {plan.cta}
              </a>

              <p className="mt-2 text-center text-xs text-neutral-500">
                Purchasing is gated during beta. Request access to get onboarded.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}