import Link from "next/link";
import { SERVICE_ROWS, TIER_ORDER, type Tier } from "@/lib/pricing";
import TierCard from "./TierCard";

/**
 * Maps a /services/[slug] id to the matching pricing.ts row id. Explicit
 * (not auto-derived) so a service can opt out of a pricing block by
 * omitting its entry.
 */
const SERVICE_TO_PRICING_ID: Record<string, string> = {
  "web-development": "web",
  "paid-media": "ads",
  "social-media": "social",
  "ai-systems": "ai",
};

export default function ServicePricing({
  serviceSlug,
}: {
  serviceSlug: string;
}) {
  const pricingId = SERVICE_TO_PRICING_ID[serviceSlug];
  const row = SERVICE_ROWS.find((r) => r.id === pricingId);
  if (!row) return null;

  return (
    <section className="container-x pb-24 md:pb-32 border-t border-hairline pt-16 md:pt-20">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-y-10 gap-x-10 md:gap-x-12">
        {/* Left column: heading + intro + legend */}
        <div className="md:col-span-4">
          <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-3">
            Pricing
          </p>
          <h2 className="text-display-sm font-medium leading-[0.95] tracking-tight">
            Three tiers.
            <br />
            <span className="font-light italic">Pick yours.</span>
          </h2>
          <p className="mt-6 text-base md:text-lg text-ink/70 leading-relaxed max-w-sm">
            Fixed, published pricing. Each tier lists exactly what is
            included and what is not.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.2em] text-ink/55">
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

          {row.footnote && (
            <p className="mt-8 text-xs uppercase tracking-[0.22em] text-ink/50">
              //&nbsp;&nbsp;{row.footnote}
            </p>
          )}
          <Link
            href="/pricing"
            className="mt-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] opacity-75 hover:opacity-100 transition-opacity group"
          >
            See all pricing
            <span
              aria-hidden
              className="inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>

        {/* Right column: three tier cards */}
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
      </div>
    </section>
  );
}
