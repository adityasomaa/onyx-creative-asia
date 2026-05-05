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
  keywords: [
    "creative agency",
    "web development",
    "google ads",
    "meta ads",
    "tiktok ads",
    "social media",
    "AI systems",
    "Indonesia",
    "Asia",
  ],
  openGraph: {
    title: "Onyx Creative Asia",
    description:
      "Brand, performance, and AI systems for ambitious teams. Built in Asia.",
    type: "website",
  },
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
