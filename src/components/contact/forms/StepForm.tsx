"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { ErrorPill, FormStyles } from "./shared";
import { useT } from "@/lib/i18n";

const EASE = [0.25, 1, 0.5, 1] as const;

export type Step = {
  number: string;
  label: string;
  node: React.ReactNode;
  /** Return an error message to block advancing, or null when valid. */
  validate?: () => string | null;
};

/**
 * One-question-at-a-time wizard. Shows a single step, validates it before
 * advancing, and keeps the whole form inside its parent's height so the
 * contact page never needs to scroll: the step body is the only flexible
 * region, with progress on top and Back / Next pinned to the bottom.
 */
export function StepForm({
  steps,
  submitting,
  error,
  setError,
  onSubmit,
  submitLabel,
  submitKicker,
}: {
  steps: Step[];
  submitting: boolean;
  error: string | null;
  setError: (e: string | null) => void;
  onSubmit: () => void;
  submitLabel: string;
  submitKicker?: string;
}) {
  const t = useT();
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const step = steps[i];
  const last = i === steps.length - 1;

  function advance() {
    const err = step.validate?.() ?? null;
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    if (last) {
      onSubmit();
      return;
    }
    setDir(1);
    setI((n) => Math.min(n + 1, steps.length - 1));
  }

  function back() {
    if (i === 0) return;
    setError(null);
    setDir(-1);
    setI((n) => Math.max(n - 1, 0));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!submitting) advance();
      }}
      noValidate
      className="flex h-full flex-col"
    >
      {/* Progress */}
      <div className="flex items-center gap-4">
        <span className="text-xs uppercase tracking-[0.25em] tabular-nums opacity-60">
          {step.number} / {String(steps.length).padStart(2, "0")}
        </span>
        <div className="h-px flex-1 overflow-hidden bg-ink/15">
          <motion.div
            className="h-full origin-left bg-ink"
            initial={false}
            animate={{ scaleX: (i + 1) / steps.length }}
            transition={{ duration: 0.4, ease: EASE }}
          />
        </div>
      </div>

      {/* Step body, the only flexible region */}
      <div className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto py-6 md:py-9">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step.number}
            custom={dir}
            initial={{ opacity: 0, x: dir * 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -28 }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            <p className="mb-6 text-lg font-medium tracking-tight md:text-2xl">
              {t(step.label)}
            </p>
            <div className="space-y-5">{step.node}</div>
            {error && (
              <div className="mt-5">
                <ErrorPill>{t(error)}</ErrorPill>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer nav */}
      <div className="flex items-center justify-between gap-4 border-t border-hairline pt-5">
        <button
          type="button"
          onClick={back}
          disabled={i === 0 || submitting}
          className="text-sm tracking-tight text-ink/60 transition-opacity hover:text-ink disabled:pointer-events-none disabled:opacity-30"
        >
          ← {t("Back")}
        </button>
        <button
          type="submit"
          disabled={submitting}
          className={cn(
            "group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-3.5 text-bone transition-transform duration-500 ease-out-expo",
            submitting ? "cursor-wait opacity-80" : "hover:scale-[1.03]",
          )}
        >
          <span className="text-sm font-medium">
            {submitting
              ? t("Sending…")
              : last
                ? t(submitLabel)
                : t("Next")}
          </span>
          {last && submitKicker && !submitting && (
            <span aria-hidden className="text-xs tracking-wider opacity-70">
              {submitKicker}
            </span>
          )}
          <span
            aria-hidden
            className="text-base leading-none transition-transform duration-500 group-hover:translate-x-1"
          >
            →
          </span>
        </button>
      </div>
      <FormStyles />
    </form>
  );
}
