/**
 * Onyx Creative Asia, pricing source-of-truth.
 *
 * Fixed, published pricing. No cadence toggle, no currency toggle, every
 * price is a single IDR figure with its own billing unit (Web is yearly,
 * the rest are monthly retainers).
 *
 * Each tier renders the SAME ordered feature list so the three cards line
 * up as a comparison: a feature the tier includes is checklisted, a
 * feature it doesn't get is shown oblique (struck/dimmed). The Enterprise
 * tier includes everything, so it never shows an oblique row.
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

/** One row in a tier's feature list. */
export type Feature = {
  label: string;
  /** true = checklisted (included), false = oblique (not included). */
  included: boolean;
};

export type TierPlan = {
  /** Price in IDR (integer rupiah). */
  amount: number;
  features: ReadonlyArray<Feature>;
  /** "suitable if you need a ..." line shown under the feature list. */
  suitableFor: string;
};

export type ServiceRow = {
  id: string;
  /** Display name, e.g. "Web & Software Development". */
  name: string;
  /** Italic kicker. */
  italic: string;
  /** Bold one-liner that pairs with the kicker. */
  bold: string;
  /** One-paragraph blurb. */
  blurb: string;
  /** Billing unit for every tier of this service. */
  unit: "month" | "year";
  /** Small note shown right under each price (e.g. "ads budget excluded"). */
  priceNote?: string;
  /** Optional footer note for the whole service block. */
  footnote?: string;
  tiers: Record<Tier, TierPlan>;
};

