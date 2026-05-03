export type Project = {
  slug: string;
  title: string;
  client: string;
  category: string;
  year: string;
  description: string;
  cover: string;
  tags: string[];
};

export const PROJECTS: Project[] = [
  {
    slug: "lumen-studios",
    title: "Brand & Digital Platform",
    client: "Lumen Studios",
    category: "Web Development",
    year: "2025",
    description:
      "End-to-end digital platform for a contemporary photography studio — visual identity, web build, and CMS.",
    cover:
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1600&q=80",
    tags: ["Web", "Brand", "CMS"],
  },
  {
    slug: "northpeak-coffee",
    title: "Performance Marketing Engine",
    client: "Northpeak Coffee",
    category: "Paid Media",
    year: "2025",
    description:
      "Multi-channel ads across Meta, Google, and TikTok — driving 4.8x ROAS in the first quarter.",
    cover:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80",
    tags: ["Meta Ads", "Google Ads", "TikTok"],
  },
  {
    slug: "maison-aurelia",
    title: "Social-First Brand World",
    client: "Maison Aurélia",
    category: "Social Media",
    year: "2024",
    description:
      "Community-led content engine for a luxury hospitality brand. Grew engaged audience 6× in 8 months.",
    cover:
      "https://images.unsplash.com/photo-1503174971373-b1f69850bded?auto=format&fit=crop&w=1600&q=80",
    tags: ["Content", "Community", "Strategy"],
  },
  {
    slug: "atlas-ai",
    title: "Conversational AI Concierge",
    client: "Atlas Realty",
    category: "AI Systems",
    year: "2025",
    description:
      "Custom AI agent connected to listings, calendar, and CRM — qualifying leads 24/7.",
    cover:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1600&q=80",
    tags: ["AI Agent", "Automation", "CRM"],
  },
  {
    slug: "verde-wellness",
    title: "DTC Storefront & Funnel",
    client: "Verde Wellness",
    category: "Web + Paid Media",
    year: "2024",
    description:
      "Headless commerce build with full-funnel paid acquisition — launched at $0 to $180k MRR in 90 days.",
    cover:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=80",
    tags: ["E-commerce", "Funnel", "Ads"],
  },
  {
    slug: "kindred-fc",
    title: "Match-Day Content System",
    client: "Kindred FC",
    category: "Social Media",
    year: "2024",
    description:
      "Live content workflows for match days — 38M organic impressions across the season.",
    cover:
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1600&q=80",
    tags: ["Sports", "Live Content", "Reels"],
  },
];

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
  "LUMEN STUDIOS",
  "NORTHPEAK",
  "MAISON AURÉLIA",
  "ATLAS REALTY",
  "VERDE WELLNESS",
  "KINDRED FC",
  "ARCHE & CO",
  "OBSCURA",
  "FIELD NOTES",
  "HALCYON",
];
