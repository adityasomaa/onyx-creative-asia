"use client";

import { usePathname, useRouter } from "next/navigation";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useL } from "@/lib/i18n";
import { LOADER } from "@/lib/copy";
import Wordmark from "./Wordmark";

/**
 * Page transitions and the home loader, one accent panel.
 *
 * Every navigation runs the same four beats, in this order:
 *   1. the page CLOSES   — the panel sweeps in on a diagonal from the
 *                          bottom-right corner until it covers everything
 *   2. the content CHANGES — the route swaps while fully covered
 *   3. scroll goes to TOP — reset while still covered, so the new page
 *                          is never seen mid-scroll
 *   4. the page OPENS    — the panel sweeps off toward the top-left
 *
 * Going to the home page (and a session's first visit to it) plays the
 * longer loader between 3 and 4: the wordmark builds in and a progress
 * rule runs across before the reveal.
 *
 * A route that has not arrived within NAV_TIMEOUT is loaded the plain way
 * instead, so the panel never opens back onto the page being left.
 *
 * Internal link clicks are intercepted in the capture phase so a <Link>
 * never navigates ahead of the panel. Hash links on the current page
 * just scroll. Back/forward and reduced motion use native navigation.
 */

const SESSION_KEY = "onyx_intro_seen";
const CLOSE = 0.6;
const OPEN = 0.75;
const EASE = [0.76, 0, 0.24, 1] as const;
// How long the panel waits, covered, for a slow route before giving up and
// doing a plain page load instead. Past HOLD_MARK the wordmark shows, so a
// slow connection reads as loading rather than a blank colour screen.
const NAV_TIMEOUT = 8000;
const HOLD_MARK = 700;

type Lenis = { stop: () => void; start: () => void; scrollTo: (t: number | HTMLElement, o?: unknown) => void };
const lenis = () => (window as unknown as { __lenis?: Lenis }).__lenis;
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const frames = () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));

/**
 * Clip-path for a diagonal edge. `k` is the threshold of x + y in units of
 * the viewport's own width/height (0 = top-left corner, 2 = bottom-right).
 * mode "below": visible where x + y >= k  (panel grows from bottom-right)
 * mode "above": visible where x + y <= k  (panel shrinks to top-left)
 */
function diagonal(k: number, mode: "below" | "above"): string {
  const p = (x: number, y: number) => `${(x * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%`;
  if (mode === "below") {
    if (k >= 2) return `polygon(${p(1, 1)}, ${p(1, 1)}, ${p(1, 1)}, ${p(1, 1)}, ${p(1, 1)})`;
    if (k >= 1) return `polygon(${p(k - 1, 1)}, ${p(1, k - 1)}, ${p(1, 1)}, ${p(1, 1)}, ${p(1, 1)})`;
    if (k <= 0) return `polygon(${p(0, 0)}, ${p(1, 0)}, ${p(1, 1)}, ${p(0, 1)}, ${p(0, 0)})`;
    return `polygon(${p(0, k)}, ${p(k, 0)}, ${p(1, 0)}, ${p(1, 1)}, ${p(0, 1)})`;
  }
  if (k <= 0) return `polygon(${p(0, 0)}, ${p(0, 0)}, ${p(0, 0)}, ${p(0, 0)}, ${p(0, 0)})`;
  if (k <= 1) return `polygon(${p(0, 0)}, ${p(k, 0)}, ${p(0, k)}, ${p(0, k)}, ${p(0, k)})`;
  if (k >= 2) return `polygon(${p(0, 0)}, ${p(1, 0)}, ${p(1, 1)}, ${p(0, 1)}, ${p(0, 0)})`;
  return `polygon(${p(0, 0)}, ${p(1, 0)}, ${p(1, k - 1)}, ${p(k - 1, 1)}, ${p(0, 1)})`;
}

