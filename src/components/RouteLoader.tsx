"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Global navigation loader.
 *
 * Why: Next.js App Router transitions can feel like the page froze on
 * slow networks. This component shows a centered Onyx-branded spinner
 * the moment a navigation starts, then hides it as soon as the new
 * route's pathname is reflected by usePathname.
 *
 * How:
 *   1. Capture-phase click listener on document, looking for <a href>
 *      targets that point at another internal page.
 *   2. Show the overlay.
 *   3. When pathname changes, hide it. If something goes wrong and
 *      pathname never changes, a 10s safety timeout hides it anyway.
 *
 * Mounted once in the root layout, applies to BOTH the marketing site
 * and the /agents dashboard.
 */

export default function RouteLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  // Hide when route actually changes
  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  // Listen for navigation starts
  useEffect(() => {
    function handler(e: MouseEvent) {
      // Skip if any modifier — user wants new tab / save / etc.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (e.button !== 0) return; // primary click only

      const target = e.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Skip non-navigations
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:")
      ) {
        return;
      }
      if (anchor.target === "_blank") return;
      if (anchor.hasAttribute("download")) return;

      // Skip external links
      try {
        const url = new URL(anchor.href);
        if (url.origin !== window.location.origin) return;
        // Same exact URL — no nav, no spinner
        if (
          url.pathname === window.location.pathname &&
          url.search === window.location.search
        ) {
          return;
        }
      } catch {
        return;
      }

      setLoading(true);
    }

    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);

  // Safety net — never let the overlay stick around forever
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 10000);
    return () => clearTimeout(t);
  }, [loading]);

  if (!loading) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
    >
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px] route-loader-fade-in" />
      <OnyxSpinner />

      <style jsx global>{`
        @keyframes route-loader-fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .route-loader-fade-in {
          animation: route-loader-fade 200ms ease-out both;
        }
        @keyframes route-loader-spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes route-loader-pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.18);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

/* ============================================================
 * OnyxSpinner — circular Onyx mark.
 *
 * Outer dashed ring rotates, inner bullet pulses. Pure CSS so it
 * works during SSR-hydration without flicker.
 * ============================================================ */
function OnyxSpinner() {
  return (
    <div className="relative w-14 h-14 route-loader-fade-in">
      {/* Outer rotating ring */}
      <svg
        viewBox="0 0 56 56"
        className="absolute inset-0 w-full h-full"
        style={{
          animation: "route-loader-spin 1.4s linear infinite",
        }}
        aria-hidden
      >
        <circle
          cx="28"
          cy="28"
          r="24"
          fill="none"
          stroke="#F4F1EC"
          strokeOpacity="0.18"
          strokeWidth="2"
        />
        <circle
          cx="28"
          cy="28"
          r="24"
          fill="none"
          stroke="#F4F1EC"
          strokeOpacity="0.9"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="40 120"
        />
      </svg>

      {/* Pulsing bullet mark in the centre */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <span
          className="block w-2.5 h-2.5 rounded-full bg-bone"
          style={{
            animation: "route-loader-pulse 1.4s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}
