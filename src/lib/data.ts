export type Project = {
  slug: string;
  title: string;
  client: string;
  category: string;
  year: string;
  description: string;
  cover: string;
  tags: string[];
  /** Live destination — domain for web projects, social URL for non-web. */
  url: string;
  /** Optional override for the CTA label. Defaults from `url` host. */
  urlLabel?: string;
  /** Disciplines applied (e.g. "Web Development", "Paid Media"). */
  services?: string[];
  /** Optional location label, e.g. "Bali, Indonesia". */
  location?: string;
  /** Bullet list of what we built / shipped. Rendered on the detail page. */
  scope?: string[];
  /** Optional 1–2 paragraph long-form intro. Rendered on the detail page. */
  longDescription?: string;
};

// Photos chosen for high-contrast, monochrome-friendly editorial feel.
// They render with grayscale + contrast filter; hover removes filter.
const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2000&q=90`;

export const PROJECTS: Project[] = [
  {
    slug: "great-bali-properties",
    title: "Real Estate Marketplace",
    client: "Great Bali Properties",
    category: "Web Development",
    year: "2025",
    description:
      "Multilingual marketplace for premium Bali villas and land — interactive map, advanced filters, currency-aware pricing, and WhatsApp-first agent routing. 50+ curated listings across eight locations, built for investors who buy on care, not volume.",
    cover: UNSPLASH("photo-1537996194471-e657df975ab4"),
    tags: ["Web", "Listings", "Multilingual"],
    url: "https://greatbaliproperties.com",
    urlLabel: "Visit site",
    services: ["Web Development"],
    location: "Bali, Indonesia",
    scope: [
      "Multilingual storefront (English / Bahasa Indonesia)",
      "Interactive Leaflet map with eight Bali locations",
      "Property filters by location, type, ownership",
      "Currency-aware pricing (IDR / USD)",
      "Direct-agent WhatsApp routing",
      "Featured carousel + property detail galleries",
    ],
    longDescription:
      "Great Bali Properties needed a digital surface that felt like an investment partner, not a broker. The previous site treated villas as inventory. This one positions them as curation. The marketplace lives across English and Bahasa, switches currency on demand, and routes serious buyers straight to the agent on WhatsApp — Bali's actual sales channel — instead of forcing a generic contact form.",
  },
];

/** Best-effort label for a project's live URL when none is provided. */
export function defaultUrlLabel(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
    if (host.includes("instagram.com")) return "View on Instagram";
    if (host.includes("tiktok.com")) return "Watch on TikTok";
    if (host.includes("linkedin.com")) return "View on LinkedIn";
    if (host.includes("twitter.com") || host.includes("x.com")) return "View on X";
    if (host.includes("facebook.com")) return "View on Facebook";
    if (host.includes("youtube.com")) return "Watch on YouTube";
    if (host.includes("behance.net")) return "View on Behance";
    if (host.includes("dribbble.com")) return "View on Dribbble";
    return "Visit site";
  } catch {
    return "Visit site";
  }
}

export type Service = {
  id: string;
  number: string;
  title: string;
  short: string;
  description: string;
  capabilities: string[];
};

export const SERVICES: Service[] = [
  {
    id: "web-development",
    number: "01",
    title: "Web Development",
    short: "Sites that move with intent.",
    description:
      "Custom websites and web apps built for performance, accessibility, and craft. From marketing sites to headless commerce.",
    capabilities: [
      "Next.js / React",
      "Headless CMS",
      "E-commerce (Shopify, custom)",
      "Design systems",
      "Motion & interaction",
      "SEO & Core Web Vitals",
    ],
  },
  {
    id: "paid-media",
    number: "02",
    title: "Paid Media",
    short: "Google, Meta, TikTok — ran like a system.",
    description:
      "Performance marketing across the channels that matter. Creative testing, audience architecture, and attribution that survives iOS.",
    capabilities: [
      "Google Ads (Search, PMax, YouTube)",
      "Meta Ads",
      "TikTok Ads",
      "Creative production",
      "Conversion tracking",
      "Reporting & optimisation",
    ],
  },
  {
    id: "social-media",
    number: "03",
    title: "Social Media",
    short: "Brands that show up — and stick.",
    description:
      "Strategy, content, and community for brands that want to be remembered. We make the feed feel like a place.",
    capabilities: [
      "Content strategy",
      "Production (photo / video / motion)",
      "Community management",
      "Influencer & partnerships",
      "Analytics & growth",
      "Always-on planning",
    ],
  },
  {
    id: "ai-systems",
    number: "04",
    title: "AI Systems",
    short: "AI that does the work — quietly.",
    description:
      "Custom AI agents and automations connected to your real tools. Built to remove busywork, not replace people.",
    capabilities: [
      "Conversational agents",
      "Workflow automation",
      "Lead qualification",
      "Internal tools",
      "RAG & knowledge bases",
      "Integrations (CRM, calendar, ops)",
    ],
  },
];

export const STATS = [
  { value: "120+", label: "Projects shipped" },
  { value: "4.8×", label: "Avg. ROAS uplift" },
  { value: "12", label: "Industries served" },
  { value: "9 yrs", label: "Combined craft" },
];

export const CLIENTS = [
  "GREAT BALI PROPERTIES",
];
