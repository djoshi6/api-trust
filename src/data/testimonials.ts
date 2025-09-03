// src/data/testimonials.ts
export type Testimonial = {
    name: string;
    role?: string;
    quote: string;
    avatar?: string;
    logo?: string;
  };
  
  export const testimonials: Testimonial[] = [
    {
      name: "Priya K.",
      role: "Platform Eng @ CloudCo",
      quote:
        "The daily Trust Score saved us from integrating a flaky provider. Clear, fast, and accurate.",
    },
    {
      name: "Luis R.",
      role: "Founding Eng @ Fintech",
      quote:
        "We caught a 3AM latency regression before our users did. This is table stakes for API teams.",
    },
    {
      name: "Sam D.",
      role: "API PM @ SaaS",
      quote: "Finally—a single number my execs understand.",
    },
  ];
  