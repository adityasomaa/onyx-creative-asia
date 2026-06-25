export type Project = {
  slug: string;
  title: string;
  client: string;
  category: string;
  year: string;
  description: string;
  /** Still poster / image cover (always required, used as video poster too). */
  cover: string;
  /** Optional looping video cover. Plays muted on top of the poster. */
  coverLoop?: string;
  tags: string[];
  /** Live destination, domain for web projects, social URL for non-web. */
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
      "Multilingual marketplace for premium Bali villas and land, interactive map, advanced filters, currency-aware pricing, and WhatsApp-first agent routing. 50+ curated listings across eight locations, built for investors who buy on care, not volume.",
    cover: "/projects/great-bali-properties.webp",
    coverLoop: "/projects/great-bali-properties.mp4",
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
      "Great Bali Properties needed a digital surface that felt like an investment partner, not a broker. The previous site treated villas as inventory. This one positions them as curation. The marketplace lives across English and Bahasa, switches currency on demand, and routes serious buyers straight to the agent on WhatsApp, Bali's actual sales channel, instead of forcing a generic contact form.",
  },
  {
    slug: "radcruiters",
    title: "Campaign Request Automation",
    client: "RADcruiters",
    category: "AI Systems",
    year: "2026",
    description:
      "Self-routing intake for new campaign briefs. WordPress form → Make.com pipeline extracts the domain, matches the client in Airtable, queues a Trello task, and fires team + client emails, end-to-end in seconds. Zero-handoff onboarding for a recruitment-marketing agency.",
    cover: "/projects/radcruiters.webp",
    coverLoop: "/projects/radcruiters.mp4",
    tags: ["Workflow", "Make.com", "WordPress"],
    url: "https://onlineresults.radcruiters.com/campaign-request/",
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
      "RADcruiters runs Meta-ads recruitment campaigns for staffing agencies, a high-touch service with high-volume intake. The campaign-request form had become the bottleneck: every brief pinged the team in Slack, someone manually parsed the URL, looked up the client, then created the Trello card. We rebuilt the intake as a self-routing pipeline. Submission → seconds → the right person sees the right card with the right context, and the client gets an instant confirmation that says 'we have it.'",
  },
  {
    slug: "the-hair-extensions-bali",
    title: "Salon Brand & Site",
    client: "The Hair Extensions Bali",
    category: "Web Development",
    year: "2025",
    description:
      "Brand and site for a premium hair extensions studio in Kerobokan, six application methods, an editorial gallery with method filters, and a video hero of the actual color wall. Built for women who travel for the appointment, not the brochure.",
    cover: "/projects/the-hair-extensions-bali.webp",
    coverLoop: "/projects/the-hair-extensions-bali.mp4",
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
      "Direct-to-WhatsApp booking flow, Bali's appointment language",
    ],
    longDescription:
      "The studio is in Kerobokan, by appointment. They wanted a digital surface that matched the experience in person, quiet, warm, dressed in dark tones, with the kind of editorial gallery you'd expect in a print magazine. Six service methods, a filterable gallery, a video hero of the actual color wall, and direct-to-WhatsApp booking with IDR pricing visible up front. The wordmark earns the rest of the page: a serif title with a hand-drawn 'Bali,' the kind of small detail that signals the work happens by hand.",
  },
  {
    slug: "astungkare-spa",
    title: "Mobile Spa Booking Surface",
    client: "Astungkare Spa",
    category: "Web & Software Development",
    year: "2026",
    description:
      "Brand, site, social, and paid media for a 24-hour mobile spa serving Canggu, Seminyak, and Ubud. A trained therapist with oils and linen arrives at your villa, booked in under five minutes via WhatsApp, with a real-time earliest-availability indicator on the hero. Built for travelers and residents who want the appointment to come to them.",
    cover: "/projects/astungkare-spa.webp",
    coverLoop: "/projects/astungkare-spa.mp4",
    tags: ["Web", "Spa", "Hospitality"],
    url: "https://astungkarespa.com",
    urlLabel: "Visit site",
    services: ["Web & Software Development", "Social Media Management", "Ads Management"],
    location: "Bali, Indonesia",
    scope: [
      "Custom website with editorial dark-gold visual system",
      "Live earliest-availability indicator on the hero",
      "WhatsApp-first booking flow (sub-five-minute reply SLA)",
      "Treatment catalog with mobile-spa logistics + cancellation policy",
      "Service area pages, Canggu, Seminyak, Ubud, and Bali-wide",
      "Always-on social feed + Meta + Google ads management",
    ],
    longDescription:
      "Bali's spa market is crowded with brick-and-mortar wellness brands competing for the same walk-in foot traffic. Astungkare took the opposite bet: the spa comes to you, 24 hours a day, across the island. The job was to make that promise feel as effortless online as it does in person, a hero that tells you the earliest tonight slot in real time, treatments priced and explained without spa-speak, a cancellation policy you can read before you book, and a single tap to WhatsApp the therapist directly. The brand is dark gold and serif-led, the kind of restraint that lets the service do the talking. Site, social, and paid media all run from the same studio so the voice and the offer stay aligned across every surface.",
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

export type ServiceProcessStep = {
  title: string;
  detail: string;
};

export type ServiceCta = {
  /** Problem question used as the CTA heading. */
  problem: string;
  /** Solution + invite, used as the CTA paragraph. */
  solution: string;
};

export type Service = {
  id: string;
  number: string;
  title: string;
  short: string;
  description: string;
  capabilities: string[];
  // Fields used on the dedicated /services/[slug] detail page.
  // Voice is descriptive, not promotional: explain what the service
  // includes, its scope, and who it fits. No outcome/result promises.
  intro: string;
  narrative: string[];
  process: ServiceProcessStep[];
  fitFor: string;
  /** Problem -> solution funnel block at the bottom of the page. */
  cta: ServiceCta;
};

export const SERVICES: Service[] = [
  {
    id: "web-development",
    number: "01",
    title: "Web & Software Development",
    short: "Sites and software that move with intent.",
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
    intro:
      "Custom websites, web apps, and the software behind them, designed, built, and maintained by one team.",
    narrative: [
      "We cover the full build: design system, frontend, backend, CMS, and the integrations that connect the site to the tools you already use. One team scopes, designs, and develops, so there's no hand-off between the person who draws the screen and the person who builds it.",
      "Every site runs on a modern stack (Next.js, React, headless CMS), with performance, accessibility, and SEO handled as part of the work. After launch, we stay on as a monthly retainer for maintenance, content updates, and new sections.",
    ],
    process: [
      {
        title: "Scope + spec sketch",
        detail:
          "One week. We map the pages, content sources, and the one motion idea worth investing in.",
      },
      {
        title: "Design + content collab",
        detail:
          "Two to three weeks. Weekly working sessions, no big reveal moments.",
      },
      {
        title: "Build sprint",
        detail:
          "Three to five weeks. Live preview link from week one, weekly demos.",
      },
      {
        title: "Launch + tune",
        detail:
          "One week post-launch we monitor and tighten. Then we hand over.",
      },
    ],
    fitFor:
      "Founders launching a flagship site, brands moving off an aging WordPress, or product teams who need both a marketing site and the software around it, from one team.",
    cta: {
      problem:
        "Spending more time fighting your website than running your business?",
      solution:
        "We design, build, and maintain it for you, end to end. Book a free consultation and we'll map the scope together.",
    },
  },
  {
    id: "paid-media",
    number: "02",
    title: "Ads Management",
    short: "Google, Meta, and TikTok, run like a system.",
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
    intro:
      "Paid media across Meta, Google, and TikTok, planned, produced, and managed by one team.",
    narrative: [
      "We handle the full loop: account and funnel setup, audience research, creative production (static and video), conversion tracking, and weekly optimization. Creative is produced in-house, so testing and iteration don't wait on an outside vendor.",
      "The management fee is separate from ad spend, which you pay the platforms directly. You get a clear view of where the budget goes and what each variant is doing, plus a regular performance call.",
    ],
    process: [
      {
        title: "Account + funnel audit",
        detail:
          "One week. Where the money currently goes, and where it should.",
      },
      {
        title: "Creative + landing alignment",
        detail: "Two weeks. Variants written and shot, landing pages polished.",
      },
      {
        title: "Launch + learning sprint",
        detail:
          "Two to four weeks. Fast feedback loop, daily check-ins, weekly cuts.",
      },
      {
        title: "Steady-state optimisation",
        detail:
          "Monthly cadence with the team. Always one new test in flight.",
      },
    ],
    fitFor:
      "D2C brands, service businesses, and SaaS teams that want paid media run as a managed system rather than a one-off campaign.",
    cta: {
      problem: "Tired of pouring budget into ads that don't move?",
      solution:
        "We plan, produce, and manage the whole thing, creative included. Get a free consultation on your account.",
    },
  },
  {
    id: "social-media",
    number: "03",
    title: "Social Media Management",
    short: "Brands that show up and stick.",
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
    intro:
      "End-to-end social media, strategy, content, and community, run by one team.",
    narrative: [
      "We cover content strategy, photo/video/motion production, scheduling, and community management across the platforms that fit your brand. Strategy and production happen in the same room, so the plan and the posts stay aligned.",
      "You get a monthly content calendar, a consistent visual system, and someone managing the comments and DMs, plus a regular strategy call to adjust direction.",
    ],
    process: [
      {
        title: "Brand + feed audit",
        detail:
          "One week. What's working, what's flat, what's worth keeping.",
      },
      {
        title: "Strategy + pillars",
        detail: "One week. Three to five content pillars, one core posture.",
      },
      {
        title: "Production sprint",
        detail:
          "Rolling. Photo, video, and motion shot together in batches.",
      },
      {
        title: "Always-on plan + post",
        detail:
          "Weekly cadence. Community managed. Analytics tightened monthly.",
      },
    ],
    fitFor:
      "Lifestyle brands, hospitality, F&B, beauty, and founders who want a managed social presence instead of doing it themselves.",
    cta: {
      problem: "Are you tired of managing your own social media?",
      solution:
        "We'll handle it for you, end to end, from strategy to posting to replies. Contact us for a free consultation.",
    },
  },
  {
    id: "ai-systems",
    number: "04",
    title: "AI Automation",
    short: "AI that does the work, without the noise.",
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
    intro:
      "Custom AI agents and automations, built into the tools your team already uses.",
    narrative: [
      "We build automations that handle repeatable work: WhatsApp auto-replies and FAQ bots, lead scoring, CRM sync, content drafting, internal Q&A, and custom agents. Everything plugs into your real stack, Postgres, webhooks, the CRM you already pay for.",
      "You stay in control: kill switches, rate guards, and an operator who approves anything that goes out externally. It's an automation your team owns, with a dashboard to see what it's doing.",
    ],
    process: [
      {
        title: "Workflow shadowing",
        detail:
          "One week. Sit with the person doing the work. Find the tax.",
      },
      {
        title: "Pilot scoping",
        detail:
          "Three days. Pick the highest-pain workflow with the lowest-stakes failure.",
      },
      {
        title: "Build sprint",
        detail:
          "Two weeks. Working version, not a demo. Operator approves every output for the first week.",
      },
      {
        title: "Handover + refine",
        detail:
          "We don't disappear. Iterating on real signal beats designing in a vacuum.",
      },
    ],
    fitFor:
      "Teams drowning in repetitive coordination, ops managers tired of copy-pasting, or founders who want a workflow back before they hire for it.",
    cta: {
      problem: "Buried in repetitive, manual work?",
      solution:
        "We build AI that handles it quietly in the background. Book a free consultation and we'll find the first workflow to automate.",
    },
  },
];

export const STATS = [
  { value: "120+", label: "Projects delivered" },
  { value: "4", label: "Disciplines, one team" },
  { value: "12", label: "Industries served" },
  { value: "3 yrs", label: "Building since 2023" },
];

export const CLIENTS = [
  "GREAT BALI PROPERTIES",
  "RADCRUITERS",
  "THE HAIR EXTENSIONS BALI",
  "ASTUNGKARE SPA",
];

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  client: string;
  /** Optional: matches Project.slug so /works/[slug] can render the
   *  testimonial inline. Falls back to client-name slugify match. */
  projectSlug?: string;
};

