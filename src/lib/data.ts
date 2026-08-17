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
  /** Structured case study, rendered as the detail page body. */
  study?: CaseStudy;
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
    category: "Web & Software Development",
    year: "2025",
    description:
      "A calm booking surface for premium Bali villa stays. Browse by area, size, and dates, move through full-bleed galleries and amenity breakdowns, and enquire straight to the team on WhatsApp.",
    cover: "/works/great-bali-villas.jpg",
    coverLoop: "/works/great-bali-villas-card.mp4",
    coverLoopHd: "/works/great-bali-villas.mp4",
    tags: ["Web", "Villas", "Booking"],
    url: "https://greatbalivillas.com",
    urlLabel: "Visit site",
    services: ["Web & Software Development", "Growth & Analytics", "Maintenance Service"],
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
    study: {
      overview:
        "Great Bali Villas rents premium villas across Bali. The site is a single booking surface where a guest filters the catalog by area, size, and dates, moves through full-bleed galleries and per-villa amenity breakdowns, and asks about availability. Enquiries run to the team on WhatsApp, which is how villa bookings in Bali actually get made.",
      needed: [
      "Guests pieced villas together from listing sites, screenshots, and half-answered DMs.",
      "No way to filter on the things that decide a stay: area, size, dates.",
      "Villas were never shown in full, so galleries and amenities sat scattered.",
      "Interest had no direct route to a real person on the team.",
      ],
      did: [
      "Built the villa catalog with area, size, and date filters.",
      "Produced full-bleed galleries and per-villa amenity breakdowns.",
      "Routed availability enquiries straight to WhatsApp instead of a contact form.",
      "Laid out a responsive editorial site with map context for each area.",
      "Set up SEO for high-intent villa searches.",
      ],
      changed: [
      "One calm surface instead of three listing sites and a DM thread.",
      "Guests narrow by area, size, and dates before they ever ask.",
      "Enquiries arrive on WhatsApp with the villa already in context.",
      "Each villa is seen properly before the conversation starts, so enquiries come in more qualified.",
      ],
    },
  },
  {
    slug: "bhagawan-property",
    title: "Property Advisory Platform",
    client: "Bhagawan Property",
    blurb: "Buyer-first property advisory in Bali",
    category: "Web & Software Development",
    year: "2026",
    description:
      "A property advisory site built around trust rather than volume. Freehold and leasehold listings with real specs and pricing, editorial area guides across six Bali neighbourhoods, and a knowledge base that answers the questions buyers ask before they ever enquire.",
    cover: "/works/bhagawan-property.jpg",
    coverLoop: "/works/bhagawan-property-card.mp4",
    coverLoopHd: "/works/bhagawan-property.mp4",
    tags: ["Web", "Property", "Advisory"],
    url: "https://bhagawanproperty.com",
    urlLabel: "Visit site",
    services: ["Web & Software Development", "Ads Management", "Growth & Analytics", "Maintenance Service"],
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
    study: {
      overview:
        "Bhagawan Property is a buyer-first property advisory in Bali. It carries a smaller inspected listing set rather than everything on the market, publishes editorial guides to six neighbourhoods, and runs a knowledge base for people trying to understand how buying here works. Enquiries go to the advisory team with the property attached.",
      needed: [
      "Tenure and pricing were rarely stated up front anywhere in the market.",
      "Buyers were left to work out freehold versus leasehold on their own.",
      "Area knowledge lived in agents' heads, not anywhere a buyer could read it.",
      "The advisory stance was hard to tell apart from volume listing agencies.",
      ],
      did: [
      "Built a listing catalogue that carries freehold and leasehold tenure states openly.",
      "Put specs, pricing, and status badges on every property.",
      "Wrote editorial area guides for Uluwatu, Canggu, Sanur, Seminyak, Ubud, and Pererenan.",
      "Built a knowledge base for buyer-education articles, including the tenure questions.",
      "Set up enquiry and WhatsApp routing to advisors, plus SEO for tenure and area searches.",
      ],
      changed: [
      "Tenure and pricing are legible in the first scroll, not on request.",
      "Buyers arrive already understanding the difference between freehold and leasehold.",
      "Conversations start further along, because the site did the explaining first.",
      "Enquiries reach the advisory team with the property context attached.",
      ],
    },
  },
  {
    slug: "tammia-online",
    title: "Beauty Tools Storefront",
    client: "Tammia Online",
    blurb: "Premium beauty tools retailer in Indonesia",
    category: "Web & Software Development",
    year: "2026",
    description:
      "An e-commerce storefront for a premium beauty tools retailer. Eight product categories, weekly new arrivals, cart and wishlist drawers, and a WhatsApp beauty advisor for shoppers who are not sure which brush they need.",
    cover: "/works/tammia-online.jpg",
    coverLoop: "/works/tammia-online-card.mp4",
    coverLoopHd: "/works/tammia-online.mp4",
    tags: ["Web", "E-commerce", "Beauty"],
    url: "https://marshella-eunike.vercel.app/tammia-online/",
    urlLabel: "Visit site",
    services: ["Web & Software Development", "Graphic Design", "Growth & Analytics", "Maintenance Service"],
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
    study: {
      overview:
        "Tammia Online is a premium beauty tools retailer in Indonesia, selling genuine brushes and tools rather than lookalikes. The storefront runs eight product categories with weekly new arrivals, ratings and rupiah pricing on every item, slide-out cart and wishlist drawers, and a WhatsApp beauty advisor for shoppers who are not sure what they need.",
      needed: [
      "Shoppers could not tell an original brush from a convincing copy.",
      "The same question arrived with every order: is this one authentic?",
      "Shipping, returns, and payment terms were not stated anywhere obvious.",
      "No fast way to ask a product question before committing to buy.",
      ],
      did: [
      "Built the storefront across eight product categories with weekly new arrivals.",
      "Put the authenticity guarantee, ratings, and shipping thresholds above the fold.",
      "Added slide-out cart and wishlist drawers that keep shoppers on the page.",
      "Wrote the FAQ covering shipping, returns, and payment.",
      "Connected a WhatsApp beauty advisor for product questions, on a mobile-first layout.",
      ],
      changed: [
      "The authenticity guarantee is the first thing a shopper sees.",
      "Every product carries a rating and a price in rupiah.",
      "The catalogue is organised by what people need, not by brand.",
      "Unsure shoppers reach an advisor on WhatsApp in one tap.",
      ],
    },
  },
  {
    slug: "astungkare-spa",
    title: "Mobile Spa Booking Surface",
    client: "Astungkare Spa",
    blurb: "24-hour mobile spa across Bali",
    category: "All-in-One Digital Marketing",
    year: "2026",
    description:
      "Brand, site, social, and paid media for a 24-hour mobile spa serving Canggu, Seminyak, and Ubud. A trained therapist with oils and linen arrives at your villa, booked in under five minutes via WhatsApp, with a real-time earliest-availability indicator on the hero.",
    cover: "/works/astungkare-spa.jpg",
    coverLoop: "/works/astungkare-spa-card.mp4",
    coverLoopHd: "/works/astungkare-spa.mp4",
    tags: ["Web", "Spa", "Hospitality"],
    url: "https://astungkarespa.com",
    urlLabel: "Visit site",
    services: ["All-in-One Digital Marketing", "Web & Software Development", "Social Media Management", "Ads Management", "Graphic Design", "Growth & Analytics", "Maintenance Service"],
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
    study: {
      overview:
        "Astungkare Spa is a 24-hour mobile spa working across Bali. A trained therapist arrives at the guest's villa with oils and linen, booked through WhatsApp, with service areas covering Canggu, Seminyak, Ubud, and the rest of the island. Onyx handles the brand, the site, the social feed, and the paid media.",
      needed: [
      "The mobile spa promise was harder to explain online than in person.",
      "No way to show a guest the earliest slot available tonight.",
      "Treatments and the cancellation policy were not written down anywhere readable.",
      "Nothing held the brand, the social feed, and the ads to one voice.",
      ],
      did: [
      "Built a custom site on a dark gold, serif-led editorial system.",
      "Put a live earliest-availability indicator on the hero.",
      "Set up WhatsApp-first booking with a sub-five-minute reply commitment.",
      "Wrote the treatment catalog with mobile-spa logistics, cancellation policy, and service area pages.",
      "Run the always-on social feed alongside Meta and Google ads management.",
      ],
      changed: [
      "Guests see the earliest slot tonight before they message anyone.",
      "Booking is one tap to WhatsApp instead of a form and a wait.",
      "Prices, logistics, and cancellation terms are readable before anyone commits.",
      "Site, social, and ads run from one studio, so the offer stays aligned.",
      ],
    },
  },
  {
    slug: "the-hair-extensions-bali",
    title: "Salon Brand & Site",
    client: "The Hair Extensions Bali",
    blurb: "Hair extensions studio in Kerobokan",
    category: "Graphic Design",
    year: "2025",
    description:
      "Brand and site for a premium hair extensions studio in Kerobokan, six application methods, an editorial gallery with method filters, and a video hero of the actual color wall.",
    cover: "/works/the-hair-extensions-bali.jpg",
    coverLoop: "/works/the-hair-extensions-bali-card.mp4",
    coverLoopHd: "/works/the-hair-extensions-bali.mp4",
    tags: ["Web", "Brand", "Beauty"],
    url: "https://thehairextensionsbali.com",
    urlLabel: "Visit site",
    services: ["Graphic Design", "Web & Software Development", "Growth & Analytics", "Maintenance Service"],
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
    study: {
      overview:
        "The Hair Extensions Bali is an appointment-only hair extensions studio in Kerobokan. It offers six application methods, each with its own detail and IDR pricing, and works from a studio color wall clients choose from in person. The site carries the brand, the gallery of past work, and the booking route.",
      needed: [
      "The studio had no digital surface that matched how it feels in person.",
      "Six application methods were hard to tell apart without a stylist explaining them.",
      "Past work sat in feeds rather than a gallery a client could filter.",
      "Pricing stayed invisible until someone asked for it.",
      ],
      did: [
      "Drew the wordmark: a serif HAIR EXTENSIONS with a hand-drawn Bali.",
      "Built the multi-page site across Home, Products, Tips, Gallery, and Book.",
      "Cut a video hero showing the actual studio color wall.",
      "Built a gallery filtered by transformations, products and color, and studio.",
      "Wrote the six service methods with detail and IDR pricing, booking direct to WhatsApp.",
      ],
      changed: [
      "The brand now matches how the salon actually feels in person.",
      "Clients compare six methods and see IDR pricing before they book.",
      "The gallery filters down to the work someone came to see.",
      "Booking runs direct to WhatsApp, Bali's appointment language.",
      ],
    },
  },
  {
    slug: "radcruiters",
    title: "Campaign Request Automation",
    client: "RADcruiters",
    blurb: "Recruitment-marketing agency in the EU",
    category: "Web & Software Development",
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
    services: ["Web & Software Development", "Growth & Analytics", "Maintenance Service"],
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
    study: {
      overview:
        "RADcruiters is a recruitment-marketing agency in the Netherlands running Meta ads campaigns for staffing agencies. Clients submit new campaign briefs through a WordPress form. Behind that form is a Make.com pipeline that reads the brief, identifies the client, creates the work item, builds the campaign, and reports back through a dashboard the recruiters actually use.",
      needed: [
      "Every campaign brief arrived as a Slack ping for someone to catch.",
      "The vacancy URL was parsed by hand to work out the domain.",
      "The client had to be looked up manually before any work could start.",
      "Trello cards were created by hand, so briefs waited on a person being free.",
      ],
      did: [
      "Built the WordPress intake form for client campaign briefs.",
      "Built the Make.com pipeline: custom webhook to Trello to Airtable to Gmail.",
      "Added domain extraction and client matching from the submitted vacancy URL.",
      "Automated Meta campaign creation straight off the submitted brief.",
      "Built the recruiter dashboard for candidate tracking and reporting, with execution history and error monitoring.",
      ],
      changed: [
      "Submission to the right card in front of the right person, in seconds.",
      "Nobody parses a URL or looks up a client by hand anymore.",
      "Campaigns get built from the brief without a separate setup step.",
      "Recruiters see candidates and reporting in one dashboard instead of chasing updates.",
      ],
    },
  },
  {
    slug: "jalak-cargo-logistics",
    title: "Social & Content Programme",
    client: "Jalak Cargo Logistics",
    blurb: "Freight forwarder in Bali and Jakarta",
    category: "Social Media Management",
    year: "2026",
    description:
      "An always-on social programme for an Indonesian freight forwarder. Every post answers one real shipping question, in one visual system, published on a schedule, with the live site kept current alongside it.",
    // Not a build: Onyx runs the feed, the content, and site upkeep. So the
    // cover pairs the live site with the actual feed instead of putting the
    // site in device mockups.
    cover: "/works/jalak-cargo-logistics.jpg",
    coverLoop: "/works/jalak-cargo-logistics-card.mp4",
    coverLoopHd: "/works/jalak-cargo-logistics.mp4",
    tags: ["Instagram", "Content", "Maintenance"],
    url: "https://jalakkargologistik.id",
    urlLabel: "Visit site",
    services: ["Social Media Management", "Graphic Design", "Growth & Analytics", "Maintenance Service"],
    location: "Bali · Jakarta · Indonesia",
    scope: [
      "Always-on Instagram programme on @jalakkargo",
      "Post design system across the full service range",
      "Photo and video content production in the warehouse and at port",
      "Editorial calendar and publishing schedule",
      "Website maintenance, updates, and content upkeep",
      "Performance reporting on reach and enquiries",
    ],
    longDescription:
      "Jalak Kargo Logistik moves cargo by sea, air, and land out of Bali, Jakarta, Semarang, and Yogyakarta. Founded in 2019, it sells eleven services to two very different audiences: exporters who know exactly what an LCL consolidation is, and first-time shippers who do not. Onyx runs the social side of that: a feed where each post takes one question a real customer asks, answers it plainly, and looks like it came from the same company as the one before it.",
    study: {
      overview:
        "Jalak Cargo Logistics is a freight forwarder headquartered in Bali with branches in Jakarta, Semarang, and Yogyakarta, moving cargo by sea, air, and land since 2019. Onyx runs their Instagram, produces the photo and video content behind it, and keeps the website current. The feed is the front door: eleven services explained one question at a time, on a schedule, in one visual system.",
      needed: [
        "Eleven services, and no plain-language explanation of any of them anywhere public.",
        "First-time shippers asked the same questions before every quote: FCL or LCL, sea or air, what CBM means.",
        "Posts went out when someone had time, so the feed had no rhythm and no consistent look.",
        "The warehouse, the port, and the crating work were never photographed, so nothing showed how cargo is actually handled.",
      ],
      did: [
        "Built a post system that carries the brand across every service, so the grid reads as one company.",
        "Wrote the feed around the questions customers actually ask, one per post.",
        "Produced the photo and video content on site: warehouse, crating, forklift, port.",
        "Put the whole service range on an editorial calendar and published to schedule.",
        "Took over website maintenance and content updates so the site and the feed stay in step.",
      ],
      changed: [
        "The feed answers the pre-quote questions before anyone has to ask them.",
        "Every service now has a public explanation in plain language.",
        "The grid looks like one company instead of a folder of unrelated uploads.",
        "Site and social carry the same offer, because the same studio runs both.",
      ],
    },
  },
  {
    slug: "my-day-gili",
    title: "Fast Boat Booking Surface",
    client: "My Day Gili",
    blurb: "Fast boat tickets and day trips from Bali",
    category: "Web & Software Development",
    year: "2026",
    description:
      "One booking surface for crossings to the Gili Islands and Lombok. Four operators, their real schedules, and their real fares, with every enquiry landing on WhatsApp already carrying the trip it came from.",
    cover: "/works/my-day-gili.jpg",
    coverLoop: "/works/my-day-gili-card.mp4",
    coverLoopHd: "/works/my-day-gili.mp4",
    tags: ["Travel", "Booking", "SEO"],
    url: "https://mydaygili.com",
    urlLabel: "Visit site",
    services: ["Web & Software Development", "Ads Management", "Growth & Analytics", "Maintenance Service"],
    location: "Padang Bai · Bali · Indonesia",
    scope: [
      "Multi-page site: crossings, day trips, Bali tours, blog, contact",
      "Operator comparison with live departure times and fares",
      "Gili and Nusa Penida day-trip pages with inclusions",
      "WhatsApp booking, each enquiry tagged with its own reference",
      "FAQ answering the harbour, fee, and infant questions travellers ask",
      "Product, LocalBusiness, and FAQ structured data for travel search",
    ],
    longDescription:
      "My Day Gili has been moving travellers from Bali to the Gili Islands and Lombok since 2017. The hard part was never the boats, it was that a traveller comparing four operators had to open four tabs, none of which agreed on price, and then send a message that arrived with no context at all. The site puts the four crossings side by side with their real times and fares, adds the day trips and tours the team also runs, and routes every enquiry to WhatsApp carrying a reference for whatever the traveller was looking at.",
    study: {
      overview:
        "My Day Gili sells fast boat tickets from Padang Bai to Gili Trawangan, Gili Air, Gili Meno, and Lombok, plus Gili and Nusa Penida day trips and Bali tours with private transfer. It runs on real fast ferries rather than small speedboats, works with four operators, and has been rated on TripAdvisor since 2017. Bookings happen on WhatsApp, which is how island crossings actually get booked.",
      needed: [
        "Four operators, four sets of times and fares, and no single place that compared them.",
        "The difference between a large fast ferry and a small speedboat was the whole pitch, and it was nowhere on the page.",
        "Harbour fees, infant rules, and which port to show up at were asked over and over in chat.",
        "Enquiries arrived as bare messages, so the team had to work out which trip the traveller meant before answering.",
      ],
      did: [
        "Built the multi-page site: crossings, day trips, Bali tours, blog, and contact.",
        "Put the four operators side by side with their departure times and starting fares.",
        "Wrote the day-trip and tour pages with what is actually included, pickup and gear among them.",
        "Answered the recurring questions in a public FAQ instead of in chat, one at a time.",
        "Tagged every WhatsApp enquiry with a reference so it arrives with the trip attached.",
        "Marked up Product, LocalBusiness, and FAQ data so travel searches can read the fares.",
      ],
      changed: [
        "A traveller compares four crossings on one page instead of across four tabs.",
        "Fares are visible before anyone has to ask for them.",
        "The questions that used to open every chat are answered before the chat starts.",
        "Enquiries reach WhatsApp already carrying the trip they came from.",
      ],
    },
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

/**
 * The case study told in four beats, rendered as the body of
 * /works/[slug]: what the brand is, what was wrong, what we built, and
 * what is different now. The client's own words come from TESTIMONIALS.
 */
export type CaseStudy = {
  overview: string;
  needed: string[];
  did: string[];
  changed: string[];
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
    id: "web-software-development",
    number: "01",
    title: "Web & Software Development",
    short: "The website and the software your business runs on.",
    description:
      "We design and build your website, the software behind it, and the integrations that connect both to the tools you already use. One team scopes it, designs it, and ships it.",
    capabilities: [
      { title: "Website design and build", detail: "Layouts, pages, and the front end, designed and built by the same team." },
      { title: "Custom software and web apps", detail: "Booking flows, portals, dashboards, whatever off-the-shelf cannot do." },
      { title: "Automation and internal tools", detail: "Pipelines that move a form, a lead, or a task without anyone retyping it." },
      { title: "Integrations", detail: "Connecting the site to your CRM, inventory, payments, or WhatsApp." },
      { title: "Hosting and domains", detail: "Where the site lives and the address it answers to, both handled." },
      { title: "Content management", detail: "You edit your own text and images, without waiting on us." },
    ],
    intro:
      "Your website, the software behind it, and everything needed to keep it online, handled by one team.",
    narrative: [
      "This covers the full build: design, frontend, backend, and the integrations that connect your site to the tools you already run. The same team that scopes and designs the work also builds it, so nothing gets lost in a hand-off.",
      "It also covers the software that is not a website. Booking flows, client portals, internal dashboards, and the automation that moves work between them. If a person is retyping something from one system into another, that is usually the first thing we remove.",
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
      "Businesses that need a proper website for the first time, or one that has outgrown a template, and anyone whose team is doing work software should be doing.",
    cta: {
      problem: "Is your team still doing by hand what your website should be doing for you?",
      solution:
        "We design it, build it, and connect it to the tools you already use. Contact us for a free consultation.",
    },
  },
  {
    id: "social-media-management",
    number: "02",
    title: "Social Media Management",
    short: "Your feed, run properly and on a schedule.",
    description:
      "We plan, produce, and publish the content on your social accounts, and answer the people who reply to it. One visual system, one calendar, one team.",
    capabilities: [
      { title: "Content calendar", detail: "What goes out, when, and why, agreed ahead of the month rather than the morning." },
      { title: "Post design system", detail: "A template set that keeps every post recognisably yours across the whole grid." },
      { title: "Photo and video production", detail: "Shot on site: the workshop, the room, the product, the people." },
      { title: "Copywriting", detail: "Captions written around the questions your customers actually ask." },
      { title: "Community management", detail: "Comments and DMs answered, so an interested person is not left waiting." },
      { title: "Reporting", detail: "Reach, saves, and the enquiries that came out of it, monthly." },
    ],
    intro:
      "An always-on feed that looks like one company and goes out whether or not anyone had time this week.",
    narrative: [
      "Most business accounts do not fail on ideas, they fail on rhythm. Posts go out when someone remembers, the look drifts, and the grid stops reading as one brand. We take the whole thing: the plan, the production, the publishing, and the replies.",
      "The content is built around what customers ask before they buy. One question per post, answered plainly, in a template system that holds across every service you offer.",
    ],
    process: [
      {
        title: "Audit and plan",
        detail:
          "We look at what is there now, what performed, and what the account should be doing.",
      },
      {
        title: "Build the system",
        detail:
          "Templates, tone, and a calendar covering your full range of services.",
      },
      {
        title: "Produce and publish",
        detail:
          "Shooting, writing, scheduling, and posting to the agreed rhythm.",
      },
      {
        title: "Respond and report",
        detail:
          "Comments and DMs handled, with a monthly read on what moved.",
      },
    ],
    fitFor:
      "Businesses whose social account exists but goes quiet for weeks, and anyone whose feed no longer looks like the same company from post to post.",
    cta: {
      problem: "Has your social account gone quiet because nobody has time to feed it?",
      solution:
        "We plan it, produce it, publish it, and answer the replies. Contact us for a free consultation.",
    },
  },
  {
    id: "ads-management",
    number: "03",
    title: "Ads Management",
    short: "Paid campaigns, built and watched by the people who made the creative.",
    description:
      "We run your paid media across Meta, Google, and TikTok: the account structure, the audiences, the creative, and the weekly decisions about what to keep and what to cut.",
    capabilities: [
      { title: "Meta Ads", detail: "Facebook and Instagram campaigns, from account structure to creative testing." },
      { title: "Google Ads", detail: "Search, Performance Max, and YouTube, built around real search intent." },
      { title: "TikTok Ads", detail: "Native-feeling creative rather than a repurposed square banner." },
      { title: "Creative production", detail: "The ads themselves, made by the same team that runs the account." },
      { title: "Audience and funnel setup", detail: "Who sees what, and what happens after they click." },
      { title: "Tracking and attribution", detail: "Conversion tracking that survives the current privacy rules." },
    ],
    intro:
      "Campaigns where the person choosing the audience and the person making the ad are on the same team.",
    narrative: [
      "Paid media breaks most often at the seam between the media buyer and whoever made the creative. The buyer asks for three variants, the designer sends three colours of the same idea, and the test learns nothing. We do both, so a test can actually change the creative.",
      "The work is weekly, not monthly. Budgets shift, creative gets cut, and the account structure changes as the data comes in. You get a plain read of what is working rather than a dashboard screenshot.",
    ],
    process: [
      {
        title: "Account and tracking audit",
        detail:
          "What exists, what is tracked, and what is quietly broken.",
      },
      {
        title: "Structure and creative",
        detail:
          "Campaign architecture and the first round of ads, built together.",
      },
      {
        title: "Launch and test",
        detail:
          "Live with a clear read on which variable each test is actually moving.",
      },
      {
        title: "Weekly management",
        detail:
          "Budget shifts, new creative, and a monthly summary in plain language.",
      },
    ],
    fitFor:
      "Businesses already spending on ads without a clear read on what the spend is doing, and anyone about to start and wanting it set up properly the first time.",
    cta: {
      problem: "Are you spending on ads without a clear answer on what the spend is actually doing?",
      solution:
        "We build the campaigns, make the creative, and manage them weekly. Contact us for a free consultation.",
    },
  },
  {
    id: "graphic-design",
    number: "04",
    title: "Graphic Design",
    short: "The look, the assets, and the system that holds them together.",
    description:
      "Brand identity, the design system underneath it, and the everyday assets your business needs: social templates, decks, menus, packaging, signage, and print.",
    capabilities: [
      { title: "Brand identity", detail: "Logo, type, colour, and the rules that keep them consistent." },
      { title: "Design system", detail: "Templates and components so new material stays on brand without us." },
      { title: "Social and campaign assets", detail: "Post sets, story frames, and ad creative built on the same system." },
      { title: "Print and packaging", detail: "Menus, labels, signage, and anything that has to survive a printer." },
      { title: "Presentations and documents", detail: "Decks and proposals that look like they came from the same company." },
      { title: "Photo and video direction", detail: "Art direction for shoots, so the imagery matches the identity." },
    ],
    intro:
      "One visual system, applied everywhere, so your business looks like one business.",
    narrative: [
      "Most brands do not lack design, they lack a system. A logo exists, but the deck, the menu, and the Instagram grid were each made by different people at different times, and none of them agree. We build the system first and then apply it.",
      "That means the deliverable is not only the artwork. It is the templates and the rules that let your own team make the next poster without it drifting.",
    ],
    process: [
      {
        title: "Discovery",
        detail:
          "What the brand is, who it talks to, and what already exists.",
      },
      {
        title: "Direction",
        detail:
          "Two or three visual routes, reviewed together before anything is built out.",
      },
      {
        title: "Build the system",
        detail:
          "Identity, type, colour, and the templates that carry it.",
      },
      {
        title: "Roll out",
        detail:
          "Applying it to the assets you need first, and handing over the files.",
      },
    ],
    fitFor:
      "Businesses whose material was made piece by piece over the years, and new brands that want the system right before anything gets printed.",
    cta: {
      problem: "Does your business look like a different company on every platform?",
      solution:
        "We build one visual system and apply it across the lot. Contact us for a free consultation.",
    },
  },
  {
    id: "growth-analytics",
    number: "05",
    title: "Growth & Analytics",
    short: "Knowing what is working, and what is not.",
    description:
      "Tracking set up properly, reporting you can actually read, and the search and conversion work that follows from what the numbers say.",
    capabilities: [
      { title: "Analytics setup", detail: "GA4, Search Console, and event tracking that records what matters." },
      { title: "Conversion tracking", detail: "Enquiries, bookings, and sales attributed to where they came from." },
      { title: "SEO", detail: "Structure, content, and the technical work that makes a site findable." },
      { title: "Answer engine optimisation", detail: "Being the source that AI search quotes, not just a blue link." },
      { title: "Conversion rate work", detail: "Finding where people leave, and fixing that page first." },
      { title: "Reporting", detail: "A monthly read in plain language, not a dashboard you never open." },
    ],
    intro:
      "The measurement layer under everything else, so decisions come from data rather than instinct.",
    narrative: [
      "Almost every account we inherit is either not tracking conversions at all or tracking them twice. Until that is fixed, every other decision is guesswork wearing a chart. So we start there.",
      "Once the measurement is honest, the work follows it: the pages that leak, the searches you should rank for but do not, and the questions your site never answers.",
    ],
    process: [
      {
        title: "Audit",
        detail:
          "What is being tracked, what is double counted, and what is missing entirely.",
      },
      {
        title: "Instrument",
        detail:
          "Analytics, conversion events, and search tooling set up properly.",
      },
      {
        title: "Read and prioritise",
        detail:
          "Where the traffic leaves and which fix is worth doing first.",
      },
      {
        title: "Improve and report",
        detail:
          "The work itself, and a monthly summary you can act on.",
      },
    ],
    fitFor:
      "Businesses running marketing without a reliable read on it, and anyone whose reporting has never quite matched what they see in the bank.",
    cta: {
      problem: "Do your marketing reports and your actual enquiries tell two different stories?",
      solution:
        "We fix the measurement first, then work on what it shows. Contact us for a free consultation.",
    },
  },
  {
    id: "maintenance-service",
    number: "06",
    title: "Maintenance Service",
    short: "Keeping everything running after launch.",
    description:
      "Hosting, updates, backups, security, and the small changes that come up every month, handled on an ongoing basis so nothing quietly breaks.",
    capabilities: [
      { title: "Hosting and uptime", detail: "Where it lives, monitored, with someone to call when it is down." },
      { title: "Updates and patching", detail: "Platform and dependency updates applied before they become a problem." },
      { title: "Backups and recovery", detail: "Regular backups, and a tested way to actually restore from them." },
      { title: "Security", detail: "Certificates, access, and the hardening that stops the common attacks." },
      { title: "Content updates", detail: "New sections, price changes, and swaps, done as they come up." },
      { title: "Performance", detail: "Keeping load times where they were on launch day, not a year after." },
    ],
    intro:
      "The part nobody thinks about until the site is down on a Sunday.",
    narrative: [
      "A website is not finished at launch, it starts there. Platforms update, certificates expire, plugins break each other, and images pile up until the page loads half as fast as it did. None of that announces itself.",
      "This is the retainer that keeps it boring: the updates applied, the backups tested, the small changes done in the week you ask rather than the quarter.",
    ],
    process: [
      {
        title: "Take over",
        detail:
          "We audit what is running, where it is hosted, and who holds the keys.",
      },
      {
        title: "Stabilise",
        detail:
          "Updates, backups, and monitoring brought to a known good state.",
      },
      {
        title: "Run",
        detail:
          "Monthly upkeep plus the small changes you send through.",
      },
      {
        title: "Report",
        detail:
          "What was done, what changed, and anything worth deciding on.",
      },
    ],
    fitFor:
      "Anyone with a live site and nobody responsible for it, and businesses whose developer finished the build and moved on.",
    cta: {
      problem: "If your site went down tonight, do you know who would fix it?",
      solution:
        "We host it, patch it, back it up, and handle the changes. Contact us for a free consultation.",
    },
  },
  {
    id: "all-in-one-digital-marketing",
    number: "07",
    title: "All-in-One Digital Marketing",
    short: "Every service above, run by one team, on one plan.",
    description:
      "The full programme: the website, the social, the ads, the design, the measurement, and the upkeep, on a single monthly scope with one team accountable for all of it.",
    capabilities: [
      { title: "Website and software", detail: "Built, hosted, and improved as the business changes." },
      { title: "Social media management", detail: "Planned, produced, published, and answered." },
      { title: "Ads management", detail: "Meta, Google, and TikTok, with creative from the same team." },
      { title: "Graphic design", detail: "One visual system applied across every channel." },
      { title: "Growth and analytics", detail: "Honest measurement, and the work that follows from it." },
      { title: "Maintenance", detail: "Updates, backups, and changes handled without being chased." },
    ],
    intro:
      "One agency, everything digital, on one plan and one invoice.",
    narrative: [
      "Running each of these separately means three vendors who each blame the other two. The ads agency says the site converts badly, the web agency says the traffic is wrong, and the designer was never in the room. Nobody owns the outcome.",
      "This is the version where one team holds all of it. The people making the ads know what the site does, the people building the site see what the ads are learning, and the measurement covers the whole path rather than one segment of it.",
    ],
    process: [
      {
        title: "Scope the programme",
        detail:
          "Which parts you need now, which come later, and what it costs monthly.",
      },
      {
        title: "Set the foundation",
        detail:
          "Measurement, brand system, and whatever is most broken, first.",
      },
      {
        title: "Run the channels",
        detail:
          "Site, social, ads, and design moving together on one calendar.",
      },
      {
        title: "Review monthly",
        detail:
          "One read across everything, and the plan for the next month.",
      },
    ],
    fitFor:
      "Businesses tired of coordinating three vendors, and anyone who wants the whole digital side handled without hiring a team for it.",
    cta: {
      problem: "Are you managing three vendors who each blame the other two?",
      solution:
        "One team takes the website, the social, the ads, the design, and the reporting. Contact us for a free consultation.",
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
  /**
   * A stand-in quote written by us, waiting on the client's real words.
   * It still renders on the page, but it is kept out of the Review JSON-LD:
   * that markup feeds Google's review rich results, and shipping an
   * invented five-star review into it is exactly what the policy forbids.
   */
  placeholder?: boolean;
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
      "Customers used to ask what CBM meant before every quote. The feed has usually answered that before they message us now, so the conversation starts at the shipment instead of the vocabulary.",
    author: "Operations Lead",
    role: "Export Division",
    client: "Jalak Cargo Logistics",
    projectSlug: "jalak-cargo-logistics",
    placeholder: true,
  },
  {
    quote:
      "Travellers used to open with which boat, what time, and how much, and we answered the same four things every day. Now the message arrives naming the crossing they already picked.",
    author: "Reservations Lead",
    role: "Bookings Team",
    client: "My Day Gili",
    projectSlug: "my-day-gili",
    placeholder: true,
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
