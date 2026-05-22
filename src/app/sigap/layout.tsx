import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import SmoothScroll from "@/components/SmoothScroll";

/**
 * Sigap — Onyx Creative Asia's budget-tier sub-brand for UMKM in
 * Indonesia. Lives at sigap.onyxcreative.asia.
 *
 * Visual identity tracks the main Onyx editorial monochrome (bone/ink,
 * Neue Montreal type, hairline grid, restrained motion) so the brand
 * reads as "Onyx's accessible-tier offer," not a fully separate studio.
 * Content register stays warmer than Onyx — first-person plural, no
 * exclamations, but with light Bahasa gaul ("yuk", "udah") because
 * the audience is UMKM owners, not enterprise marketers.
 *
 * Lenis smooth scroll mounted for the same feel as onyxcreative.asia.
 * Loader + Cursor skipped — Sigap is conversion-first and most traffic
 * arrives on mobile via WhatsApp share links.
 */

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL("https://sigap.onyxcreative.asia"),
  title: {
    default: "Sigap — Branding & Web untuk UMKM, mulai Rp 500rb",
    template: "%s — Sigap",
  },
  description:
    "Paket logo, IG, dan landing page siap pakai untuk UMKM Indonesia. Harga jujur, hasil cepat 3-7 hari, semua via WhatsApp. Didukung Onyx Creative Asia.",
  applicationName: "Sigap",
  authors: [{ name: "Onyx Creative Asia", url: "https://onyxcreative.asia" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Sigap — Branding & Web untuk UMKM",
    description:
      "Paket logo, IG, dan landing page untuk UMKM. Mulai Rp 500rb, selesai 3-7 hari.",
    url: "/",
    siteName: "Sigap",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sigap",
    description: "Branding & web siap pakai untuk UMKM. Mulai Rp 500rb.",
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "design",
};

export default function SigapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bone text-ink antialiased">
      <SmoothScroll />
      {children}
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
    </div>
  );
}
