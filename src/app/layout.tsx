import type { Metadata, Viewport } from "next";
import "./globals.css";

/**
 * Root layout — minimal. Holds <html>, <body>, the grain texture, and
 * shared metadata defaults. All visual chrome (Loader, Nav, Footer, cookie
 * banner, JSON-LD) lives in the per-route-group layouts so the marketing
 * site and the /agents dashboard stay completely isolated.
 */

export const metadata: Metadata = {
  metadataBase: new URL("https://onyxcreative.asia"),
  title: {
    default: "Onyx Creative Asia | Digital Business Development Agency in Bali, Asia",
    template: "%s | Onyx Creative Asia",
  },
  description:
    "Onyx Creative Asia is a digital business development agency in Bali. Websites and software, branding and design, ads, social media and growth analytics, from one team.",
  applicationName: "Onyx Creative Asia",
  authors: [{ name: "Onyx Creative Asia", url: "https://onyxcreative.asia" }],
  creator: "Onyx Creative Asia",
  publisher: "Onyx Creative Asia",
  alternates: { canonical: "/" },
  keywords: [
    "digital business development agency",
    "business development agency Asia",
    "digital agency Bali",
    "website development Bali",
    "software development Indonesia",
    "social media management Bali",
    "Google Ads Meta Ads TikTok Ads",
    "branding agency Bali",
    "growth analytics",
    "Onyx Creative Asia",
  ],
  openGraph: {
    title: "Onyx Creative Asia · Digital Business Development Agency",
    description:
      "One team in Bali builds the website, software and apps, and runs the marketing that grows them.",
    url: "/",
    siteName: "Onyx Creative Asia",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Onyx Creative Asia",
    description: "Digital business development agency. Built in Bali.",
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
  category: "business",
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
    // suppressHydrationWarning: inline scripts in the marketing layout set
    // data-intro and the accent variables on <html> before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
