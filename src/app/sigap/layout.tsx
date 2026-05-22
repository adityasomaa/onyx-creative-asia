import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";

/**
 * Sigap — Onyx Creative Asia's budget-tier sub-brand for UMKM in
 * Indonesia. Lives at sigap.onyxcreative.asia. Deliberately stripped
 * of the main Onyx chrome (Loader, smooth scroll, custom cursor,
 * heavy animations) because the target audience is on mobile + slower
 * connections and won't tolerate a 3MB first paint.
 *
 * Brand voice: warm, direct, Bahasa Indonesia, no English mix-in
 * except technical terms (UMKM, IG, logo). No exclamation marks
 * either — we keep the parent studio's restraint, just rendered in
 * a friendlier register.
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
    <div className="min-h-screen bg-sigap-cream text-sigap-ink antialiased">
      {children}
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
    </div>
  );
}