/** Format an integer rupiah amount as "Rp 2.500.000". */
export function formatIDR(amount: number): string {
  return "Rp " + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Per-feature spec: the label this feature shows in each tier, or null
 * when the tier doesn't include it. When null, `off` is the label shown
 * oblique (struck/dimmed) so the comparison row still reads.
 */
type Spec = {
  startup: string | null;
  growth: string | null;
  enterprise: string | null;
  off: string;
};

function tiersFrom(
  specs: ReadonlyArray<Spec>,
  amounts: Record<Tier, number>,
  suitableFor: Record<Tier, string>,
): Record<Tier, TierPlan> {
  const featuresFor = (tier: Tier): Feature[] =>
    specs.map((s) => {
      const value = s[tier];
      return value
        ? { label: value, included: true }
        : { label: s.off, included: false };
    });

  return {
    startup: {
      amount: amounts.startup,
      features: featuresFor("startup"),
      suitableFor: suitableFor.startup,
    },
    growth: {
      amount: amounts.growth,
      features: featuresFor("growth"),
      suitableFor: suitableFor.growth,
    },
    enterprise: {
      amount: amounts.enterprise,
      features: featuresFor("enterprise"),
      suitableFor: suitableFor.enterprise,
    },
  };
}

// --- Web & Software Development (yearly) --------------------------------
const webSpecs: ReadonlyArray<Spec> = [
  {
    startup: "1-3 pages (for new website)",
    growth: "3-7 pages (for new website)",
    enterprise: "7-15 pages (for new website)",
    off: "",
  },
  { startup: "Domain (for new website)", growth: "Domain (for new website)", enterprise: "Domain (for new website)", off: "" },
  { startup: "Hosting (for new website)", growth: "Hosting (for new website)", enterprise: "Hosting (for new website)", off: "" },
  { startup: "Custom layout", growth: "Custom layout", enterprise: "Custom layout", off: "" },
  {
    startup: "Simple frontend (simple layout, no animation, no loader)",
    growth: "Advanced frontend (complex layout, dynamic animation, eye-catching loader)",
    enterprise: "Advanced frontend (complex layout, dynamic animation, eye-catching loader)",
    off: "",
  },
  {
    startup: "Simple backend (basic database, no webhook & API setup, no CMS)",
    growth: "Simple backend (basic database, no webhook & API setup, no CMS)",
    enterprise: "Advanced backend (complex database, webhook & API setup, CMS setup)",
    off: "",
  },
  { startup: "Security and SSL", growth: "Security and SSL", enterprise: "Security and SSL", off: "" },
  { startup: "Content management", growth: "Content management", enterprise: "Content management", off: "" },
  { startup: null, growth: "SEO setup", enterprise: "SEO setup", off: "SEO setup" },
  { startup: null, growth: "Monthly SEO report", enterprise: "Monthly SEO report", off: "Monthly SEO report" },
  { startup: null, growth: null, enterprise: "Google Analytics setup", off: "Google Analytics setup" },
  { startup: null, growth: null, enterprise: "Monthly Google Analytics report", off: "Monthly Google Analytics report" },
];

// --- Social Media Management (monthly) ----------------------------------
const socialSpecs: ReadonlyArray<Spec> = [
  {
    startup: "1 platform (Instagram / Facebook / TikTok)",
    growth: "2 platforms (Instagram / Facebook / TikTok)",
    enterprise: "All platforms (Instagram, Facebook, and TikTok)",
    off: "",
  },
  { startup: "Design and post 1 feed/week", growth: "Design and post 2 feeds/week", enterprise: "Design and post 3 feeds/week", off: "" },
  { startup: "Design and post 1 story/week", growth: "Design and post 3 stories/week", enterprise: "Design and post 5 stories/week", off: "" },
  { startup: "Edit and post 1 reel/week", growth: "Edit and post 2 reels/week", enterprise: "Edit and post 3 reels/week", off: "" },
  {
    startup: "Simple design (template-based, minimal graphics)",
    growth: "Advanced design (custom graphics, on-brand)",
    enterprise: "Advanced design (custom graphics, on-brand)",
    off: "",
  },
  {
    startup: "Simple editing (cut, text, transitions)",
    growth: "Advanced editing (cut, text, transitions, effects, sound design)",
    enterprise: "Advanced editing (cut, text, transitions, effects, sound design)",
    off: "",
  },
  { startup: "Simple copywriting", growth: "Advanced copywriting", enterprise: "Advanced copywriting", off: "" },
  { startup: "Monthly reporting", growth: "Monthly reporting", enterprise: "Monthly reporting", off: "" },
  { startup: null, growth: "Monthly content strategy", enterprise: "Monthly content strategy", off: "Monthly content strategy" },
  { startup: null, growth: "Trend and hashtag research", enterprise: "Trend and hashtag research", off: "Trend and hashtag research" },
  { startup: null, growth: null, enterprise: "Community management (comments and DMs)", off: "Community management (comments and DMs)" },
];

// --- AI Automation (monthly) --------------------------------------------
const aiSpecs: ReadonlyArray<Spec> = [
  { startup: "1 automation workflow", growth: "Up to 3 automation workflows", enterprise: "Unlimited automation workflows", off: "" },
  { startup: "Up to 2 app integrations", growth: "Up to 5 app integrations", enterprise: "Unlimited app integrations", off: "" },
  {
    startup: "Trigger-based automation (scheduled or event-driven)",
    growth: "Trigger-based automation (scheduled or event-driven)",
    enterprise: "Trigger-based automation (scheduled or event-driven)",
    off: "",
  },
  { startup: "Error monitoring and alerts", growth: "Error monitoring and alerts", enterprise: "Error monitoring and alerts", off: "" },
  { startup: "Monthly run reporting", growth: "Monthly run reporting", enterprise: "Monthly run reporting", off: "" },
  {
    startup: null,
    growth: "AI-assisted steps (classification, extraction, drafting)",
    enterprise: "AI-assisted steps (classification, extraction, drafting)",
    off: "AI-assisted steps (classification, extraction, drafting)",
  },
  {
    startup: null,
    growth: "Advanced logic (branching and conditionals)",
    enterprise: "Advanced logic (branching and conditionals)",
    off: "Advanced logic (branching and conditionals)",
  },
  { startup: null, growth: "Monthly optimization", enterprise: "Monthly optimization", off: "Monthly optimization" },
  { startup: null, growth: null, enterprise: "Custom AI agent (chatbot or internal assistant)", off: "Custom AI agent (chatbot or internal assistant)" },
  { startup: null, growth: null, enterprise: "Dedicated support", off: "Dedicated support" },
];

// --- Ads Management (monthly, ad spend excluded) ------------------------
const adsSpecs: ReadonlyArray<Spec> = [
  {
    startup: "1 platform (Google Ads / Meta Ads / TikTok Ads)",
    growth: "2 platforms (Google Ads / Meta Ads / TikTok Ads)",
    enterprise: "All platforms (Google Ads, Meta Ads, and TikTok Ads)",
    off: "",
  },
  { startup: "Ads audit", growth: "Ads audit", enterprise: "Ads audit", off: "" },
  { startup: "Ads optimization", growth: "Ads optimization", enterprise: "Ads optimization", off: "" },
  {
    startup: "Post 1 ad/month (10 days each)",
    growth: "Post 2 ads/month (10 days each)",
    enterprise: "Post 4 ads/month (7 days each)",
    off: "",
  },
  { startup: "Simple copywriting", growth: "Advanced copywriting", enterprise: "Advanced copywriting", off: "" },
  { startup: "Simple targeting", growth: "Simple targeting", enterprise: "Advanced targeting", off: "" },
  { startup: "Monthly result reporting", growth: "Monthly result reporting", enterprise: "Monthly result reporting", off: "" },
  { startup: null, growth: "Ads strategy", enterprise: "Ads strategy", off: "Ads strategy" },
  {
    startup: null,
    growth: "Monthly strategy reporting (for the upcoming month)",
    enterprise: "Monthly strategy reporting (for the upcoming month)",
    off: "Monthly strategy reporting (for the upcoming month)",
  },
];

export const SERVICE_ROWS: ReadonlyArray<ServiceRow> = [
  {
    id: "web",
    name: "Web & Software Development",
    italic: "Built once,",
    bold: "made to last.",
    blurb:
      "A yearly plan that builds your new website and keeps it running: pages, domain, hosting, security, and ongoing content management, all in.",
    unit: "year",
    tiers: tiersFrom(
      webSpecs,
      { startup: 2_500_000, growth: 3_600_000, enterprise: 5_100_000 },
      {
        startup:
          "Suitable if you need a simple landing page, company profile, website redesign, or website management.",
        growth:
          "Suitable if you need a portfolio site, a website with a simple reservation feature, or a site to showcase multiple services or products.",
        enterprise:
          "Suitable if you need an e-commerce website, a system with an advanced reservation or booking feature, or an admin panel to view and manage data.",
      },
    ),
  },
  {
    id: "social",
    name: "Social Media Management",
    italic: "Show up.",
    bold: "Show why.",
    blurb:
      "End-to-end content production, editing, and posting. We design, write, and ship the feeds, stories, and reels that keep your brand present.",
    unit: "month",
    tiers: tiersFrom(
      socialSpecs,
      { startup: 1_800_000, growth: 2_800_000, enterprise: 4_000_000 },
      {
        startup:
          "Suitable if you need a team that keeps your social media active and consistent.",
        growth:
          "Suitable if you need a team that grows your presence with a real content strategy, not just regular posting.",
        enterprise:
          "Suitable if you need a team that fully runs your social, from strategy and production to community management.",
      },
    ),
  },
  {
    id: "ai",
    name: "AI Automation",
    italic: "Less manual,",
    bold: "more output.",
    blurb:
      "Automation and AI agents that handle the repetitive, manual work in the background, from simple trigger-based workflows to custom AI agents.",
    unit: "month",
    tiers: tiersFrom(
      aiSpecs,
      { startup: 2_000_000, growth: 3_500_000, enterprise: 5_500_000 },
      {
        startup:
          "Suitable if you want to automate one repetitive task from start to finish.",
        growth:
          "Suitable if you want to automate several workflows and add AI to your day-to-day operations.",
        enterprise:
          "Suitable if you want custom AI agents and fully automated pipelines across your business.",
      },
    ),
  },
  {
    id: "ads",
    name: "Ads Management",
    italic: "Spend smarter,",
    bold: "not louder.",
    blurb:
      "Strategy, creative, and management for paid media across Google, Meta, and TikTok. The management fee is separate from your ad spend.",
    unit: "month",
    priceNote: "ads budget excluded",
    footnote:
      "Ad spend is billed by the platforms directly; the management fee is separate.",
    tiers: tiersFrom(
      adsSpecs,
      { startup: 1_500_000, growth: 2_600_000, enterprise: 3_800_000 },
      {
        startup:
          "Suitable if you need a team to look after, optimize, audit, and regularly post your ads.",
        growth:
          "Suitable if you need a team to set an ads strategy, post more ads regularly, and write stronger ad copy.",
        enterprise:
          "Suitable if you need a team that analyses thoroughly which ads worked and why, keeps your ads always running, and targets the right people more precisely.",
      },
    ),
  },
];

export const PRICING_NOTES: ReadonlyArray<{ label: string; body: string }> = [
  {
    label: "Billing",
    body: "Web & Software Development is billed per year. Social Media, Ads, and AI Automation are monthly retainers with no lock-in.",
  },
  {
    label: "Tax",
    body: "Indonesian VAT (PPN 11%) is not included in the prices above.",
  },
  {
    label: "Payment",
    body: "Paid upfront via bank transfer.",
  },
];
