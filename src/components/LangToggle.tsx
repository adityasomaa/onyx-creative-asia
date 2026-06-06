"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useCurrency, type Currency } from "@/lib/i18n";

/**
 * Compact IDR | USD pill toggle. Sits in the Nav between the desktop
 * links and the "Start a project" CTA, and in the mobile menu, so the
 * currency preference travels with the user and flips every price on
 * the pricing surfaces.
 *
 * Visual mirrors the Pricing cadence pill, an animated `layoutId`
 * highlight slides under the active option.
 */
export default function LangToggle({
  variant = "light",
  className,
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  const { currency, setCurrency } = useCurrency();
  const options: Array<{ value: Currency; label: string }> = [
    { value: "idr", label: "IDR" },
    { value: "usd", label: "USD" },
  ];

  return (
    <div
      role="tablist"
      aria-label="Currency"
      className={cn(
        "inline-flex items-center rounded-full p-[3px] text-[11px] tracking-[0.18em] uppercase font-medium",
        variant === "dark"
          ? "border border-bone/20 bg-transparent"
          : "border border-ink/15 bg-bone/60",
        className,
      )}
    >
      {options.map((o) => {
        const active = currency === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setCurrency(o.value)}
            className="relative px-3 py-1.5 rounded-full transition-colors duration-300"
            data-cursor="hover"
          >
            {active && (
              <motion.span
                layoutId={`currency-pill-${variant}`}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className={cn(
                  "absolute inset-0 rounded-full",
                  variant === "dark" ? "bg-bone" : "bg-ink",
                )}
                aria-hidden
              />
            )}
            <span
              className={cn(
                "relative z-10 transition-colors duration-300",
                active
                  ? variant === "dark"
                    ? "text-ink"
                    : "text-bone"
                  : variant === "dark"
                    ? "text-bone/65"
                    : "text-ink/65",
              )}
            >
              {o.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
