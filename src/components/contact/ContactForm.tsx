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

const EMAIL_TO = "hello@onyxcreative.asia";
const WA_NUMBER = "62895413372822";
const EMAIL_SUBJECT = "New project inquiry — Onyx Creative Asia";

type Sent = boolean;

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [budget, setBudget] = useState<string | null>(null);
  const [services, setServices] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<Sent>(false);

  function toggleService(s: string) {
    setServices((curr) =>
      curr.includes(s) ? curr.filter((c) => c !== s) : [...curr, s]
    );
  }

  function validate(): boolean {
    if (!name.trim())    { setError("Please add your name."); return false; }
    if (!email.trim())   { setError("Please add your email."); return false; }
    if (!message.trim()) { setError("Please add a short brief."); return false; }
    // Light email shape check — we're not the gatekeeper, email clients are.
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("That email doesn't look right.");
      return false;
    }
    setError(null);
    return true;
  }

  /**
   * Build the message body the user asked for — pasted verbatim into
   * the email body or the WhatsApp text. Missing optional fields collapse
   * to an em-dash so the recipient sees what was skipped.
   */
  function buildMessage(): string {
    const interest = services.length > 0 ? services.join(", ") : "—";
    return (
      "Hi, Onyx Creative Asia, I'm interested to know more.\n\n" +
      `Name: ${name.trim()}\n` +
      `Company: ${company.trim() || "—"}\n` +
      `Email: ${email.trim()}\n` +
      `I'm interested in: ${interest}\n` +
      `Budget: ${budget ?? "—"}\n` +
      `Brief: ${message.trim()}`
    );
  }

  /**
   * Single send action — fires both channels from the same user gesture:
   *   1. Opens WhatsApp in a new tab with the message pre-typed
   *      (the user's primary conversation channel from here on).
   *   2. Triggers the OS email handler with the brief pre-filled
   *      (so the same body lands in hello@onyxcreative.asia as a backup,
   *      and the user just hits Send in their email client).
   *
   * Order matters: WA pop-up first so it inherits the click gesture
   * before any navigation. Mailto fires last; on modern browsers it
   * hands off to the email app without leaving the contact page.
   */
  function send() {
    if (!validate()) return;
    const body = buildMessage();
    const encodedBody = encodeURIComponent(body);
    const encodedSubject = encodeURIComponent(EMAIL_SUBJECT);

    // 1. WhatsApp — new tab
    window.open(
      `https://wa.me/${WA_NUMBER}?text=${encodedBody}`,
      "_blank",
      "noopener,noreferrer"
    );
    // 2. Email — OS handoff (does not navigate the page)
    window.location.href = `mailto:${EMAIL_TO}?subject=${encodedSubject}&body=${encodedBody}`;

    setSent(true);
  }

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
              (Opened — WhatsApp tab + email draft)
            </p>
            <h3 className="text-display-sm font-medium leading-[0.95] tracking-tight max-w-3xl mx-auto text-balance">
              Brief is pre-filled — hit send and{" "}
              <span className="font-light italic">
                we&apos;ll reply within 48 hours.
              </span>
            </h3>
            <p className="mt-8 text-sm opacity-70 max-w-xl mx-auto leading-relaxed">
              If your email client didn&apos;t open, copy the brief from the
              WhatsApp tab — or write us at{" "}
              <a
                href="mailto:hello@onyxcreative.asia"
                className="underline underline-offset-4 hover:opacity-100 opacity-90"
              >
                hello@onyxcreative.asia
              </a>
              .
            </p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="mt-10 text-xs uppercase tracking-[0.25em] opacity-60 hover:opacity-100 transition-opacity"
            >
              ← Edit the brief again
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
              send();
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
                className="input"
              />
              <input
                type="text"
                name="company"
                placeholder="Company (optional)"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                autoComplete="organization"
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
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm transition-all duration-300 ease-out-expo",
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
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm transition-all duration-300 ease-out-expo",
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
                One send — we get it in inbox &amp; WhatsApp. Reply within 48h.
              </p>
              <button
                type="submit"
                className="group inline-flex items-center gap-4 rounded-full bg-ink px-8 py-4 text-bone transition-transform duration-500 ease-out-expo hover:scale-[1.03] w-fit"
              >
                <span className="text-sm font-medium">Send the brief</span>
                <span
                  aria-hidden
                  className="text-xs opacity-70 tracking-wider"
                >
                  EMAIL + WHATSAPP
                </span>
                <span
                  aria-hidden
                  className="transition-transform duration-500 group-hover:translate-x-1"
                >
                  →
                </span>
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
          transition: border-color 300ms ease;
        }
        :global(.input::placeholder) {
          color: rgba(14, 14, 14, 0.35);
        }
        :global(.input:focus) {
          border-color: #0e0e0e;
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
