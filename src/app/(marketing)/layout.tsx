import { GoogleAnalytics } from "@next/third-parties/google";
import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import FloatingContactButton from "@/components/FloatingContactButton";
import { LanguageProvider } from "@/lib/i18n";

// GA4 Measurement ID for the public-facing marketing site only. The
// internal /agents dashboard lives outside this route group (its own
// app/agents/layout.tsx) so it never gets tagged, operator activity
// stays out of the funnel.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Marketing site layout, chrome (Loader, Nav, Footer, etc.) + JSON-LD
 * structured data. Wraps all public routes under the (marketing) route
 * group: /, /about, /contact, /services, /works, /insights, /privacy,
 * /terms.
 *
 * The /agents dashboard lives outside this group with its own layout
 * (see app/agents/layout.tsx), so none of this chrome bleeds into it.
 */

/* ============================================================
 * JSON-LD structured data
 *
 * Three blocks emitted into <head>:
 *   1. Organization, who we are, what we do, how to contact us
 *   2. LocalBusiness, Bali-anchored variant with serviceArea + price
 *      range. This is what surfaces in Google Local Pack + AI answers
 *      to "best agency in Bali" / "marketing studio near me".
 *   3. WebSite, search action for site-wide queries
 *
 * Each /services/[slug] page emits its own Service schema scoped to the
 * specific capability (web dev, paid media, etc.), see that route.
 * The /best-digital-marketing-bali and /best-digital-marketing-indonesia
 * landings emit FAQPage schemas with answer-engine-friendly Q&A.
 * ============================================================ */

const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://onyxcreative.asia/#organization",
  name: "Onyx Creative Asia",
  alternateName: ["Onyx", "Onyx Creative", "Onyx Studio"],
  url: "https://onyxcreative.asia",
  logo: {
    "@type": "ImageObject",
    url: "https://onyxcreative.asia/icon",
    width: 512,
    height: 512,
  },
  image: "https://onyxcreative.asia/opengraph-image",
  description:
    "Independent digital marketing and creative studio in Bali, Indonesia. We build websites, run paid media (Google / Meta / TikTok), produce social media content, and ship AI automation for ambitious teams across Asia.",
  slogan: "Brand, performance, and AI systems for ambitious teams.",
  foundingDate: "2026",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Denpasar",
    addressRegion: "Bali",
    addressCountry: "ID",
  },
  areaServed: [
    { "@type": "Country", name: "Indonesia" },
    { "@type": "Country", name: "Singapore" },
    { "@type": "Country", name: "Australia" },
    { "@type": "Place", name: "Asia" },
  ],
  knowsAbout: [
    "Web Development",
    "Next.js",
    "React",
    "Performance Marketing",
    "Google Ads",
    "Meta Ads",
    "TikTok Ads",
    "Social Media Strategy",
    "Content Production",
    "AI Automation",
    "Chatbots",
    "Brand Design",
    "Digital Marketing Bali",
    "Digital Marketing Indonesia",
  ],
  serviceType: [
    "Web Development",
    "Paid Media Management",
    "Social Media Management",
    "AI Systems Development",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Onyx Creative Asia Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Web Development",
          url: "https://onyxcreative.asia/services/web-development",
          description:
            "Custom websites and web apps built with Next.js / React. Marketing sites, headless commerce, and product UI.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Paid Media",
          url: "https://onyxcreative.asia/services/paid-media",
          description:
            "Google Ads, Meta Ads, and TikTok Ads management. Creative testing, audience architecture, attribution.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Social Media",
          url: "https://onyxcreative.asia/services/social-media",
          description:
            "Strategy, content production (photo/video/motion), and community management for Instagram, TikTok, LinkedIn.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "AI Systems",
          url: "https://onyxcreative.asia/services/ai-systems",
          description:
            "Custom-built AI automation: chatbots, internal workflow agents, content pipelines, reporting systems.",
        },
      },
    ],
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "hello@onyxcreative.asia",
      telephone: "+62-895-4133-72822",
      availableLanguage: ["English", "Indonesian"],
      areaServed: ["ID", "SG", "AU", "Asia"],
    },
  ],
  sameAs: [
    "https://www.instagram.com/onyxcreative.asia",
  ],
  subOrganization: {
    "@type": "Organization",
    name: "Sigap",
    url: "https://sigap.onyxcreative.asia",
    description:
      "Budget-tier digital service for UMKM (Indonesian small businesses). Fixed packages from Rp 500.000 for logo + website + social setup.",
  },
};

const LOCAL_BUSINESS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  "@id": "https://onyxcreative.asia/#localbusiness",
  name: "Onyx Creative Asia",
  url: "https://onyxcreative.asia",
  image: "https://onyxcreative.asia/opengraph-image",
  description:
    "Bali-based digital marketing studio. Web development, paid media (Google / Meta / TikTok ads), social media management, and AI automation for businesses across Indonesia, Asia, and beyond.",
  priceRange: "$$ – $$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Denpasar",
    addressRegion: "Bali",
    addressCountry: "ID",
  },
  areaServed: [
    { "@type": "AdministrativeArea", name: "Bali" },
    { "@type": "AdministrativeArea", name: "Jakarta" },
    { "@type": "AdministrativeArea", name: "Surabaya" },
    { "@type": "Country", name: "Indonesia" },
    { "@type": "Country", name: "Singapore" },
    { "@type": "Country", name: "Australia" },
  ],
  email: "hello@onyxcreative.asia",
  telephone: "+62-895-4133-72822",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
    ],
    opens: "08:00",
    closes: "22:00",
  },
};

const SITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://onyxcreative.asia/#website",
  name: "Onyx Creative Asia",
  url: "https://onyxcreative.asia",
  publisher: { "@id": "https://onyxcreative.asia/#organization" },
  potentialAction: {
    "@type": "SearchAction",
    target: "https://onyxcreative.asia/works?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
  inLanguage: ["en-US", "id-ID"],
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(LOCAL_BUSINESS_JSON_LD),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_JSON_LD) }}
      />
      <LanguageProvider>
        <Loader />
        <SmoothScroll />
        <Cursor />
        <Nav />
        <main>{children}</main>
        <Footer />
        <CookieConsent />
        <FloatingContactButton />
      </LanguageProvider>
      {/* Loaded with strategy="afterInteractive" by the wrapper, so it
          doesn't block render or fight the intro loader animation. Skipped
          entirely when NEXT_PUBLIC_GA_ID is unset (local dev without env). */}
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
    </>
  );
}
