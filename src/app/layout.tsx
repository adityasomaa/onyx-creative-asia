import type { Metadata, Viewport } from "next";
import "./globals.css";
import RouteLoader from "@/components/RouteLoader";

/**
 * Root layout — minimal. Holds <html>, <body>, the grain texture, and
 * shared metadata defaults. All visual chrome (Loader, Nav, Footer, cookie
 * banner, JSON-LD) lives in the per-route-group layouts so the marketing
 * site and the /agents dashboard stay completely isolated.
 */

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased grain">
        <RouteLoader />
        {children}
      </body>
    </html>
  );
}