/** Inline, pre-hydration: decide whether this first paint is covered. */
export function IntroScript() {
  const js = `(function(){try{var seen=sessionStorage.getItem(${JSON.stringify(SESSION_KEY)});var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(!seen&&!reduce&&location.pathname==='/'){document.documentElement.dataset.intro='play';}}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}

export default function Transition() {
  const router = useRouter();
  const pathname = usePathname();
  const tl = useL();

  // Clip progress: phase "in" uses k from 2 → 0 ("below"), "out" uses k from 2 → 0 ("above").
  // The edge direction lives in a ref: useTransform keeps the transformer
  // it was first given, so it must read the current phase, not close over it.
  const k = useMotionValue(2);
  const phase = useRef<"in" | "out">("in");
  const clip = useTransform(k, (v) => diagonal(v, phase.current === "in" ? "below" : "above"));
  const progress = useMotionValue(0);
  const progressWidth = useTransform(progress, (v) => `${v * 100}%`);

  const [active, setActive] = useState(false);
  const [loader, setLoader] = useState(false);
  const [hold, setHold] = useState(false);
  const [runId, setRunId] = useState(0);
  const busy = useRef(false);
  const waiting = useRef<{ path: string; resolve: (arrived: boolean) => void } | null>(null);

  // Resolve the pending navigation once the new route has committed.
  useEffect(() => {
    const w = waiting.current;
    if (w && pathname === w.path) {
      waiting.current = null;
      w.resolve(true);
    }
  }, [pathname]);

  /** Resolves true once the route commits, false if it never does. */
  const waitForRoute = (path: string) => {
    const mark = setTimeout(() => setHold(true), HOLD_MARK);
    return new Promise<boolean>((resolve) => {
      waiting.current = { path, resolve };
      setTimeout(() => {
        if (waiting.current?.resolve === resolve) {
          waiting.current = null;
          resolve(false);
        }
      }, NAV_TIMEOUT);
    }).finally(() => {
      clearTimeout(mark);
      setHold(false);
    });
  };

  const toTop = () => {
    lenis()?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  };

  const scrollToHash = (hash: string) => {
    if (!hash) return;
    const el = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!el) return;
    const l = lenis();
    if (l) l.scrollTo(el, { offset: -24, duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  async function playLoader() {
    setLoader(true);
    setRunId((n) => n + 1);
    progress.set(0);
    await sleep(350);
    await animate(progress, 1, { duration: 1.3, ease: [0.65, 0, 0.35, 1] });
    await sleep(200);
  }

  async function open() {
    phase.current = "out";
    k.set(2);
    await frames();
    await animate(k, 0, { duration: OPEN, ease: EASE });
  }

  async function close() {
    phase.current = "in";
    k.set(2);
    await frames();
    await animate(k, 0, { duration: CLOSE, ease: EASE });
  }

  // ── First visit to the home page: the loader is already covering ──
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.intro !== "play") return;
    let cancelled = false;
    (async () => {
      busy.current = true;
      phase.current = "in";
      k.set(0); // fully covered, matching the pre-hydration veil
      setActive(true);
      lenis()?.stop();
      // Hand over from the CSS veil only once React's panel is painted.
      await frames();
      delete root.dataset.intro;
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      await playLoader();
      if (cancelled) return;
      // A deep link (/#process) keeps its place; anything else starts at the top.
      const hash = location.hash;
      if (!hash) toTop();
      await open();
      setLoader(false);
      setActive(false);
      lenis()?.start();
      busy.current = false;
      if (hash) scrollToHash(hash);
    })();
    return () => {
      cancelled = true;
      lenis()?.start();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function navigate(href: string, path: string, hash: string) {
    busy.current = true;
    setActive(true);
    lenis()?.stop();
    const watchdog = setTimeout(() => {
      k.set(2);
      setActive(false);
      setLoader(false);
      lenis()?.start();
      busy.current = false;
    }, NAV_TIMEOUT + 4000);
    let leaving = false;

    try {
      // 1. close
      await close();
      // 2. content change
      router.push(href, { scroll: false });
      if (!(await waitForRoute(path))) {
        // The route never arrived: load it the plain way, still covered,
        // rather than opening onto the page the visitor just left.
        leaving = true;
        setHold(true);
        window.location.assign(href + hash);
        return;
      }
      // 3. scroll to top while covered
      toTop();
      await frames();
      if (path === "/") {
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          /* ignore */
        }
        await playLoader();
        toTop();
      } else {
        await sleep(120);
      }
      // 4. open
      await open();
    } finally {
      clearTimeout(watchdog);
      if (!leaving) {
        setLoader(false);
        setActive(false);
        lenis()?.start();
        busy.current = false;
        if (hash) setTimeout(() => scrollToHash(hash), 60);
      }
    }
  }

  // Intercept internal link clicks.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a) return;
      const raw = a.getAttribute("href");
      if (!raw || raw.startsWith("mailto:") || raw.startsWith("tel:") || a.target === "_blank" || a.hasAttribute("download")) return;
      let url: URL;
      try {
        url = new URL(a.href);
      } catch {
        return;
      }
      if (url.origin !== location.origin) return;
      // Only the marketing site animates; /agents navigates natively.
      if (url.pathname.startsWith("/agents") || url.pathname.startsWith("/api")) return;

      const samePage = url.pathname === location.pathname;
      if (samePage) {
        e.preventDefault();
        if (url.hash) {
          history.replaceState(null, "", url.hash);
          scrollToHash(url.hash);
        } else {
          lenis()?.scrollTo(0, { duration: 1.2 });
        }
        return;
      }
      if (reduce) return; // native navigation, Next handles scroll
      e.preventDefault();
      e.stopPropagation();
      if (busy.current) return;
      navigate(url.pathname + url.search, url.pathname, url.hash);
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      aria-hidden
      className="site-veil pointer-events-none fixed inset-0 z-[300] flex items-center justify-center bg-accent text-accent-ink"
      style={{
        clipPath: clip,
        visibility: active ? "visible" : "hidden",
        pointerEvents: active ? "auto" : "none",
      }}
    >
      <div className="site-veil-mark flex flex-col items-center gap-3" style={{ opacity: loader || hold ? 1 : 0, transition: "opacity .25s" }}>
        <Wordmark key={runId} animate={loader} className="text-[26px] md:text-[34px]" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.42em] opacity-70 md:text-[11px]">{tl(LOADER.tagline)}</span>
      </div>
      {loader && (
        <div className="absolute inset-x-0 bottom-0 h-[3px] bg-black/10">
          <motion.div className="h-full bg-accent-ink" style={{ width: progressWidth }} />
        </div>
      )}
    </motion.div>
  );
}
