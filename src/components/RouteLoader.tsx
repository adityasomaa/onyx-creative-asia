"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

/**
 * Global navigation loader.
 *
 * Shows a centered Onyx-branded spinner the moment a navigation starts,
 * then hides it as soon as the new URL (pathname OR search params) is
 * reflected. A short safety timeout caps how long the spinner can stick
 * around even if something goes wrong.
 *
 * Why we wrap in Suspense: useSearchParams() requires a Suspense
 * boundary above it. Without one, the entire page tree opts into
 * dynamic rendering. Local Suspense lets the rest of the layout stay
 * static.
 *
 * Mounted once in the root layout, applies to BOTH the marketing site
 * and the /agents dashboard.
 */
export default function RouteLoader() {
  return (
    <Suspense fallback={null}>
      <RouteLoaderInner />
    </Suspense>
  );
}

const SAFETY_TIMEOUT_MS = 1500;

function RouteLoaderInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  // Track the URL the loader started from so we can ignore the initial
  // pathname/search effect on mount.
  const startUrlRef = useRef<string | null>(null);

  // Hide whenever the URL changes (pathname OR search). usePathname +
  // useSearchParams both return new values once Next.js commits the
  // navigation, so this fires the moment the new page is ready.
  useEffect(() => {
    if (!loading) return;
    // If the URL has actually moved since we started showing the spinner,
    // hide it. Otherwise the click was something that didn't navigate
    // (modal trigger, etc.) — the safety timeout below cleans up.
    const currentUrl = `${pathname}?${searchParams?.toString() ?? ""}`;
    if (startUrlRef.current !== null && startUrlRef.current !== currentUrl) {
      setLoading(false);
      startUrlRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  // Click intercept — show the spinner the instant the user starts a nav.
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (e.button !== 0) return;

      const target = e.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

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

      try {
        const url = new URL(anchor.href);
        if (url.origin !== window.location.origin) return;

        const sameUrl =
          url.pathname === window.location.pathname &&
          url.search === window.location.search &&
          url.hash === window.location.hash;
        if (sameUrl) return;

        // Capture the starting URL so the pathname effect can tell when
        // navigation actually completes (vs a click on a link to the
        // same path with the search bar changed, which still updates
        // searchParams).
        startUrlRef.current = `${window.location.pathname}?${window.location.search.slice(1)}`;
      } catch {
        return;
      }

      setLoading(true);
    }

    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);

  // Browser back/forward — hide instantly when the URL changes via popstate.
  useEffect(() => {
    function onPop() {
      setLoading(false);
      startUrlRef.current = null;
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Safety net — even if the click matched something that didn't
  // navigate, never let the overlay stick around longer than this.
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => {
      setLoading(false);
      startUrlRef.current = null;
    }, SAFETY_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [loading]);

  // Hide when tab regains focus — a stuck spinner from an aborted nav
  // is one of the worst feels; this clears it on any return-to-page.
  useEffect(() => {
    function onVis() {
      if (document.visibilityState === "visible") {
        setLoading(false);
        startUrlRef.current = null;
      }
    }
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

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

function OnyxSpinner() {
  return (
    <div className="relative w-14 h-14 route-loader-fade-in">
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
