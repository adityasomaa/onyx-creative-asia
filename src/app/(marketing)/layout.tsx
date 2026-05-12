import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";

/**
 * Marketing site layout — chrome (Loader, Nav, Footer, etc.) + JSON-LD
 * structured data. Wraps all public routes under the (marketing) route
 * group: /, /about, /contact, /services, /works, /insights, /privacy,
 * /terms.
 *
 * The /agents dashboard lives outside this group with its own layout
 * (see app/agents/layout.tsx), so none of this chrome bleeds into it.
 */

const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Onyx Creative Asia",
  alternateName: "Onyx",
  url: "https://onyxcreative.asia",
  logo: "https://onyxcreative.asia/icon",
  description:
    "Independent studio in Bali building brands, performance marketing, and AI systems for ambitious teams across Asia.",
  foundingDate: "2026",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bali",
    addressCountry: "ID",
  },
  areaServed: ["Asia", "Indonesia", "Australia", "Singapore", "Worldwide"],
  knowsAbout: [
    "Web Development",
    "Performance Marketing",
    "Social Media Strategy",
    "AI Systems",
    "Brand Design",
  ],
  sameAs: ["https://www.instagram.com/onyxcreative.asia"],
};

const SITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Onyx Creative Asia",
  url: "https://onyxcreative.asia",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://onyxcreative.asia/works?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_JSON_LD) }}
      />
      <Loader />
      <SmoothScroll />
      <Cursor />
      <Nav />
      <main>{children}</main>
      <Footer />
      <CookieConsent />
    </>
  );
}
