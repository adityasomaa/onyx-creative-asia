import type { Metadata, Viewport } from "next";
import "./globals.css";
import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";

export const metadata: Metadata = {
  metadataBase: new URL("https://onyxcreative.asia"),
  title: {
    default: "Onyx Creative Asia — Brand, Performance & AI Systems",
    template: "%s — Onyx Creative Asia",
  },
  description:
    "Onyx Creative Asia is an independent studio building brands, performance marketing, and AI systems for ambitious teams across Asia and beyond.",
  applicationName: "Onyx Creative Asia",
  authors: [{ name: "Onyx Creative Asia", url: "https://onyxcreative.asia" }],
  creator: "Onyx Creative Asia",
  publisher: "Onyx Creative Asia",
  alternates: { canonical: "/" },
  keywords: [
    "creative studio Bali",
    "creative agency Asia",
    "web development Indonesia",
    "Next.js studio",
    "performance marketing",
    "google ads agency",
    "meta ads",
    "tiktok ads",
    "social media strategy",
    "AI systems",
    "AI automation agency",
    "brand design",
    "Onyx Creative Asia",
  ],
  openGraph: {
    title: "Onyx Creative Asia — Brand, Performance & AI Systems",
    description:
      "Independent studio in Bali building brands, performance marketing, and AI systems for ambitious teams.",
    url: "/",
    siteName: "Onyx Creative Asia",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Onyx Creative Asia",
    description:
      "Brand, performance, and AI systems for ambitious teams. Built in Bali.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  category: "design",
};

export const viewport: Viewport = {
  themeColor: "#0E0E0E",
  width: "device-width",
  initialScale: 1,
};

// JSON-LD structured data for the studio. Renders inline on every page so
// search engines pick up the organization, location, and disciplines.
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_JSON_LD) }}
        />
      </head>
      <body className="antialiased grain">
        <Loader />
        <SmoothScroll />
        <Cursor />
        <Nav />
        <main>{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
