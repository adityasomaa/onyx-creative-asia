/**
 * Onyx Creative Asia, pricing source-of-truth.
 *
 * The /pricing page renders directly off this file, and the same
 * structure mirrors the printed proposal at
 * design/marketing/pricing-proposal/. Keep both in sync. If you bump a
 * tier price here, update build.py there too.
 *
 * Currency: every price carries both an IDR and a USD display string.
 * The UI picks one based on the active language (ID shows IDR, EN shows
 * USD), via priceFor() below. USD values are the IDR amount divided by
 * ~16,000 and rounded to a clean figure.
 */

export type Tier = "startup" | "growth" | "enterprise";

export const TIER_ORDER: ReadonlyArray<Tier> = [
  "startup",
  "growth",
  "enterprise",
];

export const TIER_LABELS: Record<Tier, string> = {
  startup: "Startup",
  growth: "Growth",
  enterprise: "Enterprise",
};

/** A price with both currency presentations. */
export type Money = { idr: string; usd: string };

/** Pick the display string for the active currency. */
export function priceFor(m: Money, currency: "idr" | "usd"): string {
  return currency === "idr" ? m.idr : m.usd;
}

export type TierContent = {
  /** Display price in both currencies. */
  price: Money;
  /** Inclusion bullets shown under the price. */
  bullets: ReadonlyArray<string>;
};

export type ServiceRow = {
  id: string;
  /** Display name, e.g. "Web & Software Development". */
  name: string;
  /** Italic kicker that pairs with the headline on the service detail. */
  italic: string;
  /** Bold one-liner under the kicker. */
  bold: string;
  /** One-paragraph blurb. */
  blurb: string;
  /** Featured = render with extra emphasis (used for the bundle). */
  featured?: boolean;
  /** Per-tier content per cadence. */
  monthly: Record<Tier, TierContent>;
  yearly: Record<Tier, TierContent>;
  /** Optional footer note for the service block (e.g. ad spend disclaimer). */
  footnote?: string;
};

/**
 * Yearly bullets reuse the monthly inclusions. We only swap the price.
 * Defining a tiny helper keeps the data clean while still letting
 * individual cells override bullets if a tier genuinely changes scope
 * between cadences.
 */
function yearlyOf(
  monthly: Record<Tier, TierContent>,
  prices: Record<Tier, Money>,
): Record<Tier, TierContent> {
  return {
    startup: { price: prices.startup, bullets: monthly.startup.bullets },
    growth: { price: prices.growth, bullets: monthly.growth.bullets },
    enterprise: {
      price: prices.enterprise,
      bullets: monthly.enterprise.bullets,
    },
  };
}

// --- Web ----------------------------------------------------------------
const webMonthly: Record<Tier, TierContent> = {
  startup: {
    price: { idr: "Rp 500k", usd: "$30" },
    bullets: [
      "Hosting + SSL",
      "Security patches",
      "Monthly backup",
      "1 content update",
    ],
  },
  growth: {
    price: { idr: "Rp 900k", usd: "$55" },
    bullets: [
      "Everything in Startup",
      "New section/page",
      "Basic analytics",
      "Quarterly speed audit",
    ],
  },
  enterprise: {
    price: { idr: "Rp 1,4jt", usd: "$90" },
    bullets: [
      "Everything in Growth",
      "A/B test setup",
      "Conversion optimization",
      "Custom integrations",
      "24-hr SLA hotfix",
    ],
  },
};

// --- Social -------------------------------------------------------------
const socialMonthly: Record<Tier, TierContent> = {
  startup: {
    price: { idr: "Rp 650k", usd: "$40" },
    bullets: [
      "1 platform (IG or LinkedIn)",
      "4 static posts/mo",
      "Caption writing",
      "Scheduling",
      "Monthly report",
    ],
  },
  growth: {
    price: { idr: "Rp 1,1jt", usd: "$70" },
    bullets: [
      "2 platforms",
      "10 static + 2 reels/mo",
      "3× stories/week",
      "Community management",
      "Hashtag refresh",
      "Monthly strategy call",
    ],
  },
  enterprise: {
    price: { idr: "Rp 1,5jt", usd: "$95" },
    bullets: [
      "3+ platforms",
      "20 static + 4 reels/mo",
      "Daily stories",
      "Paid amplification setup",
      "Influencer outreach",
      "Weekly strategy call",
    ],
  },
};

