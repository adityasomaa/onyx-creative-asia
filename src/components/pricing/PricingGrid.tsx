import {
  PRICING_NOTES,
  SERVICE_ROWS,
  TIER_ORDER,
  type Tier,
} from "@/lib/pricing";
import TierCard from "./TierCard";

// Small legend so the checklist / oblique convention reads at a glance.
function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.2em] text-ink/55">
      <span className="inline-flex items-center gap-2">
        <span aria-hidden className="text-ink">
          ✓
        </span>
        Included
      </span>
      <span className="inline-flex items-center gap-2">
        <span aria-hidden className="text-ink/30">
          ✕
        </span>
        <span className="italic line-through decoration-ink/20">
          Not included
        </span>
      </span>
    </div>
  );
}

export default function PricingGrid() {
  return (
    <>
      <div className="container-x pb-10 md:pb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-3">
            (What you get)
          </p>
          <p className="text-lg md:text-xl text-ink/75 leading-snug">
            Fixed, published prices. Every tier lists exactly what is
            included and what is not.
          </p>
        </div>
        <Legend />
      </div>

      <div className="container-x pb-24 md:pb-32 space-y-0">
        {SERVICE_ROWS.map((row, i) => (
          <article
            key={row.id}
            id={row.id}
            className="grid grid-cols-1 md:grid-cols-12 gap-y-10 gap-x-10 md:gap-x-12 scroll-mt-32 border-t border-hairline pt-16 md:pt-20 pb-16 md:pb-20"
          >
            <div className="md:col-span-4">
              <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-3 tabular-nums">
                {String(i + 1).padStart(2, "0")} / 0{SERVICE_ROWS.length}
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-[0.98] tracking-tight">
                {row.name}
              </h2>
              <p className="mt-3 text-base md:text-lg italic font-light text-ink/55 leading-snug">
                {row.italic} {row.bold}
              </p>
              <p className="mt-5 max-w-sm text-base md:text-lg text-ink/70 leading-relaxed">
                {row.blurb}
              </p>
              {row.footnote && (
                <p className="mt-6 text-xs uppercase tracking-[0.22em] text-ink/50">
                  //&nbsp;&nbsp;{row.footnote}
                </p>
              )}
            </div>

            <div className="md:col-span-8 md:col-start-5 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 items-stretch">
              {TIER_ORDER.map((tier: Tier) => (
                <TierCard
                  key={tier}
                  tier={tier}
                  plan={row.tiers[tier]}
                  unit={row.unit}
                  priceNote={row.priceNote}
                />
              ))}
            </div>
          </article>
        ))}
      </div>

      {/* Notes / fine print */}
      <section className="container-x pb-24 md:pb-32">
        <div className="border-t border-hairline pt-10 md:pt-14 grid grid-cols-1 md:grid-cols-12 gap-y-6 gap-x-10">
          <p className="text-xs uppercase tracking-[0.25em] opacity-60 md:col-span-4">
            (The fine print)
          </p>
          <dl className="md:col-span-8 md:col-start-5 divide-y divide-hairline">
            {PRICING_NOTES.map((n) => (
              <div
                key={n.label}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 py-4"
              >
                <dt className="sm:col-span-3 text-xs uppercase tracking-[0.22em] opacity-55">
                  {n.label}
                </dt>
                <dd className="sm:col-span-9 text-base text-ink/85 leading-snug">
                  {n.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