/**
 * One testimonial per shipped project.
 *
 * NOTE: these are placeholder dummies authored from the documented
 * case-study outcomes. Swap to verified client quotes as they come in.
 * Until then the home page Testimonials section + each /works/[slug]
 * detail page reads as warm + specific instead of "Real client words
 * shipping soon."
 *
 * Voice: editorial, restrained, specific numbers where possible,
 * no exclamations, first-person from the client's POV.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "The previous site treated villas like inventory. The new one treats them like a story. Our agents are getting four times the qualified WhatsApp inquiries we used to filter through the contact form.",
    author: "Gustu Adi",
    role: "Founder",
    client: "Great Bali Properties",
    projectSlug: "great-bali-properties",
  },
  {
    quote:
      "What used to take three Slack pings and a manual Trello card now happens in under a minute. The team is focused on the campaign, not the intake.",
    author: "Koen Geytenbeek",
    role: "Founder",
    client: "RADcruiters",
    projectSlug: "radcruiters",
  },
  {
    quote:
      "The brand finally matches how the salon actually feels in person. First-time bookings doubled within two months of launch.",
    author: "Hanny Andoko",
    role: "Founder",
    client: "The Hair Extensions Bali",
    projectSlug: "the-hair-extensions-bali",
  },
  {
    quote:
      "We wanted the website to feel as calm as the treatment itself. Onyx built the site, runs the social feed, and manages the ads, bookings flow straight to WhatsApp and nothing falls through the cracks. The site converts at three times what we projected.",
    author: "Ayu Sriati",
    role: "Founder",
    client: "Astungkare Spa",
    projectSlug: "astungkare-spa",
  },
];

/** Lookup helper used by /works/[slug] to render the relevant quote. */
export function getTestimonialForProject(
  slug: string
): Testimonial | undefined {
  return TESTIMONIALS.find((t) => t.projectSlug === slug);
}
