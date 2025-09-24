// src/data/pricing.ts
export type BillingPeriod = "monthly" | "annual";

export const plansByPeriod: Record<BillingPeriod, Array<{
  name: string;
  price: string;     // formatted
  priceNote?: string; // optional small caption under price
  cta: string;
  anchor?: string;
  highlight?: boolean;
  features: string[];
}>> = {
  monthly: [
    {
      name: "Team",
      price: "$149/mo",
      cta: "Request access",
      anchor: "#beta",
      features: [
        "5 APIs",
        "2 regions",
        "Slack alerts",
        "Monthly PDF",
      ],
    },
    {
      name: "Scale",
      price: "$499/mo",
      cta: "Request access",
      anchor: "#beta",
      highlight: true,
      features: [
        "20 APIs",
        "5 regions",
        "Custom SLAs",
        "CSV export",
      ],
    },
  ],
  annual: [
    {
      name: "Team",
      price: "$1,788/yr",
      priceNote: "Equivalent to $149/mo",
      cta: "Request access",
      anchor: "#beta",
      features: [
        "5 APIs",
        "2 regions",
        "Slack alerts",
        "Monthly PDF",
      ],
    },
    {
      name: "Scale",
      price: "$5,988/yr",
      priceNote: "Equivalent to $499/mo",
      cta: "Request access",
      anchor: "#beta",
      highlight: true,
      features: [
        "20 APIs",
        "5 regions",
        "Custom SLAs",
        "CSV export",
      ],
    },
  ],
};