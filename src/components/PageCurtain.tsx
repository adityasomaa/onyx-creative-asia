"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Curtain page transition.
 *
 * Replaces the old route spinner + intro loader on the marketing site.
 * The flow on every internal link click:
 *
 *   1. close   — an ink panel wipes up to cover the screen
 *   2. swap    — router.push() loads the new route UNDER the cover
 *   3. settle  — once the new route commits, scroll is reset to the top
 *   4. reveal  — the panel wipes off the top, uncovering the fresh page
 *
 * Because the content swap + scroll reset happen while the panel fully
 * covers the viewport, the change is never visible — it reads as one
 * seamless wipe. A short minimum hold keeps it deliberate even when the
 * next route is statically pre-rendered and commits instantly.
 *
 * We intercept clicks in the capture phase and call router.push ourselves,
 * so Next's <Link> never navigates on its own (no flash of the new page
 * before the curtain is in place). Browser back/forward is left alone.
 */

const EASE = [0.76, 0, 0.24, 1] as const;
const MIN_COVER_MS = 180; // guaranteed covered hold so the swap can't peek through
const NAV_SAFETY_MS = 1400; // never wait forever for a route that won't commit

const PANEL = {
  hidden: { y: "100%" },
  cover: { y: "0%", transition: { duration: 0.5, ease: EASE } },
  reveal: { y: "-100%", transition: { duration: 0.65, ease: EASE } },
} as const;

const MARK = {
  hidden: { opacity: 0, y: 10 },
  cover: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  reveal: { opacity: 0, y: -10, transition: { duration: 0.3, ease: EASE } },
} as const;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export default function PageCurtain() {
  const router = useRouter();
  const pathname = usePathname();
  const controls = useAnimationControls();

  const busy = useRef(false);
  const [active, setActive] = useState(false); // drives pointer-events while transitioning

  // Resolver plumbing so run() can `await` the next route actually committing.
  const targetPath = useRef<string | null>(null);
  const resolvePath = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (targetPath.current && pathname === targetPath.current) {
      targetPath.current = null;
      const r = resolvePath.current;
      resolvePath.current = null;
      r?.();
    }
  }, [pathname]);

  function waitForRoute(pathOnly: string) {
    return new Promise<void>((resolve) => {
      targetPath.current = pathOnly;
      resolvePath.current = resolve;
      window.setTimeout(() => {
        if (resolvePath.current === resolve) {
          resolvePath.current = null;
          targetPath.current = null;
          resolve();
        }
      }, NAV_SAFETY_MS);
    });
  }

  function resetScroll() {
    // Lenis owns the scroll position; reset it instantly (no smooth glide)
    // while we're covered, then sync the raw window scroll as a fallback.
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: unknown) => void } })
      .__lenis;
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }

  async function run(to: string, pathOnly: string) {
    busy.current = true;
    setActive(true);

    const t0 = Date.now();
    await controls.start("cover");

    router.push(to);
    await waitForRoute(pathOnly);

    resetScroll();

    // Guarantee a minimum covered hold + let the fresh page paint at top.
    const held = Date.now() - t0;
    if (held < MIN_COVER_MS) await sleep(MIN_COVER_MS - held);
    await new Promise<void>((r) =>
      requestAnimationFrame(() => requestAnimationFrame(() => r())),
    );

    await controls.start("reveal");
    controls.set("hidden");

    busy.current = false;
    setActive(false);
  }

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    function handler(e: MouseEvent) {
      if (reduce) return; // honour reduced-motion: let Next navigate normally
      if (e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
        return;

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
      )
        return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      let url: URL;
      try {
        url = new URL(anchor.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      // Same path (incl. pure hash links) — let the browser/Next handle it.
      if (url.pathname === window.location.pathname) return;

      // Take over navigation. stopPropagation keeps Next's <Link> onClick
      // from firing, so it never navigates ahead of the curtain.
      e.preventDefault();
      e.stopPropagation();
      if (busy.current) return;
      run(url.pathname + url.search + url.hash, url.pathname);
    }

    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      aria-hidden
      initial="hidden"
      animate={controls}
      variants={PANEL}
      style={{ pointerEvents: active ? "auto" : "none" }}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-ink"
    >
      <motion.div
        variants={MARK}
        animate={controls}
        initial="hidden"
        className="relative h-7 w-[64px] md:h-8 md:w-[72px]"
      >
        <Image
          src="/onyx-logo-white.png"
          alt=""
          fill
          sizes="72px"
          className="object-contain"
        />
      </motion.div>
    </motion.div>
  );
}
