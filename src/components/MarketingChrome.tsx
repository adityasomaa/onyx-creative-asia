"use client";

import { usePathname } from "next/navigation";
import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";

/**
 * Marketing site chrome — Loader overlay, custom cursor, sticky nav, footer,
 * cookie banner. Mounted by the root layout on the public marketing routes
 * but NOT on /agents/* (the internal dashboard has its own minimal chrome).
 *
 * The pathname check intentionally happens client-side so we don't have to
 * carry headers/cookies into a server component. The agents dashboard is
 * also gated by middleware + a deny rule, so even if a public visitor
 * somehow lands on /agents they don't get the dashboard — they get a 404.
 */
export default function MarketingChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAgents = pathname.startsWith("/agents");

  if (isAgents) {
    // Agents dashboard renders its own layout. No marketing chrome.
    return <>{children}</>;
  }

  return (
    <>
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
