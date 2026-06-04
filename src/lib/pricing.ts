/**
 * Onyx Creative Asia — pricing source-of-truth.
 *
 * The /pricing page renders directly off this file, and the same
 * structure mirrors the printed proposal at
 * design/marketing/pricing-proposal/. Keep both in sync — if you bump
 * a tier price here, update build.py there too.
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

export type TierContent = {
  /** Display price, e.g. "Rp 500k" / "Rp 4jt". */
  price: string;
  /** Inclusion bullets shown under the price. */
  bullets: ReadonlyArray<string>;
};

export type ServiceRow = {
  id: string;
  /** Display name, e.g. "Web Development". */
  name: string;
  /** Italic kicker that pairs with the headline on the service detail. */
  italic: string;
  /** Bold one-liner under the kicker. */
  bold: string;
  /** One-paragraph blurb. */
  blurb: string;
  /** Featured = render with extra emphasis (used for the bundle). */
  featured?: boolean;
  /** Per-tier × cadence content. */
  monthly: Record<Tier, TierContent>;
  yearly: Record<Tier, TierContent>;
  /** Optional footer note for the service block (e.g. ad spend disclaimer). */
  footnote?: string;
};

/**
 * Yearly bullets reuse the monthly inclusions. We only swap the price
 * (and add a hemat tag in the UI). Defining a tiny helper keeps the
 * data clean while still letting individual cells override bullets if
 * a tier genuinely changes scope between cadences.
 */
