"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  BUNDLE_SAVINGS,
  PRICING_NOTES,
  priceFor,
  SERVICE_ROWS,
  TIER_LABELS,
  TIER_ORDER,
  YEARLY_SAVINGS_RANGE,
  type Tier,
} from "@/lib/pricing";
import { useLang, useT } from "@/lib/i18n";

type Cadence = "monthly" | "yearly";

// Bone-on-ink toggle pill. Matches the Sigap/contact CTAs in tone.
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
                layoutId="cadence-pill"
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 32,
                }}
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

// One service block (5 of these stack on the page). Each block holds
// three tier cards. The featured row (Full Digital Marketing) renders
// in inverted ink-on-bone styling so it reads as the recommended offer.
function ServiceBlock({
  row,
  cadence,
  index,
}: {
  row: (typeof SERVICE_ROWS)[number];
  cadence: Cadence;
  index: number;
}) {
  const t = useT();
  const { lang } = useLang();
  const tiers = cadence === "monthly" ? row.monthly : row.yearly;
  // Default suffix is English (/mo, /yr). t() swaps to /bln, /thn in ID.
  const cadenceSuffix = cadence === "monthly" ? t("/mo") : t("/yr");

  return (
    <article
      id={row.id}
      className={`grid grid-cols-1 md:grid-cols-12 gap-y-10 gap-x-10 md:gap-x-12 scroll-mt-32 border-t pt-16 md:pt-20 pb-16 md:pb-20 ${
        row.featured
          ? "border-ink/60"
          : "border-hairline"
      }`}
    >
      <div className="md:col-span-4">
        <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-3 tabular-nums">
          {String(index + 1).padStart(2, "0")} / 05
        </p>
        {/* Service NAME is the headline now (was a poetic italic+bold
            tagline before — replaced so a first-time visitor reads
            "Web & Software Development" instead of having to parse
            "Built once, ships forever." for meaning). The tagline
            survives as a small italic kicker beneath. */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-[0.98] tracking-tight">
          {t(row.name)}
        </h2>
        <p className="mt-3 text-base md:text-lg italic font-light text-ink/55 leading-snug">
          {row.italic} {row.bold}
        </p>
        <p className="mt-5 max-w-sm text-base md:text-lg text-ink/70 leading-relaxed">
          {t(row.blurb)}
        </p>
        {row.footnote && (
          <p className="mt-6 text-xs uppercase tracking-[0.22em] text-ink/50">
            //&nbsp;&nbsp;{t(row.footnote)}
          </p>
        )}
      </div>

      <div className="md:col-span-8 md:col-start-5 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
        {TIER_ORDER.map((tier: Tier) => {
          const content = tiers[tier];
          const isFeatured = row.featured;
          return (
            <div
              key={tier}
              className={`flex flex-col p-6 md:p-7 border transition-colors duration-500 ${
                isFeatured
                  ? "border-ink bg-ink text-bone"
                  : "border-hairline hover:border-ink/40"
              }`}
            >
              <p
                className={`text-xs uppercase tracking-[0.25em] ${
                  isFeatured ? "text-bone/60" : "text-ink/55"
                }`}
              >
                {t(TIER_LABELS[tier])}
              </p>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${cadence}-${lang}-${priceFor(content.price, lang)}`}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
                  className="mt-3"
                >
                  <p className="flex items-baseline gap-1.5">
                    <span className="text-3xl md:text-4xl font-medium tracking-tight">
                      {priceFor(content.price, lang)}
                    </span>
                    <span
                      className={`text-sm italic font-light ${
                        isFeatured ? "text-bone/60" : "text-ink/55"
                      }`}
                    >
                      {cadenceSuffix}
                    </span>
                  </p>
                </motion.div>
              </AnimatePresence>

              <ul
                className={`mt-6 space-y-2.5 border-t pt-5 text-sm leading-snug ${
                  isFeatured ? "border-bone/15" : "border-hairline"
                }`}
              >
                {content.bullets.map((b) => (
                  <li key={b} className="flex items-baseline gap-2">
                    <span
                      className={`text-[10px] mt-1 tabular-nums ${
                        isFeatured ? "text-bone/50" : "text-ink/40"
                      }`}
                    >
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
    </article>
  );
}

export default function PricingGrid() {
  const t = useT();
  const [cadence, setCadence] = useState<Cadence>("monthly");

  return (
    <>
      <div className="container-x pb-10 md:pb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-3">
            {t("(Billing cadence)")}
          </p>
          <p className="text-lg md:text-xl text-ink/75 leading-snug">
            {t(
              "Pick monthly for flexibility, or yearly to save 30 to 46% with an upfront commitment.",
            )}
          </p>
        </div>
        <CadenceToggle value={cadence} onChange={setCadence} />
      </div>

      <div className="container-x pb-24 md:pb-32 space-y-0">
        {SERVICE_ROWS.map((row, i) => (
          <ServiceBlock key={row.id} row={row} cadence={cadence} index={i} />
        ))}
      </div>

      {/* Bundle savings strip */}
      <section className="container-x pb-20 md:pb-28">
        <div className="border-t border-hairline pt-10 md:pt-14 grid grid-cols-1 md:grid-cols-12 gap-y-6 gap-x-10">
          <p className="text-xs uppercase tracking-[0.25em] opacity-60 md:col-span-4">
            {t("(Bundle savings)")}
          </p>
          <div className="md:col-span-8 md:col-start-5 grid grid-cols-3 gap-4 md:gap-6">
            {(Object.keys(BUNDLE_SAVINGS) as Tier[]).map((tier) => (
              <div key={tier} className="border-t border-ink/20 pt-4">
                <p className="text-xs uppercase tracking-[0.22em] opacity-55">
                  {t(TIER_LABELS[tier])}
                </p>
                <p className="mt-1 text-2xl md:text-3xl font-medium tracking-tight">
                  {BUNDLE_SAVINGS[tier]}
                </p>
                <p className="text-xs uppercase tracking-[0.18em] opacity-50 mt-1">
                  {t("off vs à la carte")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notes / fine print */}
      <section className="container-x pb-24 md:pb-32">
        <div className="border-t border-hairline pt-10 md:pt-14 grid grid-cols-1 md:grid-cols-12 gap-y-6 gap-x-10">
          <p className="text-xs uppercase tracking-[0.25em] opacity-60 md:col-span-4">
            {t("(The fine print)")}
          </p>
          <dl className="md:col-span-8 md:col-start-5 divide-y divide-hairline">
            {PRICING_NOTES.map((n) => (
              <div
                key={n.label}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 py-4"
              >
                <dt className="sm:col-span-3 text-xs uppercase tracking-[0.22em] opacity-55">
                  {t(n.label)}
                </dt>
                <dd className="sm:col-span-9 text-base text-ink/85 leading-snug">
                  {t(n.body)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
