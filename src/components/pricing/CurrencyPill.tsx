"use client";

import { motion } from "framer-motion";
import { useCurrency, type Currency } from "@/lib/i18n";

/**
 * IDR | USD pill, styled to match the Monthly/Yearly cadence toggle.
 * Lives only inside pricing contexts (the /pricing grid and each
 * service's pricing section), so the currency switch sits right where
 * the prices are, not in the global nav.
 *
 * `layoutId` is parameterised so a page can mount more than one without
 * the animated highlight jumping between them.
 */
export default function CurrencyPill({ id = "default" }: { id?: string }) {
  const { currency, setCurrency } = useCurrency();
  const options: Array<{ value: Currency; label: string }> = [
    { value: "idr", label: "IDR" },
    { value: "usd", label: "USD" },
  ];

  return (
    <div
      role="tablist"
      aria-label="Currency"
      className="inline-flex items-center rounded-full border border-ink/15 bg-bone p-1 text-sm"
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
            data-cursor="hover"
            className="relative px-5 md:px-6 py-2.5 rounded-full transition-colors duration-300"
          >
            {active && (
              <motion.span
                layoutId={`currency-pill-${id}`}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="absolute inset-0 rounded-full bg-ink"
                aria-hidden
              />
            )}
            <span
              className={`relative z-10 font-medium tracking-[0.08em] transition-colors duration-300 ${
                active ? "text-bone" : "text-ink/70"
              }`}
            >
              {o.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
