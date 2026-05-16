"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { getWaNumber } from "@/lib/wa-number";

/**
 * Shared bits across every sub-form: numbered field group, success
 * screen, error pill, submit button. Keeps the visual language
 * consistent regardless of which inquiry type is rendered.
 */

const EASE = [0.25, 1, 0.5, 1] as const;

/**
 * Re-exported for any external caller that imports
 * `{ WHATSAPP_NUMBER }` from this file. New code should import
 * `getWaNumber()` from `@/lib/wa-number` directly.
 */
export const WHATSAPP_NUMBER = getWaNumber();

/* ============================================================
 * Group — numbered field row (kicker · label · inputs)
 * ============================================================ */

export function Group({
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

/* ============================================================
 * Submit row
 * ============================================================ */

export function SubmitRow({
  submitting,
  caption,
  ctaLabel = "Send",
  ctaKicker,
}: {
  submitting: boolean;
  caption: string;
  ctaLabel?: string;
  ctaKicker?: string;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-6 border-t border-hairline">
      <p className="text-xs uppercase tracking-[0.25em] opacity-60 max-w-sm">
        {caption}
      </p>
      <button
        type="submit"
        disabled={submitting}
        className={cn(
          "group inline-flex items-center gap-4 rounded-full bg-ink px-8 py-4 text-bone transition-transform duration-500 ease-out-expo w-fit",
          submitting ? "opacity-80 cursor-wait" : "hover:scale-[1.03]"
        )}
      >
        <span className="text-sm font-medium">
          {submitting ? "Sending…" : ctaLabel}
        </span>
        {ctaKicker && !submitting && (
          <span
            aria-hidden
            className="text-xs opacity-70 tracking-wider"
          >
            {ctaKicker}
          </span>
        )}
        {!submitting && (
          <span
            aria-hidden
            className="text-base leading-none transition-transform duration-500 group-hover:translate-x-1"
          >
            →
          </span>
        )}
      </button>
    </div>
  );
}

/* ============================================================
 * ErrorPill
 * ============================================================ */

export function ErrorPill({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="alert"
      className="text-sm text-red-700 border-l-2 border-red-700 pl-3"
    >
      {children}
    </p>
  );
}

/* ============================================================
 * SuccessScreen — single layout for every successful submission.
 * ============================================================ */

export function SuccessScreen({
  kicker,
  headline,
  body,
  ctaLabel = "← Send another inquiry",
  onReset,
}: {
  kicker: string;
  headline: React.ReactNode;
  body: React.ReactNode;
  ctaLabel?: string;
  onReset: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="py-20 md:py-32 text-center"
      role="status"
      aria-live="polite"
    >
      <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-6">
        {kicker}
      </p>
      <h3 className="text-display-sm font-medium leading-[0.95] tracking-tight max-w-3xl mx-auto text-balance">
        {headline}
      </h3>
      <div className="mt-8 text-sm opacity-70 max-w-xl mx-auto leading-relaxed">
        {body}
      </div>
      <button
        type="button"
        onClick={onReset}
        className="mt-10 text-xs uppercase tracking-[0.25em] opacity-60 hover:opacity-100 transition-opacity"
      >
        {ctaLabel}
      </button>
    </motion.div>
  );
}

/* ============================================================
 * SuccessFallbackCopy — what to do if the user wants to follow up.
 * ============================================================ */

export function SuccessFallback() {
  return (
    <>
      <p>
        A copy of your message is in your inbox now — keep an eye on it (and
        check spam, just in case).
      </p>
      <p className="mt-3 text-xs uppercase tracking-[0.25em] opacity-50">
        Or write us anytime at{" "}
        <a
          href="mailto:hello@onyxcreative.asia"
          className="underline underline-offset-4 hover:opacity-100 opacity-90"
        >
          hello@onyxcreative.asia
        </a>
      </p>
    </>
  );
}

/* ============================================================
 * Pill set — multi or single select for chips.
 * ============================================================ */

export function PillSet({
  options,
  selected,
  onToggle,
  multi = false,
  disabled = false,
}: {
  options: readonly string[];
  selected: string | string[];
  onToggle: (value: string) => void;
  multi?: boolean;
  disabled?: boolean;
}) {
  const isSelected = (v: string) =>
    multi
      ? Array.isArray(selected) && selected.includes(v)
      : selected === v;
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = isSelected(o);
        return (
          <button
            key={o}
            type="button"
            onClick={() => onToggle(o)}
            aria-pressed={active}
            disabled={disabled}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-all duration-300 ease-out-expo disabled:opacity-50 disabled:cursor-not-allowed",
              active
                ? "bg-ink text-bone border-ink"
                : "border-ink/25 hover:border-ink hover:-translate-y-0.5"
            )}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================
 * Input styles — shared CSS via the .input class.
 * Imported once into each sub-form as <FormStyles />.
 * ============================================================ */

export function FormStyles() {
  return (
    <style jsx global>{`
      .input {
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
      .input::placeholder {
        color: rgba(14, 14, 14, 0.35);
      }
      .input:focus {
        border-color: #0e0e0e;
      }
      .input:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }
    `}</style>
  );
}
