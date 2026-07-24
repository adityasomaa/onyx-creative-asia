"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useIntroState, markIntroShown } from "@/lib/intro";
import TextScramble from "@/components/TextScramble";

/**
 * Page transition + intro loader, one overlay.
 *
 * A single full-screen ink panel handles every covered moment on the
 * marketing site:
 *
 *   • First open of the site (any landing page) and every navigation to
 *     the HOME page play the branded count-up LOADER: the panel covers,
 *     the "Onyx Creative" wordmark decodes while a counter runs to 100,
 *     then the panel wipes off the top to reveal the page.
 *
 *   • Navigating to any OTHER page plays the quick CURTAIN wipe: cover →
 *     swap → reveal, with just the logo mark, no counter.
 *
 * In both cases the route swap + scroll reset happen while the panel
 * fully covers the viewport, so the content change is never visible.
 *
 * Internal link clicks are intercepted in the capture phase so Next's
 * <Link> never navigates ahead of the panel. Browser back/forward and
 * reduced-motion users are left to native behavior.
 */

const EASE = [0.76, 0, 0.24, 1] as const;
const COUNT_MS = 1700; // loader counter duration
const MIN_COVER_MS = 180; // minimum covered hold for the plain curtain
const NAV_SAFETY_MS = 1600; // cap on waiting for a route to commit

type Mode = "loader" | "curtain";

const PANEL = {
  hidden: { y: "100%" },
  cover: { y: "0%", transition: { duration: 0.5, ease: EASE } },
  reveal: { y: "-100%", transition: { duration: 0.65, ease: EASE } },
} as const;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const twoFrames = () =>
  new Promise<void>((r) =>
    requestAnimationFrame(() => requestAnimationFrame(() => r())),
  );

type Lenis = { stop: () => void; start: () => void; scrollTo: (t: number, o?: unknown) => void };
const getLenis = () =>
  (window as unknown as { __lenis?: Lenis }).__lenis;

export default function PageCurtain() {
  const router = useRouter();
  const pathname = usePathname();
  const intro = useIntroState();
  const controls = useAnimationControls();

  const [mode, setMode] = useState<Mode>("curtain");
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(false);
  // Bumped each time the loader plays so the wordmark re-mounts and the
  // scramble decode replays.
  const [runId, setRunId] = useState(0);

  const busy = useRef(false);
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

  function lockScroll(lock: boolean) {
    const l = getLenis();
    if (!l) return;
    if (lock) l.stop();
    else l.start();
  }

  function resetScroll() {
    getLenis()?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }

  function runCount(duration = COUNT_MS) {
    return new Promise<void>((resolve) => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setCount(Math.round(eased * 100));
        if (p < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });
  }

  // ── First open of the site: play the loader intro standalone ──
  useEffect(() => {
    if (intro !== true) return; // only the first session load
    markIntroShown();
    let cancelled = false;
    (async () => {
      setMode("loader");
      setCount(0);
      setRunId((n) => n + 1);
      setActive(true);
      lockScroll(true);
      controls.set("cover"); // already on the page — cover without a wipe-in
      await runCount();
      if (cancelled) return;
      await sleep(150);
      await controls.start("reveal");
      controls.set("hidden");
      lockScroll(false);
      setActive(false);
      setMode("curtain");
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intro]);

  // ── Drive a click-initiated navigation ──
  async function run(to: string, pathOnly: string, isHome: boolean) {
    busy.current = true;
    setActive(true);
    setMode(isHome ? "loader" : "curtain");
    if (isHome) {
      setCount(0);
      setRunId((n) => n + 1);
    }
    lockScroll(true);

    const t0 = Date.now();
    await controls.start("cover");

    router.push(to);
    await waitForRoute(pathOnly);
    resetScroll();

    if (isHome) {
      await runCount();
    } else {
      const held = Date.now() - t0;
      if (held < MIN_COVER_MS) await sleep(MIN_COVER_MS - held);
    }

    await twoFrames();
    await controls.start("reveal");
    controls.set("hidden");

    lockScroll(false);
    busy.current = false;
    setActive(false);
    setMode("curtain");
  }

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    function handler(e: MouseEvent) {
      if (reduce) return;
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
      if (url.pathname === window.location.pathname) return;

      e.preventDefault();
      e.stopPropagation();
      if (busy.current) return;
      run(url.pathname + url.search + url.hash, url.pathname, url.pathname === "/");
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
      className="fixed inset-0 z-[300] bg-ink text-bone"
    >
      {mode === "loader" ? (
        <div key={runId} className="flex h-full w-full flex-col justify-between">
          {/* Top bar */}
          <div className="container-x flex items-center justify-between pt-6 md:pt-8 text-xs uppercase tracking-[0.2em]">
            <span>Onyx Creative Asia</span>
            <span className="hidden md:inline">EST. 2023 · Asia</span>
          </div>

          {/* Center wordmark — cryptographic decode */}
          <div className="container-x flex flex-1 items-center justify-center">
            <h1 className="text-display-md font-medium leading-none text-balance text-center">
              <TextScramble
                text="Onyx"
                duration={1500}
                startDelay={120}
                scramblePerSecond={26}
              />
              <span className="font-light italic">
                {" "}
                <TextScramble
                  text="Creative"
                  duration={1800}
                  startDelay={320}
                  scramblePerSecond={24}
                />
              </span>
            </h1>
          </div>

          {/* Bottom: counter + progress bar */}
          <div className="container-x pb-6 md:pb-8">
            <div className="flex items-end justify-between">
              <div className="text-xs uppercase tracking-[0.2em] opacity-70">
                Loading experience
              </div>
              <div className="font-medium tabular-nums text-2xl md:text-3xl">
                {String(count).padStart(3, "0")}
              </div>
            </div>
            <div className="mt-4 h-px w-full overflow-hidden bg-bone/15">
              <div
                className="h-full w-full origin-left bg-bone"
                style={{ transform: `scaleX(${count / 100})` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="relative h-7 w-[64px] md:h-8 md:w-[72px]">
            <Image
              src="/onyx-logo-white.png"
              alt=""
              fill
              sizes="72px"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