function yearlyOf(
  monthly: Record<Tier, TierContent>,
  prices: Record<Tier, string>,
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
    price: "Rp 500k",
    bullets: [
      "Hosting + SSL",
      "Security patches",
      "Monthly backup",
      "1 content update",
    ],
  },
  growth: {
    price: "Rp 900k",
    bullets: [
      "Everything in Startup",
      "New section/page",
      "Basic analytics",
      "Quarterly speed audit",
    ],
  },
  enterprise: {
    price: "Rp 1,4jt",
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
    price: "Rp 650k",
    bullets: [
      "1 platform (IG atau LinkedIn)",
      "4 static posts/bln",
      "Caption writing",
      "Scheduling",
      "Monthly report",
    ],
  },
  growth: {
    price: "Rp 1,1jt",
    bullets: [
      "2 platforms",
      "10 static + 2 reels/bln",
      "3× stories/week",
      "Community management",
      "Hashtag refresh",
      "Monthly strategy call",
    ],
  },
  enterprise: {
    price: "Rp 1,5jt",
    bullets: [
      "3+ platforms",
      "20 static + 4 reels/bln",
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
    price: "Rp 750k",
    bullets: [
      "1 automation",
      "WA auto-reply atau FAQ bot",
      "Basic monitoring",
      "1 LLM (Gemini Flash) termasuk",
      "1 jam tweaks/bln",
    ],
  },
  growth: {
    price: "Rp 1,2jt",
    bullets: [
      "2–3 automations",
      "Lead scoring + CRM sync",
      "Content draft AI",
      "Dashboard",
      "Claude Haiku / GPT-4o-mini tier",
      "4 jam tweaks/bln",
    ],
  },
  enterprise: {
    price: "Rp 1,7jt",
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
    price: "Rp 700k",
    bullets: [
      "1 platform (Meta atau Google)",
      "Ad spend ≤ Rp 3jt/bln",
      "2 creative variants",
      "Pixel + conversion setup",
      "Weekly WA check-in",
    ],
  },
  growth: {
    price: "Rp 1,1jt",
    bullets: [
      "2 platforms",
      "Ad spend ≤ Rp 15jt/bln",
      "6 creatives + 1 video",
      "Landing-page optimization",
      "Audience research",
      "Monthly performance call",
    ],
  },
  enterprise: {
    price: "Rp 1,6jt",
    bullets: [
      "3+ platforms",
      "Ad spend ≤ Rp 40jt/bln",
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
    price: "Rp 1,2jt",
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
    price: "Rp 1,7jt",
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
    price: "Rp 2jt",
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
    bold: "ships forever.",
    blurb:
      "Monthly retainer covers maintenance, content updates, security patches, and progressive iteration on the live site. New website builds are quoted separately as a one-time fee.",
    monthly: webMonthly,
    yearly: yearlyOf(webMonthly, {
      startup: "Rp 4jt",
      growth: "Rp 6,5jt",
      enterprise: "Rp 9jt",
    }),
    footnote: "New website build — separate one-time fee (Rp 3–25jt scoped).",
  },
  {
    id: "social",
    name: "Social Media Management",
    italic: "Show up.",
    bold: "Show why.",
    blurb:
      "End-to-end content production, scheduling, and community management. We don't post for the sake of posting — every piece serves a thesis.",
    monthly: socialMonthly,
    yearly: yearlyOf(socialMonthly, {
      startup: "Rp 5,5jt",
      growth: "Rp 8jt",
      enterprise: "Rp 10jt",
    }),
  },
  {
    id: "ai",
    name: "AI Automation",
    italic: "Less manual,",
    bold: "more output.",
    blurb:
      "Build AI workflows that handle the repeatable work so your team can focus on the unrepeatable. WA chatbots, lead scoring, content drafting, internal Q&A bots, custom agents.",
    monthly: aiMonthly,
    yearly: yearlyOf(aiMonthly, {
      startup: "Rp 6jt",
      growth: "Rp 8,5jt",
      enterprise: "Rp 11jt",
    }),
  },
  {
    id: "ads",
    name: "Ads Management",
    italic: "Spend smarter,",
    bold: "not louder.",
    blurb:
      "Strategy, creative, and management for paid media across Meta, Google, TikTok, and LinkedIn. Management fee separate from ad spend — you pay platforms directly.",
    monthly: adsMonthly,
    yearly: yearlyOf(adsMonthly, {
      startup: "Rp 6jt",
      growth: "Rp 8jt",
      enterprise: "Rp 10,5jt",
    }),
    footnote: "Ad spend dibayar langsung ke platform. Mgmt fee terpisah.",
  },
  {
    id: "full",
    name: "Full Digital Marketing",
    italic: "Everything,",
    bold: "one team.",
    blurb:
      "The bundle. Web + Social + AI + Ads under one roof, with one strategy, one PM, and one invoice. Up to ~29% off vs buying services individually.",
    featured: true,
    monthly: fullMonthly,
    yearly: yearlyOf(fullMonthly, {
      startup: "Rp 9jt",
      growth: "Rp 11jt",
      enterprise: "Rp 13jt",
    }),
  },
];

export const PRICING_NOTES: ReadonlyArray<{ label: string; body: string }> = [
  {
    label: "Commitment",
    body: "Monthly — 1 bulan, no lock-in. Yearly — bayar di muka, refund pro-rata kalau cancel di tengah.",
  },
  {
    label: "Onboarding",
    body: "Startup tier — FREE. Growth Rp 1jt. Enterprise Rp 3jt. One-time, covers brand/asset audit + system setup.",
  },
  {
    label: "Tax",
    body: "PPN 11% belum termasuk dalam semua harga.",
  },
  {
    label: "Payment",
    body: "Monthly upfront via transfer bank. Invoice NET 7.",
  },
  {
    label: "Currency",
    body: "USD pricing tersedia untuk client luar negeri (≈ ÷16.000).",
  },
];

/**
 * Bundle savings copy shown beneath both tables. Computed mentally
 * once when the pricing structure was set — if prices change, update
 * here too.
 */
export const BUNDLE_SAVINGS = {
  startup: "~24%",
  growth: "~26%",
  enterprise: "~29%",
};

export const YEARLY_SAVINGS_RANGE = "30–46%";
