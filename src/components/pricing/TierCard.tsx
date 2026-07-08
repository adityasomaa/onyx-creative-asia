import { formatIDR, TIER_LABELS, type Tier, type TierPlan } from "@/lib/pricing";

/**
 * One pricing tier card. Renders the price, the full feature list, and
 * the "suitable for" line. Each feature is either:
 *   • included  → checklisted (✓ + upright text)
 *   • not included → oblique (✕ + italic, dimmed)
 * The Enterprise tier includes everything, so it shows no oblique rows.
 */
export default function TierCard({
  tier,
  plan,
  unit,
  priceNote,
}: {
  tier: Tier;
  plan: TierPlan;
  unit: "month" | "year";
  priceNote?: string;
}) {
  return (
    <div className="flex h-full flex-col border border-hairline p-6 md:p-7 transition-colors duration-500 hover:border-ink/40">
      <p className="text-xs uppercase tracking-[0.25em] text-ink/55">
        {TIER_LABELS[tier]}
      </p>

      <p className="mt-3 text-3xl md:text-4xl font-medium tracking-tight tabular-nums">
        {formatIDR(plan.amount)}
      </p>
      <p className="mt-1 text-sm italic font-light text-ink/55">/ {unit}</p>
      {priceNote && (
        <p className="mt-1 text-xs italic text-ink/45">{priceNote}</p>
      )}

      <ul className="mt-6 space-y-2.5 border-t border-hairline pt-5 text-sm leading-snug">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-baseline gap-2.5">
            <span
              aria-hidden
              className={`mt-px shrink-0 text-xs ${
                f.included ? "text-ink" : "text-ink/30"
              }`}
            >
              {f.included ? "✓" : "✕"}
            </span>
            <span
              className={
                f.included
                  ? "text-ink/85"
                  : "italic text-ink/35 line-through decoration-ink/20"
              }
            >
              {f.label}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-6 border-t border-hairline pt-5 text-sm italic leading-snug text-ink/60">
        {plan.suitableFor}
      </p>
    </div>
  );
}
