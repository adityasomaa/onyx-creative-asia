"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/cn";

const EASE = [0.25, 1, 0.5, 1] as const;

const SERVICES = [
  "Web Development",
  "Paid Media",
  "Social Media",
  "AI Systems",
  "Brand & Design",
];

const BUDGETS = ["< $1k", "$1k–$3k", "$3k–$5k", "$5k–$10k", "$10k+", "Not sure yet"];

const WA_NUMBER = "62895413372822";

type Status = "idle" | "submitting" | "sent";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [budget, setBudget] = useState<string | null>(null);
  const [services, setServices] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  function toggleService(s: string) {
    setServices((curr) =>
      curr.includes(s) ? curr.filter((c) => c !== s) : [...curr, s]
    );
  }

  function validate(): boolean {
    if (!name.trim())    { setError("Please add your name."); return false; }
    if (!email.trim())   { setError("Please add your email."); return false; }
    if (!message.trim()) { setError("Please add a short brief."); return false; }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("That email doesn't look right.");
      return false;
    }
    setError(null);
    return true;
  }

  /**
   * Plain-text body used to pre-fill the WhatsApp tab. The same structured
   * fields go to the API as JSON — we don't pass this string to the
   * backend (it'd lose the column structure). Resend builds its own
   * branded HTML from the structured fields on the server.
   */
  function buildWhatsAppBody(): string {
    const interest = services.length > 0 ? services.join(", ") : "—";
    return (
      "Hi Onyx Creative Asia! I just sent a brief via the contact form. Quick recap:\n\n" +
      `Name: ${name.trim()}\n` +
      `Company: ${company.trim() || "—"}\n` +
      `Email: ${email.trim()}\n` +
      `Interested in: ${interest}\n` +
      `Budget: ${budget ?? "—"}\n\n` +
      `Brief:\n${message.trim()}`
    );
  }

  /**
   * Single send action — fires two things from one click:
   *   1. Opens WhatsApp in a new tab, pre-filled, so the conversation
   *      can continue there if the user wants. Fires synchronously to
   *      preserve the click gesture (else Safari/Chrome block the popup).
   *   2. POSTs to /api/leads, which:
   *        - inserts the row into public.submissions (visible in
   *          /agents/submissions)
   *        - sends a branded auto-reply via Resend
   *        - notifies hello@onyxcreative.asia internally
   *
   * No more mailto: draft. The visitor doesn't have to do anything in
   * an external email client — confirmation lands in their inbox
   * automatically.
   */
  async function send() {
    if (!validate()) return;

    // 1. WhatsApp first — synchronous, inherits the click gesture
    const waText = encodeURIComponent(buildWhatsAppBody());
    window.open(
      `https://wa.me/${WA_NUMBER}?text=${waText}`,
      "_blank",
      "noopener,noreferrer"
    );

    // 2. Now async-POST the brief. UI goes into submitting state so the
    //    visitor sees the request in flight instead of an unresponsive
    //    button.
    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim() || null,
          budget,
          services,
          message: message.trim(),
        }),
      });

      let payload: { ok?: boolean; error?: string } = {};
      try {
        payload = await res.json();
      } catch {
        // Non-JSON response — fall through to status check.
      }

      if (!res.ok || payload.ok === false) {
        setStatus("idle");
        setError(
          payload.error ??
            "Couldn't deliver the brief just now. Mind trying again, or message us on WhatsApp?"
        );
        return;
      }

      setStatus("sent");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error.";
      console.error("[contact] submit failed:", msg);
      setStatus("idle");
      setError(
        "Couldn't reach the server. Check your connection and try again — or message us on WhatsApp."
      );
    }
  }

  const submitting = status === "submitting";
  const sent = status === "sent";

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="py-20 md:py-32 text-center"
            role="status"
            aria-live="polite"
          >
            <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-6">
              (Brief sent — confirmation on its way)
            </p>
            <h3 className="text-display-sm font-medium leading-[0.95] tracking-tight max-w-3xl mx-auto text-balance">
              We got it. We&apos;ll{" "}
              <span className="font-light italic">reply within 48 hours.</span>
            </h3>
            <p className="mt-8 text-sm opacity-70 max-w-xl mx-auto leading-relaxed">
              A copy of your brief is in your inbox now — keep an eye on it
              (and check spam, just in case). We also opened a WhatsApp tab
              if you&apos;d rather keep the conversation there.
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.25em] opacity-50">
              Or write us anytime at{" "}
              <a
                href="mailto:hello@onyxcreative.asia"
                className="underline underline-offset-4 hover:opacity-100 opacity-90"
              >
                hello@onyxcreative.asia
              </a>
            </p>
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setError(null);
              }}
              className="mt-10 text-xs uppercase tracking-[0.25em] opacity-60 hover:opacity-100 transition-opacity"
            >
              ← Send another brief
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={(e) => {
              e.preventDefault();
              if (!submitting) void send();
            }}
            className="space-y-12 md:space-y-16"
            noValidate
          >
            <Group label="Hello, my name is" number="01">
              <input
                type="text"
                name="name"
                required
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                disabled={submitting}
                className="input"
              />
              <input
                type="text"
                name="company"
                placeholder="Company (optional)"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                autoComplete="organization"
                disabled={submitting}
                className="input"
              />
            </Group>

            <Group label="You can reach me at" number="02">
              <input
                type="email"
                name="email"
                required
                placeholder="email@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={submitting}
                className="input"
              />
            </Group>

            <Group label="I'm interested in" number="03">
              <div className="flex flex-wrap gap-2">
                {SERVICES.map((s) => {
                  const active = services.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleService(s)}
                      aria-pressed={active}
                      disabled={submitting}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm transition-all duration-300 ease-out-expo disabled:opacity-50 disabled:cursor-not-allowed",
                        active
                          ? "bg-ink text-bone border-ink"
                          : "border-ink/25 hover:border-ink hover:-translate-y-0.5"
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </Group>

            <Group label="Budget in mind" number="04">
              <div className="flex flex-wrap gap-2">
                {BUDGETS.map((b) => {
                  const active = budget === b;
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBudget(active ? null : b)}
                      aria-pressed={active}
                      disabled={submitting}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm transition-all duration-300 ease-out-expo disabled:opacity-50 disabled:cursor-not-allowed",
                        active
                          ? "bg-ink text-bone border-ink"
                          : "border-ink/25 hover:border-ink hover:-translate-y-0.5"
                      )}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>
            </Group>

            <Group label="A bit about the project" number="05">
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Goals, timing, anything we should know…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={submitting}
                className="input resize-none"
              />
            </Group>

            {error && (
              <p
                role="alert"
                className="text-sm text-red-700 border-l-2 border-red-700 pl-3"
              >
                {error}
              </p>
            )}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-6 border-t border-hairline">
              <p className="text-xs uppercase tracking-[0.25em] opacity-60 max-w-sm">
                One send — email lands automatically, WhatsApp opens for
                the follow-up. Reply within 48h.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className={cn(
                  "group inline-flex items-center gap-4 rounded-full bg-ink px-8 py-4 text-bone transition-transform duration-500 ease-out-expo w-fit",
                  submitting
                    ? "opacity-80 cursor-wait"
                    : "hover:scale-[1.03]"
                )}
              >
                <span className="text-sm font-medium">
                  {submitting ? "Sending…" : "Send the brief"}
                </span>
                <span
                  aria-hidden
                  className="text-xs opacity-70 tracking-wider"
                >
                  {submitting ? "" : "EMAIL + WHATSAPP"}
                </span>
                {!submitting && (
                  <span
                    aria-hidden
                    className="transition-transform duration-500 group-hover:translate-x-1"
                  >
                    →
                  </span>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          background: transparent;
          border: 0;
          border-bottom: 1px solid rgba(14, 14, 14, 0.2);
          padding: 0.85rem 0;
          font-size: 1.125rem;
          font-family: var(--font-neue);
          color: #0e0e0e;
          outline: none;
          transition: border-color 300ms ease, opacity 300ms ease;
        }
        :global(.input::placeholder) {
          color: rgba(14, 14, 14, 0.35);
        }
        :global(.input:focus) {
          border-color: #0e0e0e;
        }
        :global(.input:disabled) {
          opacity: 0.55;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

function Group({
  label,
  number,
  children,
}: {
  label: string;
  number: string;
  children: React.ReactNode;
}) {
  const groupId = `group-${number}`;
  return (
    <div
      role="group"
      aria-labelledby={groupId}
      className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-7 md:gap-y-4 items-start"
    >
      <p
        id={groupId}
        className="md:col-span-3 col-span-12 text-xs uppercase tracking-[0.25em] opacity-60 flex items-center gap-3"
      >
        <span className="tabular-nums">{number}</span>
        <span className="h-px w-6 bg-ink/30" />
        <span>{label}</span>
      </p>
      <div className="md:col-span-9 col-span-12 space-y-6">{children}</div>
    </div>
  );
}
