"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  priceFor,
  SERVICE_ROWS,
  TIER_LABELS,
  TIER_ORDER,
  YEARLY_SAVINGS_RANGE,
  type Tier,
} from "@/lib/pricing";
import { useCurrency, useT } from "@/lib/i18n";

type Cadence = "monthly" | "yearly";

/**
 * Mapping from /services/[slug] IDs to the matching pricing.ts row ID.
 * The Service detail page calls <ServicePricing serviceSlug="..."> with
 * the URL slug and we resolve to the price row here. Keeping the map
 * explicit (rather than auto-deriving) so a service can opt out of
 * showing a pricing block by simply omitting the entry.
 */
const SERVICE_TO_PRICING_ID: Record<string, string> = {
  "web-development": "web",
  "paid-media": "ads",
  "social-media": "social",
  "ai-systems": "ai",
};

function CadenceToggle({
  value,
  onChange,
}: {
  value: Cadence;
  onChange: (v: Cadence) => void;
}) {
  const t = useT();
  return (
    <div
      role="tablist"
      aria-label="Billing cadence"
      className="inline-flex items-center rounded-full border border-ink/15 bg-bone p-1 text-sm"
    >
      {(["monthly", "yearly"] as const).map((c) => {
        const active = value === c;
        return (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(c)}
            data-cursor="hover"
            className="relative px-5 md:px-6 py-2.5 rounded-full transition-colors duration-300"
          >
            {active && (
              <motion.span
                layoutId={`cadence-pill-service`}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="absolute inset-0 rounded-full bg-ink"
                aria-hidden
              />
            )}
            <span
              className={`relative z-10 font-medium tracking-tight transition-colors duration-300 ${
                active ? "text-bone" : "text-ink/70"
              }`}
            >
              {c === "monthly" ? t("Monthly") : t("Yearly")}
              {c === "yearly" && (
                <span
                  className={`ml-2 text-[10px] uppercase tracking-[0.18em] ${
                    active ? "text-bone/70" : "text-ink/50"
                  }`}
                >
                  {t(`save ${YEARLY_SAVINGS_RANGE}`)}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function ServicePricing({
  serviceSlug,
}: {
  serviceSlug: string;
}) {
  const t = useT();
  const { currency } = useCurrency();
  const pricingId = SERVICE_TO_PRICING_ID[serviceSlug];
  const row = SERVICE_ROWS.find((r) => r.id === pricingId);

  const [cadence, setCadence] = useState<Cadence>("monthly");

  // Nothing to render for services without a pricing row (e.g. if you
  // later add a service that's bespoke-only). Fail soft, not loud.
  if (!row) return null;

  const tiers = cadence === "monthly" ? row.monthly : row.yearly;
  const cadenceSuffix = cadence === "monthly" ? t("/mo") : t("/yr");

  return (
    <section className="container-x pb-24 md:pb-32 border-t border-hairline pt-16 md:pt-20">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-y-10 gap-x-10 md:gap-x-12">
        {/* Left column: heading + cadence toggle + intro */}
        <div className="md:col-span-4">
          <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-3">
            {t("Pricing")}
          </p>
          <h2 className="text-display-sm font-medium leading-[0.95] tracking-tight">
            {t("Three tiers.")}
            <br />
            <span className="font-light italic">{t("Pick yours.")}</span>
          </h2>
          <p className="mt-6 text-base md:text-lg text-ink/70 leading-relaxed max-w-sm">
            {t(
              "Transparent monthly retainer. Switch to yearly upfront to save 30 to 46%. No lock-in on monthly, refund pro-rata on yearly.",
            )}
          </p>
          <div className="mt-8">
            <CadenceToggle value={cadence} onChange={setCadence} />
          </div>
          {row.footnote && (
            <p className="mt-8 text-xs uppercase tracking-[0.22em] text-ink/50">
              //&nbsp;&nbsp;{t(row.footnote)}
            </p>
          )}
          <Link
            href="/pricing"
            className="mt-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] opacity-75 hover:opacity-100 transition-opacity group"
          >
            {t("See all pricing")}
            <span
              aria-hidden
              className="inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>

        {/* Right column: three tier cards */}
        <div className="md:col-span-8 md:col-start-5 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
          {TIER_ORDER.map((tier: Tier) => {
            const content = tiers[tier];
            return (
              <div
                key={tier}
                className="flex flex-col p-6 md:p-7 border border-hairline hover:border-ink/40 transition-colors duration-500"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-ink/55">
                  {t(TIER_LABELS[tier])}
                </p>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`${cadence}-${currency}-${priceFor(content.price, currency)}`}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
                    className="mt-3"
                  >
                    <p className="flex items-baseline gap-1.5">
                      <span className="text-3xl md:text-4xl font-medium tracking-tight">
                        {priceFor(content.price, currency)}
                      </span>
                      <span className="text-sm italic font-light text-ink/55">
                        {cadenceSuffix}
                      </span>
                    </p>
                  </motion.div>
                </AnimatePresence>

                <ul className="mt-6 space-y-2.5 border-t border-hairline pt-5 text-sm leading-snug">
                  {content.bullets.map((b) => (
                    <li key={b} className="flex items-baseline gap-2">
                      <span className="text-[10px] mt-1 tabular-nums text-ink/40">
                        ·
                      </span>
                      <span>{t(b)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
