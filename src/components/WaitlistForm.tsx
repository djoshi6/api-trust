// src/components/WaitlistForm.tsx
"use client";

import { useRef, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

type Props = {
  endpoint?: string;
  successText?: string;
  errorText?: string;
};

export function WaitlistForm({
  endpoint = "https://formspree.io/f/mblajbyr",
  successText = "Thanks! You’re on the list.",
  errorText = "Something went wrong. Please try again.",
}: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errMsg, setErrMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrMsg("");

    const form = formRef.current!;
    const fd = new FormData(form);

    const email = String(fd.get("email") || "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrMsg("Please enter a valid email.");
      return;
    }

    setStatus("loading");
    try {
      // Formspree expects Accept: application/json for JSON response
      const res = await fetch(endpoint, {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error((await safeText(res)) || res.statusText);

      setStatus("success");
      form.reset();
    } catch (err: unknown) {
      setStatus("error");

      const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "Something went wrong.";

      setErrMsg(message);
    }
  }

  return (
    // no id="beta" here (the anchor lives in page.tsx)
    <section className="mt-16">
      <div className="mx-auto w-full max-w-xl rounded-2xl bg-[var(--color-paper)] p-6 shadow-[var(--shadow-card)] ring-1 ring-[var(--color-ring)]">
        <h3 className="text-lg font-semibold text-[var(--ink-900)] text-center">
          Join the beta
        </h3>
        <p className="mt-1 text-center text-[13px] text-[var(--ink-500)]">
          Get early access and weekly updates.
        </p>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className="mt-4 space-y-3"
        >
          {/* Email (required) */}
          <label className="block">
            <span className="mb-1 block text-sm text-[var(--ink-700)]">
              Work email
            </span>
            <input
              type="email"
              name="email"
              required
              placeholder="you@company.com"
              className="w-full rounded-xl bg-[var(--color-pill)] px-4 py-3 text-[var(--ink-900)] ring-1 ring-[var(--color-ring)] outline-none focus:ring-2 focus:ring-[var(--color-forest-700)]"
            />
          </label>

          {/* Full name */}
          <label className="block">
            <span className="mb-1 block text-sm text-[var(--ink-700)]">
              Full name
            </span>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              className="w-full rounded-xl bg-[var(--color-pill)] px-4 py-3 text-[var(--ink-900)] ring-1 ring-[var(--color-ring)] outline-none focus:ring-2 focus:ring-[var(--color-forest-700)]"
            />
          </label>

          {/* Company */}
          <label className="block">
            <span className="mb-1 block text-sm text-[var(--ink-700)]">
              Company
            </span>
            <input
              type="text"
              name="company"
              placeholder="Company"
              className="w-full rounded-xl bg-[var(--color-pill)] px-4 py-3 text-[var(--ink-900)] ring-1 ring-[var(--color-ring)] outline-none focus:ring-2 focus:ring-[var(--color-forest-700)]"
            />
          </label>

          {/* Role */}
          <label className="block">
            <span className="mb-1 block text-sm text-[var(--ink-700)]">Role</span>
            <input
              type="text"
              name="role"
              placeholder="Role"
              className="w-full rounded-xl bg-[var(--color-pill)] px-4 py-3 text-[var(--ink-900)] ring-1 ring-[var(--color-ring)] outline-none focus:ring-2 focus:ring-[var(--color-forest-700)]"
            />
          </label>

          {/* APIs checkboxes */}
          <fieldset className="rounded-xl border border-[var(--color-ring)] p-3">
            <legend className="px-1 text-sm text-[var(--ink-700)]">
              Which APIs do you want tracked?
            </legend>
            <div className="mt-2 grid grid-cols-2 gap-2 text-[var(--ink-900)]">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" name="apis[]" value="Auth" /> <span>Auth</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" name="apis[]" value="Payments" />{" "}
                <span>Payments</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" name="apis[]" value="LLM" /> <span>LLM</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" name="apis[]" value="Email/SMS" />{" "}
                <span>Email/SMS</span>
              </label>
            </div>
          </fieldset>

          {/* Notes */}
          <label className="block">
            <span className="mb-1 block text-sm text-[var(--ink-700)]">
              What’s most important?
            </span>
            <textarea
              name="notes"
              rows={4}
              placeholder="e.g., latency, spikes, price changes…"
              className="w-full rounded-xl bg-[var(--color-pill)] px-4 py-3 text-[var(--ink-900)] ring-1 ring-[var(--color-ring)] outline-none focus:ring-2 focus:ring-[var(--color-forest-700)]"
            />
          </label>

          {/* Optional extras recognized by Formspree */}
          <input
            type="hidden"
            name="_subject"
            value="New API Trust waitlist submission"
          />

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-xl bg-[var(--color-forest-700)] px-5 py-3 text-white ring-1 ring-[var(--color-forest-700)] hover:bg-[var(--color-forest-600)] disabled:opacity-60"
            >
              {status === "loading" ? "Joining…" : "Join"}
            </button>
          </div>
        </form>

        <div className="mt-3 text-center" aria-live="polite" role="status">
          {status === "success" && (
            <p className="text-sm text-[var(--color-forest-700)]">{successText}</p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-600">
              {errorText} {errMsg && <span className="opacity-70">({errMsg})</span>}
            </p>
          )}
          {status === "idle" && errMsg && (
            <p className="text-sm text-red-600">{errMsg}</p>
          )}
        </div>

        <p className="mt-2 text-center text-[11px] text-[var(--ink-500)]">
          We’ll only email about the beta. No spam, unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}

/** Safely read text from a Response without throwing on empty body */
async function safeText(res: Response) {
  try {
    return await res.text();
  } catch {
    return "";
  }
}