// --- AI -----------------------------------------------------------------
const aiMonthly: Record<Tier, TierContent> = {
  startup: {
    price: { idr: "Rp 750k", usd: "$45" },
    bullets: [
      "1 automation",
      "WhatsApp auto-reply or FAQ bot",
      "Basic monitoring",
      "1 LLM (Gemini Flash) included",
      "1 hr tweaks/mo",
    ],
  },
  growth: {
    price: { idr: "Rp 1,2jt", usd: "$75" },
    bullets: [
      "2 to 3 automations",
      "Lead scoring + CRM sync",
      "Content draft AI",
      "Dashboard",
      "Claude Haiku / GPT-4o-mini tier",
      "4 hrs tweaks/mo",
    ],
  },
  enterprise: {
    price: { idr: "Rp 1,7jt", usd: "$105" },
    bullets: [
      "5+ automations + custom agent",
      "Internal tools integration",
      "RAG / fine-tuning ready",
      "Claude Sonnet / GPT-4 tier",
      "A/B test automation logic",
      "Dedicated AI engineer",
    ],
  },
};

// --- Ads ----------------------------------------------------------------
const adsMonthly: Record<Tier, TierContent> = {
  startup: {
    price: { idr: "Rp 700k", usd: "$45" },
    bullets: [
      "1 platform (Meta or Google)",
      "Ad spend ≤ Rp 3M/mo",
      "2 creative variants",
      "Pixel + conversion setup",
      "Weekly WhatsApp check-in",
    ],
  },
  growth: {
    price: { idr: "Rp 1,1jt", usd: "$70" },
    bullets: [
      "2 platforms",
      "Ad spend ≤ Rp 15M/mo",
      "6 creatives + 1 video",
      "Landing-page optimization",
      "Audience research",
      "Monthly performance call",
    ],
  },
  enterprise: {
    price: { idr: "Rp 1,6jt", usd: "$100" },
    bullets: [
      "3+ platforms",
      "Ad spend ≤ Rp 40M/mo",
      "15+ creatives + weekly iteration",
      "Dedicated media buyer",
      "Attribution modeling",
      "Weekly strategy call",
    ],
  },
};

// --- Full Digital Marketing (the bundle) --------------------------------
const fullMonthly: Record<Tier, TierContent> = {
  startup: {
    price: { idr: "Rp 1,2jt", usd: "$75" },
    bullets: [
      "Web Startup",
      "Social Startup",
      "AI Startup",
      "Ads Startup",
      "Quarterly strategy review",
      "Shared PM",
    ],
  },
  growth: {
    price: { idr: "Rp 1,7jt", usd: "$105" },
    bullets: [
      "Web Growth",
      "Social Growth",
      "AI Growth",
      "Ads Growth",
      "Monthly strategy review",
      "Dedicated PM",
      "Bi-weekly reporting",
    ],
  },
  enterprise: {
    price: { idr: "Rp 2jt", usd: "$125" },
    bullets: [
      "Web Enterprise",
      "Social Enterprise",
      "AI Enterprise",
      "Ads Enterprise",
      "Weekly strategy review",
      "Dedicated PM + designer + dev + media buyer + AI engineer",
      "Weekly reporting",
    ],
  },
};

