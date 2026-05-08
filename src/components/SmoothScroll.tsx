"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/**
 * Sitewide smooth scroll. Lenis owns the scroll position internally, so
 * Next.js's default "scroll to top on navigation" doesn't reset it — the
 * page would render at whatever scroll position the previous one left
 * behind. We watch `usePathname` and force Lenis back to the top
 * (immediate, no animation) on every route change, plus a window-level
 * scrollTo as a defensive fallback.
 */
export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Reset scroll to top on every route change.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (lenis) {
      // `immediate: true` skips the smooth animation so the new page
      // appears already at the top, like a hard navigation.
      // `force: true` overrides any in-flight scrollTo from the prior page.
      lenis.scrollTo(0, { immediate: true, force: true });
    }
    // Defensive: bypass Lenis entirely in case it's destroyed/unmounted
    // mid-navigation. Keeps the browser scroll position in sync.
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [pathname]);

  return null;
}
