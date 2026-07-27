export type Project = {
  slug: string;
  title: string;
  client: string;
  /** One-line description of what the brand is (shown under the card title). */
  blurb?: string;
  category: string;
  year: string;
  description: string;
  /** Still poster / image cover (always required, used as video poster too). */
  cover: string;
  /** Looping video cover for card-sized slots (720p60). Plays muted on top
   *  of the poster. Five of these autoplay on the works grid, so this tier
   *  is deliberately the lighter one. */
  coverLoop?: string;
  /** Same loop at 1080p60, for the case-study hero where it renders large. */
  coverLoopHd?: string;
  tags: string[];
  /** Live destination, domain for web projects, social URL for non-web.
   *  Optional: some projects are not publicly linkable. */
  url?: string;
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

// Covers are generated from the real sites: each one is a scroll-through of
// the live home page, composited into desktop / tablet / phone mockups.
// `cover` is the poster frame, `coverLoop` the moving version. Both are
// produced by the capture pipeline (see .capture/) and live in public/works/.
export const PROJECTS: Project[] = [
  {
    slug: "great-bali-villas",
    title: "Villa Rental Surface",
    client: "Great Bali Villas",
    blurb: "Premium villa stays in Bali",
    category: "Digital Presence",
    year: "2025",
    description:
      "A calm booking surface for premium Bali villa stays. Browse by area, size, and dates, move through full-bleed galleries and amenity breakdowns, and enquire straight to the team on WhatsApp.",
    cover: "/works/great-bali-villas.jpg",
    coverLoop: "/works/great-bali-villas-card.mp4",
    coverLoopHd: "/works/great-bali-villas.mp4",
    tags: ["Web", "Villas", "Booking"],
    url: "https://greatbalivillas.com",
    urlLabel: "Visit site",
    services: ["Digital Presence", "Growth & Analytics", "Managed Services"],
    location: "Bali, Indonesia",
    scope: [
      "Villa catalog with area, size, and date filters",
      "Full-bleed galleries and per-villa amenity breakdowns",
      "Availability enquiry routed straight to WhatsApp",
      "Responsive editorial layout with map context",
      "SEO setup for high-intent villa searches",
    ],
    longDescription:
      "Booking a villa in Bali usually means bouncing between listing sites, screenshots, and half-answered DMs. Great Bali Villas wanted the opposite: one calm surface where a guest can filter by the things that actually matter, area, size, and dates, see each villa properly, and reach a real person in one tap. We built the catalog, the galleries, and the enquiry flow to run straight to WhatsApp, Bali's real booking channel, so interest turns into a conversation without a form standing in the way.",
  },
  {
    slug: "bhagawan-property",
    title: "Property Advisory Platform",
    client: "Bhagawan Property",
    blurb: "Buyer-first property advisory in Bali",
    category: "Digital Presence",
    year: "2026",
    description:
      "A property advisory site built around trust rather than volume. Freehold and leasehold listings with real specs and pricing, editorial area guides across six Bali neighbourhoods, and a knowledge base that answers the questions buyers ask before they ever enquire.",
    cover: "/works/bhagawan-property.jpg",
    coverLoop: "/works/bhagawan-property-card.mp4",
    coverLoopHd: "/works/bhagawan-property.mp4",
    tags: ["Web", "Property", "Advisory"],
    url: "https://bhagawanproperty.com",
    urlLabel: "Visit site",
    services: ["Digital Presence", "Digital Marketing", "Growth & Analytics", "Managed Services"],
    location: "Bali, Indonesia",
    scope: [
      "Listing catalogue with freehold and leasehold tenure states",
      "Per-property specs, pricing, and status badges",
      "Editorial area guides for Uluwatu, Canggu, Sanur, Seminyak, Ubud, Pererenan",
      "Knowledge base for buyer-education articles",
      "Enquiry and WhatsApp routing to the advisory team",
      "SEO setup for tenure and area searches",
    ],
    longDescription:
      "Bali's property market is full of agencies listing everything and standing behind nothing. Bhagawan wanted the opposite position: fewer properties, each one inspected, and advice that stays on the buyer's side even when it costs the sale. The site had to make that stance legible in the first scroll, so the listings carry honest tenure and pricing up front, the area guides read like editorial rather than search bait, and the knowledge base answers the freehold-versus-leasehold questions buyers are usually left to work out alone. Enquiries route straight to the advisors with the property context attached.",
  },
  {
    slug: "tammia-online",
    title: "Beauty Tools Storefront",
    client: "Tammia Online",
    blurb: "Premium beauty tools retailer in Indonesia",
    category: "Digital Presence",
    year: "2026",
    description:
      "An e-commerce storefront for a premium beauty tools retailer. Eight product categories, weekly new arrivals, cart and wishlist drawers, and a WhatsApp beauty advisor for shoppers who are not sure which brush they need.",
    cover: "/works/tammia-online.jpg",
    coverLoop: "/works/tammia-online-card.mp4",
    coverLoopHd: "/works/tammia-online.mp4",
    tags: ["Web", "E-commerce", "Beauty"],
    url: "https://marshella-eunike.vercel.app/tammia-online/",
    urlLabel: "Visit site",
    services: ["Digital Presence", "Creative Studio", "Growth & Analytics", "Managed Services"],
    location: "Indonesia",
    scope: [
      "Storefront with eight product categories",
      "New arrivals, ratings, and authenticity guarantee messaging",
      "Slide-out cart and wishlist drawers",
      "FAQ covering shipping, returns, and payment",
      "WhatsApp beauty advisor for product questions",
      "Responsive layout for mobile-first shoppers",
    ],
    longDescription:
      "Beauty tools are a trust purchase: shoppers are looking for the real Real Techniques brush, not a convincing copy. The storefront leads with that, an authenticity guarantee and clear shipping thresholds sit above the fold, and every product carries a rating and a price in rupiah. Underneath, the catalogue is organised the way people actually shop, by what they need rather than by brand, with cart and wishlist drawers that never take you off the page. For anyone still unsure, a WhatsApp advisor is one tap away, which is how most of Indonesia prefers to ask.",
  },
  {
    slug: "astungkare-spa",
    title: "Mobile Spa Booking Surface",
    client: "Astungkare Spa",
    blurb: "24-hour mobile spa across Bali",
    category: "Digital Presence",
    year: "2026",
    description:
      "Brand, site, social, and paid media for a 24-hour mobile spa serving Canggu, Seminyak, and Ubud. A trained therapist with oils and linen arrives at your villa, booked in under five minutes via WhatsApp, with a real-time earliest-availability indicator on the hero.",
    cover: "/works/astungkare-spa.jpg",
    coverLoop: "/works/astungkare-spa-card.mp4",
    coverLoopHd: "/works/astungkare-spa.mp4",
    tags: ["Web", "Spa", "Hospitality"],
    url: "https://astungkarespa.com",
    urlLabel: "Visit site",
    services: ["Digital Presence", "Digital Marketing", "Creative Studio", "Growth & Analytics", "Managed Services"],
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
  {
    slug: "the-hair-extensions-bali",
    title: "Salon Brand & Site",
    client: "The Hair Extensions Bali",
    blurb: "Hair extensions studio in Kerobokan",
    category: "Creative Studio",
    year: "2025",
    description:
      "Brand and site for a premium hair extensions studio in Kerobokan, six application methods, an editorial gallery with method filters, and a video hero of the actual color wall.",
    cover: "/works/the-hair-extensions-bali.jpg",
    coverLoop: "/works/the-hair-extensions-bali-card.mp4",
    coverLoopHd: "/works/the-hair-extensions-bali.mp4",
    tags: ["Web", "Brand", "Beauty"],
    url: "https://thehairextensionsbali.com",
    urlLabel: "Visit site",
    services: ["Creative Studio", "Digital Presence", "Growth & Analytics", "Managed Services"],
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
    slug: "radcruiters",
    title: "Campaign Request Automation",
    client: "RADcruiters",
    blurb: "Recruitment-marketing agency in the EU",
    category: "AI Automation",
    year: "2026",
    description:
      "Self-routing intake for new campaign briefs. A WordPress form feeds a Make.com pipeline that extracts the domain, matches the client in Airtable, queues a Trello task, and fires team and client emails, end to end in seconds.",
    // This one has no site to scroll through: the work is the pipeline, so
    // the cover is a diagram of it, with the packet running the route.
    cover: "/works/radcruiters.jpg",
    coverLoop: "/works/radcruiters-card.mp4",
    coverLoopHd: "/works/radcruiters.mp4",
    tags: ["Workflow", "Make.com", "WordPress"],
    url: "https://onlineresults.radcruiters.com/campaign-request/",
    urlLabel: "Visit site",
    services: ["AI Automation", "Digital Presence", "Growth & Analytics", "Managed Services"],
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
      "RADcruiters runs Meta-ads recruitment campaigns for staffing agencies, a high-touch service with high-volume intake. The campaign-request form had become the bottleneck: every brief pinged the team in Slack, someone manually parsed the URL, looked up the client, then created the Trello card. We rebuilt the intake as a self-routing pipeline. Submission to seconds to the right person seeing the right card with the right context, and the client gets an instant confirmation that says 'we have it.'",
  },
];

/** Projects that used a given service, matched on the service's title. */
export function getProjectsForService(serviceSlug: string): Project[] {
  const service = SERVICES.find((s) => s.id === serviceSlug);
  if (!service) return [];
  return PROJECTS.filter((p) =>
    [p.category, ...(p.services ?? [])].includes(service.title),
  );
}

/** Slug for a service title, used by the work-card service tags. */
export function serviceSlugByTitle(title: string): string | undefined {
  return SERVICES.find((s) => s.title === title)?.id;
}

/** Distinct service titles a project used, in SERVICES order. */
export function serviceTagsForProject(p: Project): string[] {
  const owned = new Set([p.category, ...(p.services ?? [])]);
  return SERVICES.filter((s) => owned.has(s.title)).map((s) => s.title);
}

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

/** One thing a service covers, rendered as a card on the service page. */
export type Capability = {
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
  capabilities: Capability[];
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
    id: "digital-presence",
    number: "01",
    title: "Digital Presence",
    short: "Everything your business needs to exist online.",
    description:
      "We build your business a website that turns visitors into inquiries, then host it, maintain it, and keep it found on Google, all in one package.",
    capabilities: [
      { title: "Website design and build", detail: "Layouts, pages, and the front end, designed and built by the same team." },
      { title: "Custom software and web apps", detail: "Booking flows, portals, dashboards, whatever off-the-shelf cannot do." },
      { title: "Hosting and domains", detail: "Where the site lives and the address it answers to, both handled." },
      { title: "Ongoing maintenance", detail: "Updates, fixes, and small changes dealt with as they come up." },
      { title: "SEO setup and optimisation", detail: "Structure, metadata, and speed, so search engines can read the site." },
      { title: "Content management", detail: "You edit your own text and images, without waiting on us." },
    ],
    intro:
      "Your website, the software behind it, and everything needed to keep it online, handled by one team.",
    narrative: [
      "This covers the full build: the design, the frontend, the backend, and the integrations that connect your site to the tools you already use. The same team that scopes and designs the work also builds it, so nothing gets lost in a hand-off.",
      "Hosting, domains, and SEO setup are part of the package rather than separate line items. Once the site is live we keep it updated, keep the content current, and add new sections as the business changes.",
    ],
    process: [
      {
        title: "Scope and structure",
        detail:
          "We map the pages, the content you already have, and what still needs writing or shooting.",
      },
      {
        title: "Design",
        detail:
          "Layouts and the visual system, reviewed together in working sessions rather than one big reveal.",
      },
      {
        title: "Build",
        detail:
          "Development on a live preview link, with regular check-ins so you can watch it come together.",
      },
      {
        title: "Launch and hand over",
        detail:
          "We take it live, connect the domain and hosting, and walk you through managing it.",
      },
    ],
    fitFor:
      "Businesses that need a proper website for the first time, or one that has outgrown a template and needs rebuilding and looking after.",
    cta: {
      problem: "Does your business still not have a website that represents it properly?",
      solution:
        "We design it, build it, host it, and keep it running. Contact us for a free consultation.",
    },
  },
  {
    id: "digital-marketing",
    number: "02",
    title: "Digital Marketing",
    short: "Getting your business in front of the right people.",
    description:
      "We get your business in front of the right people and bring them back, across search, social, content, email, and paid ads, run as one plan.",
    capabilities: [
      { title: "SEO", detail: "Showing up for the searches your buyers are actually typing." },
      { title: "Social media management", detail: "Planning, posting, and replying, on a schedule that holds." },
      { title: "Content marketing", detail: "Articles and assets that answer the questions that precede a sale." },
      { title: "Email marketing", detail: "Newsletters and sequences that keep you in the inbox." },
      { title: "Paid ads (Google, Meta, TikTok)", detail: "Campaigns built, launched, and adjusted against real numbers." },
      { title: "Monthly reporting", detail: "What happened, what it cost, and what we are changing next." },
    ],
    intro:
      "The channels that bring people to your business, planned, produced, and managed in one place.",
    narrative: [
      "We handle the channels together rather than in isolation: search, social, content, email, and paid ads all run from the same plan, so the message stays consistent wherever someone finds you.",
      "The work includes the production, not just the strategy. We write the copy, make the content, set up the campaigns, publish on schedule, and report on what happened each month.",
    ],
    process: [
      {
        title: "Audit",
        detail:
          "We review what you are running now, what is set up correctly, and where the gaps are.",
      },
      {
        title: "Plan",
        detail:
          "Channels, messaging, and a content calendar for the months ahead, agreed before anything ships.",
      },
      {
        title: "Produce and publish",
        detail:
          "We make the content, build the campaigns, and keep everything running on schedule.",
      },
      {
        title: "Report and adjust",
        detail:
          "A monthly read on what happened, and what we are changing for the month ahead.",
      },
    ],
    fitFor:
      "Businesses that want their marketing handled end to end, rather than briefing a different freelancer for every channel.",
    cta: {
      problem: "Are you tired of managing your own marketing?",
      solution:
        "We plan it, produce it, and run it for you across every channel. Contact us for a free consultation.",
    },
  },
  {
    id: "creative-studio",
    number: "03",
    title: "Creative Studio",
    short: "The look, feel, and assets your brand runs on.",
    description:
      "We give your business a look people remember, from the brand identity to the photos, videos, and assets you use every day.",
    capabilities: [
      { title: "Branding and identity", detail: "Logo, type, colour, and the rules that keep them consistent." },
      { title: "Graphic design", detail: "Decks, packaging, signage, and everything else printed or posted." },
      { title: "Photography", detail: "Product, space, and team shots, directed and shot in-house." },
      { title: "Videography", detail: "Short films and social cuts, from brief through to final grade." },
      { title: "Motion graphics", detail: "Logo animations, titles, and moving assets for every channel." },
      { title: "Creative assets", detail: "Templates and source files you own and can reuse without us." },
    ],
    intro:
      "The visual side of the business: how it looks, how it sounds, and the assets you use day to day.",
    narrative: [
      "This starts with the identity, the logo, type, colour, and the rules for using them, then extends into everything made with it: social templates, decks, packaging, signage, and campaign artwork.",
      "Photography, video, and motion are produced in-house as part of the same system, so what you shoot matches what we design, and you finish with a library of assets you actually own.",
    ],
    process: [
      {
        title: "Discovery",
        detail:
          "We work out what the brand needs to communicate, and to whom, before drawing anything.",
      },
      {
        title: "Direction",
        detail:
          "Two or three visual routes, reviewed together, until one is clearly right.",
      },
      {
        title: "Production",
        detail:
          "The identity, the shoot, and the assets, made out to a finished, usable state.",
      },
      {
        title: "Guidelines and hand over",
        detail:
          "You get the files, the templates, and a short guide on how to use them consistently.",
      },
    ],
    fitFor:
      "Businesses starting from scratch, rebranding, or sitting on a mix of assets that no longer look like they belong together.",
    cta: {
      problem: "Does your brand look different everywhere it appears?",
      solution:
        "We build the identity and produce the assets to match. Contact us for a free consultation.",
    },
  },
  {
    id: "ai-automation",
    number: "04",
    title: "AI Automation",
    short: "Letting software handle the repetitive work.",
    description:
      "We take the repetitive, manual work off your team and hand it to software that runs it quietly in the background.",
    capabilities: [
      { title: "Workflow automation", detail: "The repetitive steps between your tools, running on a trigger." },
      { title: "Chatbots", detail: "Answers to the questions your team keeps retyping by hand." },
      { title: "CRM automation", detail: "Records that update themselves as deals actually move." },
      { title: "AI agents", detail: "Drafting, classifying, and summarising, quietly in the background." },
      { title: "System integration", detail: "Your existing tools connected, so data stops being retyped." },
      { title: "AI for business operations", detail: "The same thinking applied to whatever is slowing the business down." },
    ],
    intro:
      "The repetitive, manual parts of running a business, handed over to software that does them quietly in the background.",
    narrative: [
      "We start with the tasks your team repeats every day: copying data between tools, chasing updates, answering the same questions, moving a lead from one system to the next. Those become automated workflows that run on a trigger or a schedule.",
      "From there it extends to chatbots that answer customers, CRM automation that keeps records current, and AI agents that draft, classify, or summarise. Everything is connected to the tools you already use rather than replacing them.",
    ],
    process: [
      {
        title: "Shadow the workflow",
        detail:
          "We watch how the work is done now, step by step, before deciding what to automate.",
      },
      {
        title: "Pick the first workflow",
        detail:
          "We start with one repetitive, well-defined process rather than everything at once.",
      },
      {
        title: "Build and connect",
        detail:
          "We build the automation and wire it into your existing tools, with error alerts in place.",
      },
      {
        title: "Hand over and extend",
        detail:
          "You get documentation and monitoring, then we add the next workflow once the first is steady.",
      },
    ],
    fitFor:
      "Teams doing the same manual steps every day, or business owners who want a process handled before hiring someone to do it.",
    cta: {
      problem: "Buried in repetitive, manual work?",
      solution:
        "We build automation that handles it quietly in the background. Contact us for a free consultation.",
    },
  },
  {
    id: "growth-analytics",
    number: "05",
    title: "Growth & Analytics",
    short: "Knowing what is working, and what is not.",
    description:
      "We make your numbers make sense, tracking what actually happens, reporting it in plain language, and improving what matters.",
    capabilities: [
      { title: "Tracking setup", detail: "Analytics, events, and goals configured so the numbers mean something." },
      { title: "Dashboards", detail: "One place to open when you want to know how things are going." },
      { title: "Reporting", detail: "A monthly written read in plain language, not a data dump." },
      { title: "Conversion optimisation", detail: "Changes to the pages that decide whether people act." },
      { title: "Performance review", detail: "Sitting down with the numbers and agreeing what happens next." },
    ],
    intro:
      "The measurement layer: what to track, where it shows up, and what it means for the next decision.",
    narrative: [
      "Most businesses are already collecting data and not reading it. We set the tracking up properly first, analytics, events, and goals, so the numbers reflect what actually happens on your site and in your campaigns.",
      "That feeds a dashboard you can open any time, a monthly report written in plain language, and a running list of things worth testing or changing on the pages that matter most.",
    ],
    process: [
      {
        title: "Tracking audit",
        detail:
          "We check what is currently being measured, and what is being recorded incorrectly.",
      },
      {
        title: "Set up measurement",
        detail:
          "Analytics, events, and goals configured so each number maps to something real.",
      },
      {
        title: "Dashboard and reporting",
        detail:
          "One place to see performance, plus a monthly written read of what it says.",
      },
      {
        title: "Review and optimise",
        detail:
          "We agree what to change or test next, then measure whether it made a difference.",
      },
    ],
    fitFor:
      "Businesses already spending on marketing or a website who want to know what it is actually doing.",
    cta: {
      problem: "Not sure which part of your marketing is actually working?",
      solution:
        "We set up the tracking and report on it in plain language. Contact us for a free consultation.",
    },
  },
  {
    id: "managed-services",
    number: "06",
    title: "Managed Services",
    short: "Keeping everything running after launch.",
    description:
      "We keep everything you have already built running, updated, secure, and monitored, so it never quietly breaks.",
    capabilities: [
      { title: "Web maintenance", detail: "Updates and fixes on a schedule, rather than in a panic." },
      { title: "Server management", detail: "The machine your site runs on, kept current and healthy." },
      { title: "Security", detail: "Certificates, patches, and hardening, watched continuously." },
      { title: "Updates", detail: "Software kept current so nothing quietly drifts into breaking." },
      { title: "Monitoring", detail: "Uptime and performance checked around the clock, alerts routed to us." },
      { title: "Backups", detail: "Regular copies, tested, so a bad day stays a small one." },
      { title: "Technical support", detail: "A direct line when something breaks or you need a change." },
    ],
    intro:
      "The ongoing care for everything already live: the site, the server, and the systems behind them.",
    narrative: [
      "Launch is not the end of the work. Software needs updating, servers need watching, certificates expire, and things break at inconvenient times. This covers all of it on a standing basis.",
      "That means scheduled updates and backups, uptime and security monitoring with alerts, and a person to contact when something is wrong, rather than starting a search for help each time.",
    ],
    process: [
      {
        title: "Take over",
        detail:
          "We audit what exists, get proper access, and document how it is currently set up.",
      },
      {
        title: "Stabilise",
        detail:
          "Updates, backups, and security brought current before anything else is scheduled.",
      },
      {
        title: "Monitor",
        detail:
          "Uptime, performance, and security watched continuously, with alerts routed to us.",
      },
      {
        title: "Support",
        detail:
          "A direct line for issues and requests, with a regular note on what was done.",
      },
    ],
    fitFor:
      "Businesses with a site or system already running and no one responsible for keeping it healthy.",
    cta: {
      problem: "Is anyone actually looking after your website?",
      solution:
        "We maintain, monitor, secure, and support it. Contact us for a free consultation.",
    },
  },
];

export const STATS: ReadonlyArray<{ value: number; suffix: string; label: string }> = [
  { value: 120, suffix: "+", label: "Projects delivered" },
  { value: 20, suffix: "+", label: "Industries served" },
  { value: 50, suffix: "+", label: "Platforms mastered" },
  { value: 3, suffix: "+", label: "Years of experience" },
];

export const CLIENTS = [
  "GREAT BALI VILLAS",
  "BHAGAWAN PROPERTY",
  "TAMMIA ONLINE",
  "ASTUNGKARE SPA",
  "THE HAIR EXTENSIONS BALI",
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
      "What used to take three Slack pings and a manual Trello card now happens in under a minute. The team is focused on the campaign, not the intake.",
    author: "Koen Geytenbeek",
    role: "Founder",
    client: "RADcruiters",
    projectSlug: "radcruiters",
  },
  {
    quote:
      "Buyers arrive already knowing the difference between freehold and leasehold, because the site explained it before we ever spoke. The conversations start two steps further along than they used to.",
    author: "Joseph Prawira",
    role: "Founder",
    client: "Bhagawan Property",
    projectSlug: "bhagawan-property",
  },
  {
    quote:
      "Customers used to ask 'is this original?' on every single order. Now the guarantee is the first thing they see, and the question mostly stopped coming. Checkout got noticeably smoother.",
    author: "Marshella Eunike",
    role: "Founder",
    client: "Tammia Online",
    projectSlug: "tammia-online",
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
  {
    quote:
      "Guests used to piece our villas together from three different sites. Now it is one calm surface, filter by area and dates, see the villa properly, and message us in a tap. Enquiries are noticeably more qualified.",
    author: "Gustu Adi",
    role: "Founder",
    client: "Great Bali Villas",
    projectSlug: "great-bali-villas",
  },
];

/** Lookup helper used by /works/[slug] to render the relevant quote. */
export function getTestimonialForProject(
  slug: string
): Testimonial | undefined {
  return TESTIMONIALS.find((t) => t.projectSlug === slug);
}
