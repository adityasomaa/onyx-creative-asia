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
    cover: "/projects/great-bali-properties.webp",
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
  {
    slug: "radcruiters",
    title: "Campaign Request Automation",
    client: "RADcruiters",
    category: "AI Systems",
    year: "2026",
    description:
      "Self-routing intake for new campaign briefs. WordPress form → Make.com pipeline extracts the domain, matches the client in Airtable, queues a Trello task, and fires team + client emails — end-to-end in seconds. Zero-handoff onboarding for a recruitment-marketing agency.",
    cover: "/projects/radcruiters.webp",
    tags: ["Workflow", "Make.com", "WordPress"],
    url: "https://radcruiters.com",
    urlLabel: "Visit site",
    services: ["AI Systems", "Web Development"],
    location: "Netherlands · EU",
    scope: [
      "WordPress intake form for client campaign briefs",
      "Make.com pipeline (custom webhook → Trello → Airtable → Gmail)",
      "Domain extraction + client matching from vacancy URL",
      "Auto-create Trello task with full brief data",
      "Team notification + client confirmation email",
      "Always-on with execution history and error monitoring",
    ],
    longDescription:
      "RADcruiters runs Meta-ads recruitment campaigns for staffing agencies — a high-touch service with high-volume intake. The campaign-request form had become the bottleneck: every brief pinged the team in Slack, someone manually parsed the URL, looked up the client, then created the Trello card. We rebuilt the intake as a self-routing pipeline. Submission → seconds → the right person sees the right card with the right context, and the client gets an instant confirmation that says 'we have it.'",
  },
  {
    slug: "the-hair-extensions-bali",
    title: "Salon Brand & Site",
    client: "The Hair Extensions Bali",
    category: "Web Development",
    year: "2025",
    description:
      "Brand and site for a premium hair extensions studio in Kerobokan — six application methods, an editorial gallery with method filters, and a video hero of the actual color wall. Built for women who travel for the appointment, not the brochure.",
    cover: "/projects/the-hair-extensions-bali.webp",
    tags: ["Web", "Brand", "Beauty"],
    url: "https://thehairextensionsbali.com",
    urlLabel: "Visit site",
    services: ["Web Development", "Brand"],
    location: "Kerobokan, Bali",
    scope: [
      "Wordmark: serif 'HAIR EXTENSIONS' + hand-drawn 'Bali'",
      "Multi-page site (Home / Products / Tips / Gallery / Book)",
      "Video hero showcasing the studio color wall",
      "Gallery with method filters (transformations / products & color / studio)",
      "Six service methods with detail and IDR pricing",
      "Direct-to-WhatsApp booking flow — Bali's appointment language",
    ],
    longDescription:
      "The studio is in Kerobokan, by appointment. They wanted a digital surface that matched the experience in person — quiet, warm, dressed in dark tones, with the kind of editorial gallery you'd expect in a print magazine, not in the average beauty-salon site. Six service methods, a filterable gallery, a video hero of the actual color wall, and direct-to-WhatsApp booking with IDR pricing visible up front. The wordmark earns the rest of the page: a serif title with a hand-drawn 'Bali,' the kind of small detail that signals the work happens by hand.",
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
  "RADCRUITERS",
  "THE HAIR EXTENSIONS BALI",
];

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  client: string;
};

/**
 * Real client words go here — never invent. Empty-state component renders
 * a quiet placeholder until at least one testimonial is added.
 */
export const TESTIMONIALS: Testimonial[] = [];
