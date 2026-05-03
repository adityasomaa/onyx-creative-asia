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

const BUDGETS = ["< $5k", "$5k–$15k", "$15k–$50k", "$50k+", "Not sure yet"];

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [budget, setBudget] = useState<string | null>(null);
  const [services, setServices] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  function toggleService(s: string) {
    setServices((curr) =>
      curr.includes(s) ? curr.filter((c) => c !== s) : [...curr, s]
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company: company || null,
          budget,
          services,
          message,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="py-20 md:py-32 text-center"
            role="status"
            aria-live="polite"
          >
            <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-6">
              (Received — thank you)
            </p>
            <h3 className="text-display-sm font-medium leading-[0.95] tracking-tight max-w-3xl mx-auto text-balance">
              Got it. We&apos;ll be in touch <span className="font-light italic">within 48 hours.</span>
            </h3>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={onSubmit}
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

            <div className="flex items-center justify-between gap-6 pt-6 border-t border-hairline">
              <p className="text-xs uppercase tracking-[0.25em] opacity-60">
                We reply within 48h
              </p>
              <button
                type="submit"
                disabled={status === "submitting"}
                className={cn(
                  "group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-bone transition-transform duration-500 ease-out-expo",
                  status === "submitting"
                    ? "opacity-60 cursor-wait"
                    : "hover:scale-[1.03]"
                )}
              >
                <span className="text-sm font-medium">
                  {status === "submitting" ? "Sending…" : "Send the brief"}
                </span>
                <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
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
  return (
    <fieldset className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-4 items-start">
      <legend className="md:col-span-3 col-span-12 text-xs uppercase tracking-[0.25em] opacity-60 flex items-center gap-3 mb-2 md:mb-0">
        <span className="tabular-nums">{number}</span>
        <span className="h-px w-6 bg-ink/30" />
        <span>{label}</span>
      </legend>
      <div className="md:col-span-9 col-span-12 space-y-6">{children}</div>
    </fieldset>
  );
}
