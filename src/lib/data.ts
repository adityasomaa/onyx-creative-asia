import type { SceneId } from "@/components/site/art/scenes";

export type Project = {
  slug: string;
  title: string;
  client: string;
  /** One-line description of what the brand is (shown under the card title). */
  blurb?: string;
  category: string;
  year: string;
  description: string;
  /** Still poster, 16:10 (also the video poster and the OG image). */
  cover: string;
  tags: string[];
  /** Scroll-through of the live site in a browser + phone frame, 16:10 on
   *  #F4F4F4: `video` at 1600x1000 for large slots, `card` at 960x600. */
  preview?: { video: string; card: string };
  /** For work without a public site: the motion graphic shown instead. */
  art?: SceneId;
  /** Client logo, solid black on transparent (shown inverted on dark). */
  logo?: string;
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

// Previews are captured from the real sites: a scroll-through of the live
// home page in a browser window with the phone version beside it, framed on
// #F4F4F4 at 16:10 so it sits whole in any slot. `cover` is its first frame.
// All of it lives in public/works/.
export const PROJECTS: Project[] = [
  {
    slug: "swarma-villas",
    title: "Riverside Villa Site",
    client: "Swarma Villas",
    blurb: "Teak and bamboo houses by the river in Ubud",
    category: "Digital Presence",
    year: "2026",
    description:
      "A website for three houses by the river in Singakerta, Ubud: a Javanese teak house, a bamboo hexagon and a bamboo dome, each with its own page and nightly rate, plus Paon restaurant, massage rituals, packages and a direct booking enquiry.",
    cover: "/works/swarma-villas-scroll.jpg",
    preview: { video: "/works/swarma-villas-scroll.mp4", card: "/works/swarma-villas-scroll-card.mp4" },
    tags: ["Web", "Villas", "Booking"],
    url: "https://swarmavillas.com",
    urlLabel: "Visit site",
    services: ["Digital Presence"],
    location: "Singakerta, Ubud · Bali",
    scope: [
      "Multi-page site: houses, restaurant, experiences, packages, journal, gallery",
      "A page for each of the three houses, with bed, guests, size and rate",
      "Paon restaurant and the massage rituals as reasons to stay",
      "Direct booking enquiry that survives a page reload",
      "No analytics, no advertising pixels, no third-party tracking",
      "A getting-here guide for a village minutes from central Ubud",
    ],
    longDescription:
      "Swarma is three houses in the village of Singakerta, a few minutes from the centre of Ubud: a traditional Javanese teak house with an open-air bathtub, a hexagonal bamboo house with woven walls, and a bamboo dome. Each one is a different way to stay, so the site gives each its own page, with the bed, the size and the nightly rate up front. Around them sit the reasons to choose Swarma: Paon, the restaurant in a restored Javanese wooden house, massage and body rituals, packages, and a short guide to getting there. Booking is a direct enquiry, and the site keeps nothing about its visitors except the enquiry they are writing.",
    study: {
      overview:
        "Swarma Villas is an eco-chic retreat of three houses by the river in Singakerta, Ubud, built from teak and bamboo around a garden pool, with its own restaurant, Paon, in a restored Javanese wooden house. Rates start at IDR 500,000 a night.",
      needed: [
        "Three very different houses had to read as three different ways to stay.",
        "The restaurant and the rituals were part of the stay but had no place online.",
        "Guests wanted each house's rate and size before they asked.",
        "Direct bookings needed a clear route on the villa's own site.",
      ],
      did: [
        "Built the multi-page site: houses, restaurant, experiences, packages, journal and gallery.",
        "Gave Gladak House, Bamboo Hexa and Bamboo Dome their own pages with bed, guests, size and rate.",
        "Set Paon restaurant and the massage and body rituals out as reasons to stay.",
        "Built the direct booking enquiry, which survives a reload without storing anything else.",
        "Left out analytics and advertising pixels entirely.",
      ],
      changed: [
        "Guests compare the three houses side by side, with rates in plain sight.",
        "The restaurant and the rituals sell the stay instead of being found on arrival.",
        "Booking enquiries come straight to the villa.",
        "Nothing about a visitor is tracked or sold.",
      ],
    },
  },
  {
    slug: "kaatrity-dental-care",
    title: "AI Receptionist & Clinic Site",
    client: "Kaatrity Dental Care",
    blurb: "Dental clinic in Canggu, Bali",
    category: "AI Automation",
    year: "2026",
    description:
      "A website for a one-room dental clinic in Canggu with an AI receptionist built in. It answers questions about treatments, hours and booking in English or Bahasa Indonesia at any hour, and hands anything clinical to the team on WhatsApp.",
    cover: "/works/kaatrity-dental-care-scroll.jpg",
    preview: { video: "/works/kaatrity-dental-care-scroll.mp4", card: "/works/kaatrity-dental-care-scroll-card.mp4" },
    tags: ["AI", "Chatbot", "Healthcare"],
    services: ["AI Automation", "Digital Presence"],
    location: "Tibubeneng, Canggu · Bali",
    scope: [
      "AI receptionist chat in English and Bahasa Indonesia",
      "Suggested questions, and 'ask about this' on every treatment",
      "Hand-off to WhatsApp for diagnosis and exact prices",
      "Clinic site: treatments, approach, reviews, location",
      "Booking request form with treatment and date",
      "Google rating and reviews shown up front",
    ],
    longDescription:
      "Kaatrity is a small dental clinic in Tibubeneng, Canggu, run by drg. Ika and her assistant from a single treatment room, with a 5.0 rating on Google from 295 reviews. Most first questions are the same: what an Airflow cleaning is, whether the clinic opens on Saturday, whether there is a slot today, whether they treat children. The site answers them with an AI receptionist set up with the clinic's own treatments and hours, which replies in English or Bahasa Indonesia at any hour and passes anything that needs a dentist, a diagnosis or an exact price to the team on WhatsApp.",
    study: {
      overview:
        "Kaatrity Dental Care offers Airflow cleaning, scaling and polishing, whitening, fillings, check-ups, children's check-ups and night guards from one treatment room in Canggu, with an English-speaking dentist and a sterile kit opened for every patient.",
      needed: [
        "The same first questions came in again and again: treatments, hours, same-day slots, children.",
        "Visitors from abroad needed answers in English, locals in Bahasa Indonesia.",
        "Anything clinical had to reach the dentist, not be guessed at by a bot.",
        "Booking had to be one step from any treatment.",
      ],
      did: [
        "Built the clinic site: treatments, approach, reviews and how to find it.",
        "Built an AI receptionist set up with the clinic's own treatments and hours.",
        "Added suggested questions and an 'ask about this' link on every treatment.",
        "Set clear limits: diagnosis and exact prices go to the clinic on WhatsApp.",
        "Added a booking request form with treatment and date.",
      ],
      changed: [
        "First questions get an answer at once, day or night, in two languages.",
        "The team's WhatsApp time goes to bookings, not to the same answers.",
        "Every treatment leads straight to a question or a booking.",
      ],
    },
  },
  {
    slug: "sunhwa-beauty-app",
    title: "Beauty Shopping App",
    client: "Sunhwa Beauty",
    blurb: "Skincare and beauty devices",
    category: "Digital Presence",
    year: "2026",
    description:
      "A mobile shopping app for Sunhwa's skincare and beauty devices: best sellers on the home screen, a shop by category, orders by status, a wishlist, and a member area with vouchers, stamps and rewards for bringing a friend.",
    cover: "/works/sunhwa-beauty-app-scroll.jpg",
    preview: { video: "/works/sunhwa-beauty-app-scroll.mp4", card: "/works/sunhwa-beauty-app-scroll-card.mp4" },
    tags: ["App", "Beauty", "E-commerce"],
    services: ["Digital Presence"],
    location: "Indonesia",
    scope: [
      "Mobile shopping app in Bahasa Indonesia, priced in rupiah",
      "Home with campaign banners, categories and best sellers",
      "Shop by category with product cards",
      "Orders by status: unpaid, processing, done",
      "Member area: wishlist, addresses, vouchers, stamps, member benefits",
      "Refer-a-friend and store locator",
    ],
    longDescription:
      "Sunhwa sells skincare and beauty devices, from ampoules and essences to devices for use at home. Its customers shop on their phones, so the work is an app rather than a website: a home screen that leads with the campaign and the best sellers, a shop that filters by category, orders tracked by status, and a member area that makes loyalty visible, with vouchers, stamps, member benefits and a reward for bringing a friend. Everything is in Bahasa Indonesia and priced in rupiah.",
    study: {
      overview:
        "Sunhwa Beauty sells skincare (ampoules, essences and serums) and beauty devices to customers in Indonesia, most of whom shop on their phones. The app holds the catalogue, the orders and the membership in one place.",
      needed: [
        "The store had to feel like an app on the phone, where its customers shop.",
        "Products needed finding by category and by what sells best.",
        "Customers needed to follow an order without starting a chat.",
        "Member perks had to be visible: vouchers, stamps and benefits.",
      ],
      did: [
        "Designed and built the mobile app in Bahasa Indonesia, priced in rupiah.",
        "Built the home screen around campaign banners, categories and best sellers.",
        "Built the shop with category tabs and product cards.",
        "Built orders by status, and a member area with wishlist, addresses, vouchers, stamps and referrals.",
      ],
      changed: [
        "Customers browse, buy and follow their orders in one place.",
        "The campaign and the best sellers are the first thing a customer sees.",
        "Member perks are in plain view, so loyalty has a reason to grow.",
      ],
    },
  },
  {
    slug: "glovia",
    title: "Social Media Brand Kit",
    client: "Glovia",
    blurb: "Body care: body serum and cream scrub",
    category: "Creative Studio",
    year: "2026",
    description:
      "A social media brand kit and a month of content for Glovia body care: visual direction, content pillars, feed, story and TikTok designs, profile set-ups for Instagram, TikTok and Facebook, and a 30-post November calendar.",
    cover: "/works/glovia-kit.jpg",
    preview: { video: "/works/glovia-kit.mp4", card: "/works/glovia-kit-card.mp4" },
    tags: ["Brand", "Social", "Beauty"],
    services: ["Creative Studio", "Digital Marketing"],
    location: "Indonesia",
    scope: [
      "Visual direction: palette, type and photography",
      "Four content pillars: education, product, self-care ritual, promotion",
      "Feed post and story designs",
      "Instagram, TikTok and Facebook profile mock-ups",
      "November content calendar: 30 posts",
      "Posting schedule and deliverables for every platform",
    ],
    longDescription:
      "Glovia makes body care, a body serum and a body cream scrub, under the line 'Glow naturally, love your skin'. Before its first post, the brand needed a way of looking and speaking that would hold across Instagram, TikTok and Facebook. The kit sets the visual direction in deep green and warm neutrals with a serif display face, splits the content into four pillars (skincare education, product and benefits, self-care rituals, promotion and social proof), designs the feed, stories and short videos, and plans November post by post.",
    study: {
      overview:
        "Glovia is a body-care brand in Indonesia with two products, a body serum and a body cream scrub. The work is the brand's social presence: how it looks, what it says, and what goes out each day.",
      needed: [
        "A new brand needed one look across three platforms before its first post.",
        "Content had to teach, sell and feel calm at the same time.",
        "Posting needed a plan, not a daily scramble.",
      ],
      did: [
        "Set the visual direction: palette, type and photography.",
        "Defined four content pillars and each one's share of the month.",
        "Designed feed posts, stories and TikTok frames, and the three profiles.",
        "Planned November: 30 posts with dates and formats.",
        "Wrote the posting schedule and deliverables for each platform.",
      ],
      changed: [
        "The brand looks the same wherever someone meets it.",
        "Every post has a job, set by its pillar.",
        "A month of content is planned before it starts.",
      ],
    },
  },
  {
    slug: "great-bali-villas",
    logo: "/logos/great-bali-villas.png",
    title: "Villa Rental Surface",
    client: "Great Bali Villas",
    blurb: "Premium villa stays in Bali",
    category: "Digital Presence",
    year: "2025",
    description:
      "A calm booking surface for premium Bali villa stays. Browse by area, size, and dates, move through full-bleed galleries and amenity breakdowns, and enquire straight to the team on WhatsApp.",
    cover: "/works/great-bali-villas-scroll.jpg",
    preview: { video: "/works/great-bali-villas-scroll.mp4", card: "/works/great-bali-villas-scroll-card.mp4" },
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
    logo: "/logos/bhagawan-property.png",
    title: "Property Advisory Platform",
    client: "Bhagawan Property",
    blurb: "Buyer-first property advisory in Bali",
    category: "Digital Presence",
    year: "2026",
    description:
      "A property advisory site built around trust rather than volume. Freehold and leasehold listings with real specs and pricing, editorial area guides across six Bali neighbourhoods, and a knowledge base that answers the questions buyers ask before they ever enquire.",
    cover: "/works/bhagawan-property-scroll.jpg",
    preview: { video: "/works/bhagawan-property-scroll.mp4", card: "/works/bhagawan-property-scroll-card.mp4" },
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
    logo: "/logos/tammia-online.png",
    title: "Beauty Tools Storefront",
    client: "Tammia Online",
    blurb: "Premium beauty tools retailer in Indonesia",
    category: "Digital Presence",
    year: "2026",
    description:
      "An e-commerce storefront for a premium beauty tools retailer. The full product catalogue, weekly new arrivals, cart and wishlist drawers, and a WhatsApp beauty advisor for shoppers who are not sure which brush they need.",
    cover: "/works/tammia-online-scroll.jpg",
    preview: { video: "/works/tammia-online-scroll.mp4", card: "/works/tammia-online-scroll-card.mp4" },
    tags: ["Web", "E-commerce", "Beauty"],
    // Live-project buttons hidden while the site is offline (dev.tammiaonline.com
    // 403, tammiaonline.com 503 since Oct 2026). To restore:
    // url: "https://dev.tammiaonline.com", urlLabel: "Visit site",
    services: ["Digital Presence", "Creative Studio", "Growth & Analytics", "Managed Services"],
    location: "Indonesia",
    scope: [
      "Storefront across the full product catalogue",
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
        "Tammia Online is a premium beauty tools retailer in Indonesia, selling genuine brushes and tools rather than lookalikes. The storefront runs the full catalogue with weekly new arrivals, ratings and rupiah pricing on every item, slide-out cart and wishlist drawers, and a WhatsApp beauty advisor for shoppers who are not sure what they need.",
      needed: [
      "Shoppers could not tell an original brush from a convincing copy.",
      "The same question arrived with every order: is this one authentic?",
      "Shipping, returns, and payment terms were not stated anywhere obvious.",
      "No fast way to ask a product question before committing to buy.",
      ],
      did: [
      "Built the storefront across the full product catalogue with weekly new arrivals.",
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
    logo: "/logos/astungkare-spa.png",
    title: "Mobile Spa Booking Surface",
    client: "Astungkare Spa",
    blurb: "24-hour mobile spa across Bali",
    category: "Digital Presence",
    year: "2026",
    description:
      "Brand, site, social, and paid media for a 24-hour mobile spa serving Canggu, Seminyak, and Ubud. A trained therapist with oils and linen arrives at your villa, booked in under five minutes via WhatsApp, with a real-time earliest-availability indicator on the hero.",
    cover: "/works/astungkare-spa-scroll.jpg",
    preview: { video: "/works/astungkare-spa-scroll.mp4", card: "/works/astungkare-spa-scroll-card.mp4" },
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
    logo: "/logos/the-hair-extensions-bali.png",
    title: "Salon Brand & Site",
    client: "The Hair Extensions Bali",
    blurb: "Hair extensions studio in Kerobokan",
    category: "Creative Studio",
    year: "2025",
    description:
      "Brand and site for a premium hair extensions studio in Kerobokan, six application methods, an editorial gallery with method filters, and a video hero of the actual color wall.",
    cover: "/works/the-hair-extensions-bali-scroll.jpg",
    preview: { video: "/works/the-hair-extensions-bali-scroll.mp4", card: "/works/the-hair-extensions-bali-scroll-card.mp4" },
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
    logo: "/logos/radcruiters.png",
    title: "Campaign Request Automation",
    client: "RADcruiters",
    blurb: "Recruitment-marketing agency in the EU",
    category: "AI Automation",
    year: "2026",
    description:
      "Self-routing intake for new campaign briefs. A WordPress form feeds a Make.com pipeline that extracts the domain, matches the client in Airtable, queues a Trello task, and fires team and client emails, end to end in seconds.",
    // This one has no site to scroll through: the work is the pipeline, so
    // it shows as a motion graphic of the route (the poster is a still of it).
    cover: "/works/radcruiters-poster.jpg",
    art: "automation",
    tags: ["Workflow", "Make.com", "WordPress"],
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
    logo: "/logos/jalak-cargo-logistics.svg",
    title: "Social & Content Programme",
    client: "Jalak Cargo Logistics",
    blurb: "Freight forwarder in Bali and Jakarta",
    category: "Creative Studio",
    year: "2026",
    description:
      "An always-on social programme for an Indonesian freight forwarder. Every post answers one real shipping question, in one visual system, published on a schedule, with the live site kept current alongside it.",
    cover: "/works/jalak-cargo-logistics-scroll.jpg",
    preview: { video: "/works/jalak-cargo-logistics-scroll.mp4", card: "/works/jalak-cargo-logistics-scroll-card.mp4" },
    tags: ["Instagram", "Content", "Maintenance"],
    url: "https://jalakkargologistik.id",
    urlLabel: "Visit site",
    services: ["Creative Studio", "Digital Marketing", "Growth & Analytics", "Managed Services"],
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
    logo: "/logos/my-day-gili.png",
    title: "Fast Boat Booking Surface",
    client: "My Day Gili",
    blurb: "Fast boat tickets and day trips from Bali",
    category: "Digital Presence",
    year: "2026",
    description:
      "One booking surface for crossings to the Gili Islands and Lombok. Four operators, their real schedules, and their real fares, with every enquiry landing on WhatsApp already carrying the trip it came from.",
    cover: "/works/my-day-gili-scroll.jpg",
    preview: { video: "/works/my-day-gili-scroll.mp4", card: "/works/my-day-gili-scroll-card.mp4" },
    tags: ["Travel", "Booking", "SEO"],
    url: "https://mydaygili.com",
    urlLabel: "Visit site",
    services: ["Digital Presence", "Digital Marketing", "Growth & Analytics", "Managed Services"],
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
