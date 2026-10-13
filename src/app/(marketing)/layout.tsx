import { Fragment_Mono, Inter, Tektur } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import { CurrencyProvider, LocaleProvider } from "@/lib/i18n";
import { SERVICES } from "@/lib/services";
import { AccentProvider, AccentScript } from "@/components/site/Accent";
import Transition, { IntroScript } from "@/components/site/Transition";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import Cookies from "@/components/site/Cookies";
import ContactFab from "@/components/site/ContactFab";

/**
 * Marketing site layout. Wraps every public route under (marketing):
 * /, /projects, /notes, /about, /contact, the legal pages and the
 * answer-engine landings. /agents has its own layout and none of this
 * chrome reaches it.
 *
 * Type: Tektur for display, Inter at its display optical size for text,
 * Fragment Mono for the odd technical label — the reference's stack.
 */

const tektur = Tektur({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-tektur", display: "swap" });
const inter = Inter({ subsets: ["latin"], axes: ["opsz"], variable: "--font-inter", display: "swap" });
const fragment = Fragment_Mono({ subsets: ["latin"], weight: "400", variable: "--font-fragment", display: "swap" });

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const BASE = "https://onyxcreative.asia";

/* ── JSON-LD: who we are, where, and what we sell ─────────────────── */

const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE}/#organization`,
  name: "Onyx Creative Asia",
  alternateName: ["Onyx", "Onyx Creative"],
  url: BASE,
  logo: { "@type": "ImageObject", url: `${BASE}/icon`, width: 512, height: 512 },
  image: `${BASE}/opengraph-image`,
  description:
    "Digital business development agency in Bali, Indonesia. Website, software and mobile app development, plus social media, SEO/AEO/GEO, ads, content, photo and video, design and branding, and growth analytics, run by one team for businesses across Asia and Europe.",
  slogan: "We build what makes businesses grow online.",
  address: { "@type": "PostalAddress", addressLocality: "Denpasar", addressRegion: "Bali", addressCountry: "ID" },
  areaServed: [
    { "@type": "Country", name: "Indonesia" },
    { "@type": "Country", name: "Singapore" },
    { "@type": "Country", name: "Australia" },
    { "@type": "Country", name: "Netherlands" },
    { "@type": "Place", name: "Asia" },
  ],
  knowsAbout: [
    // The framing the studio wants to be the entity for: knowsAbout is
    // how a knowledge graph learns which topics an organisation is an
    // authority on, so the target phrasing has to appear here, not only
    // in page copy.
    "Business Development",
    "Digital Business Development",
    "Business Development Agency Asia",
    "Website Development",
    "Software Development",
    "Mobile App Development",
    "Social Media Management",
    "Search Engine Optimisation",
    "Answer Engine Optimisation",
    "Generative Engine Optimisation",
    "Google Ads",
    "Meta Ads",
    "TikTok Ads",
    "Content Creation",
    "Photography",
    "Videography",
    "Brand Design",
    "Growth Analytics",
    "Conversion Rate Optimisation",
    "Digital Marketing Bali",
    "Digital Marketing Indonesia",
  ],
  serviceType: SERVICES.map((s) => s.title.en),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Onyx Creative Asia services",
    itemListElement: SERVICES.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.title.en,
        description: s.body.en,
        url: `${BASE}/#expertise`,
        provider: { "@id": `${BASE}/#organization` },
      },
    })),
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "hello@onyxcreative.asia",
      telephone: "+62-895-4133-72822",
      availableLanguage: ["English", "Indonesian"],
      areaServed: ["ID", "SG", "AU", "NL", "Asia"],
    },
  ],
  sameAs: ["https://www.instagram.com/onyxcreative.asia", "https://www.tiktok.com/@onyxcreative.asia"],
};

const LOCAL_BUSINESS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  "@id": `${BASE}/#localbusiness`,
  name: "Onyx Creative Asia",
  url: BASE,
  image: `${BASE}/opengraph-image`,
  description:
    "Bali-based digital business development agency: websites, software and apps, and the marketing that grows them, from one team.",
  priceRange: "IDR 8,000,000+",
  address: { "@type": "PostalAddress", addressLocality: "Denpasar", addressRegion: "Bali", addressCountry: "ID" },
  areaServed: [
    { "@type": "AdministrativeArea", name: "Bali" },
    { "@type": "AdministrativeArea", name: "Jakarta" },
    { "@type": "Country", name: "Indonesia" },
    { "@type": "Country", name: "Singapore" },
    { "@type": "Country", name: "Australia" },
  ],
  email: "hello@onyxcreative.asia",
  telephone: "+62-895-4133-72822",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:00",
    closes: "22:00",
  },
};

const SITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE}/#website`,
  name: "Onyx Creative Asia",
  url: BASE,
  publisher: { "@id": `${BASE}/#organization` },
  inLanguage: ["en", "id", "zh", "ja"],
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`site ${tektur.variable} ${inter.variable} ${fragment.variable} min-h-screen overflow-x-clip`}>
      <IntroScript />
      <AccentScript />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_JSON_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_JSON_LD) }} />
      <LocaleProvider>
        <CurrencyProvider>
          <AccentProvider>
            <SmoothScroll />
            <Transition />
            <Nav />
            <main id="main">{children}</main>
            <Footer />
            <Cookies gaId={GA_ID} />
            <ContactFab />
          </AccentProvider>
        </CurrencyProvider>
      </LocaleProvider>
    </div>
  );
}