export const SERVICE_ROWS: ReadonlyArray<ServiceRow> = [
  {
    id: "web",
    name: "Web & Software Development",
    italic: "Built once,",
    bold: "made to last.",
    blurb:
      "Monthly retainer covers maintenance, content updates, security patches, and progressive iteration on the live site. New website builds are quoted separately as a one-time fee.",
    monthly: webMonthly,
    yearly: yearlyOf(webMonthly, {
      startup: { idr: "Rp 4jt", usd: "$250" },
      growth: { idr: "Rp 6,5jt", usd: "$405" },
      enterprise: { idr: "Rp 9jt", usd: "$560" },
    }),
    footnote: "New website build is a separate one-time fee (Rp 3jt to 25jt scoped).",
  },
  {
    id: "social",
    name: "Social Media Management",
    italic: "Show up.",
    bold: "Show why.",
    blurb:
      "End-to-end content production, scheduling, and community management. We don't post for the sake of posting. Every piece serves a thesis.",
    monthly: socialMonthly,
    yearly: yearlyOf(socialMonthly, {
      startup: { idr: "Rp 5,5jt", usd: "$345" },
      growth: { idr: "Rp 8jt", usd: "$500" },
      enterprise: { idr: "Rp 10jt", usd: "$625" },
    }),
  },
  {
    id: "ai",
    name: "AI Automation",
    italic: "Less manual,",
    bold: "more output.",
    blurb:
      "Build AI workflows that handle the repeatable work so your team can focus on the unrepeatable. WhatsApp chatbots, lead scoring, content drafting, internal Q&A bots, custom agents.",
    monthly: aiMonthly,
    yearly: yearlyOf(aiMonthly, {
      startup: { idr: "Rp 6jt", usd: "$375" },
      growth: { idr: "Rp 8,5jt", usd: "$530" },
      enterprise: { idr: "Rp 11jt", usd: "$690" },
    }),
  },
  {
    id: "ads",
    name: "Ads Management",
    italic: "Spend smarter,",
    bold: "not louder.",
    blurb:
      "Strategy, creative, and management for paid media across Meta, Google, TikTok, and LinkedIn. Management fee is separate from ad spend. You pay platforms directly.",
    monthly: adsMonthly,
    yearly: yearlyOf(adsMonthly, {
      startup: { idr: "Rp 6jt", usd: "$375" },
      growth: { idr: "Rp 8jt", usd: "$500" },
      enterprise: { idr: "Rp 10,5jt", usd: "$655" },
    }),
    footnote: "Ad spend is billed by the platform directly. Mgmt fee separate.",
  },
  {
    id: "full",
    name: "Full Digital Marketing",
    italic: "Everything,",
    bold: "one team.",
    blurb:
      "The bundle. Web + Social + AI + Ads under one roof, with one strategy, one PM, and one invoice. Up to ~29% off versus buying services individually.",
    featured: true,
    monthly: fullMonthly,
    yearly: yearlyOf(fullMonthly, {
      startup: { idr: "Rp 9jt", usd: "$560" },
      growth: { idr: "Rp 11jt", usd: "$690" },
      enterprise: { idr: "Rp 13jt", usd: "$810" },
    }),
  },
];

export const PRICING_NOTES: ReadonlyArray<{ label: string; body: string }> = [
  {
    label: "Commitment",
    body: "Monthly is 1 month, no lock-in. Yearly is paid upfront, with a pro-rata refund if cancelled mid-term.",
  },
  {
    label: "Onboarding",
    body: "Startup tier is free. Growth Rp 1M. Enterprise Rp 3M. One-time, covers brand/asset audit and system setup.",
  },
  {
    label: "Tax",
    body: "Indonesian VAT (PPN 11%) is not included in any of the prices above.",
  },
  {
    label: "Payment",
    body: "Monthly upfront via bank transfer. NET 7 invoice.",
  },
  {
    label: "Currency",
    body: "Prices switch to USD in English and IDR in Indonesian, at roughly Rp 16,000 to the dollar.",
  },
];

/**
 * Bundle savings copy shown beneath both tables. Computed mentally
 * once when the pricing structure was set. If prices change, update
 * here too.
 */
export const BUNDLE_SAVINGS = {
  startup: "~24%",
  growth: "~26%",
  enterprise: "~29%",
};

export const YEARLY_SAVINGS_RANGE = "30 to 46%";
