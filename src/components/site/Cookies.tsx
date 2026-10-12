"use client";

import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useL } from "@/lib/i18n";
import { COOKIES } from "@/lib/copy";
import { cn } from "@/lib/cn";

/**
 * Cookie consent with two categories:
 *   - essential (language, accent, this choice) — always on
 *   - analytics (Google Analytics) — off until the visitor allows it
 *
 * GA is mounted only after consent, so declining means the script never
 * loads at all. The choice is versioned so a future category can re-ask.
 * "Cookie settings" in the footer reopens the panel via a window event.
 */

const KEY = "onyx_consent_v1";
const EVENT = "onyx:cookie-settings";

type Consent = { analytics: boolean; at: string };

function read(): Consent | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

function write(c: Consent) {
  try {
    localStorage.setItem(KEY, JSON.stringify(c));
  } catch {
    /* ignore */
  }
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(EVENT));
}

export default function Cookies({ gaId }: { gaId?: string }) {
  const tl = useL();
  const [consent, setConsent] = useState<Consent | null>(null);
  const [ready, setReady] = useState(false);
  const [show, setShow] = useState(false);
  const [settings, setSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const c = read();
    setConsent(c);
    setAnalytics(c?.analytics ?? false);
    setReady(true);
    let t: ReturnType<typeof setTimeout> | undefined;
    if (!c) {
      // After the home loader, so the banner does not fight the intro.
      const delay = document.documentElement.dataset.intro === "play" ? 4200 : 1500;
      t = setTimeout(() => setShow(true), delay);
    }
    const reopen = () => {
      setAnalytics(read()?.analytics ?? false);
      setSettings(true);
      setShow(true);
    };
    window.addEventListener(EVENT, reopen);
    return () => {
      if (t) clearTimeout(t);
      window.removeEventListener(EVENT, reopen);
    };
  }, []);

  function decide(allowAnalytics: boolean) {
    const c = { analytics: allowAnalytics, at: new Date().toISOString() };
    write(c);
    setConsent(c);
    setShow(false);
    setSettings(false);
    // Revoking after GA already loaded: reload so the script is gone.
    if (consent?.analytics && !allowAnalytics) window.location.reload();
  }

  return (
    <>
      {ready && gaId && consent?.analytics ? <GoogleAnalytics gaId={gaId} /> : null}
      <AnimatePresence>
        {show && (
          <motion.div
            role="dialog"
            aria-label={tl(COOKIES.tag)}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 bottom-3 z-[150] md:inset-x-auto md:bottom-6 md:right-6 md:w-[400px]"
          >
            <div className="cut bg-night p-5 text-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] [--cut:16px]">
              <p className="flex items-center gap-1.5 text-[12px] font-semibold uppercase">
                <span className="text-white/30">[</span>
                <span className="text-white/70">{tl(COOKIES.tag)}</span>
                <span className="text-white/30">]</span>
              </p>
              <p className="mt-3 text-[13px] leading-[1.45] text-white/80">{tl(COOKIES.body)}</p>

              {settings && (
                <div className="mt-4 flex flex-col divide-y divide-white/10 border-y border-white/10">
                  <div className="flex items-start justify-between gap-4 py-3">
                    <div>
                      <p className="text-[13px] font-semibold">{tl(COOKIES.essential)}</p>
                      <p className="mt-1 text-[12px] leading-[1.4] text-white/55">{tl(COOKIES.essentialBody)}</p>
                    </div>
                    <span className="mt-0.5 rounded-full bg-accent/90 px-2 py-0.5 text-[10px] font-semibold uppercase text-accent-ink">On</span>
                  </div>
                  <label className="flex cursor-pointer items-start justify-between gap-4 py-3">
                    <div>
                      <p className="text-[13px] font-semibold">{tl(COOKIES.analytics)}</p>
                      <p className="mt-1 text-[12px] leading-[1.4] text-white/55">{tl(COOKIES.analyticsBody)}</p>
                    </div>
                    <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="peer sr-only" />
                    <span
                      aria-hidden
                      className={cn(
                        "relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-accent",
                        analytics ? "bg-accent" : "bg-white/20",
                      )}
                    >
                      <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-night transition-[left]", analytics ? "left-[18px]" : "left-0.5")} />
                    </span>
                  </label>
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {settings ? (
                  <button type="button" onClick={() => decide(analytics)} className="cut bg-accent px-4 py-2 font-tek text-[13px] font-medium uppercase text-accent-ink [--cut:6px]">
                    {tl(COOKIES.save)}
                  </button>
                ) : (
                  <>
                    <button type="button" onClick={() => decide(true)} className="cut bg-accent px-4 py-2 font-tek text-[13px] font-medium uppercase text-accent-ink [--cut:6px]">
                      {tl(COOKIES.accept)}
                    </button>
                    <button type="button" onClick={() => decide(false)} className="bg-white/10 px-4 py-2 font-tek text-[13px] font-medium uppercase text-white hover:bg-white/15">
                      {tl(COOKIES.decline)}
                    </button>
                    <button type="button" onClick={() => setSettings(true)} className="px-2 py-2 text-[12px] font-semibold uppercase text-white/60 underline-offset-4 hover:text-white hover:underline">
                      {tl(COOKIES.settings)}
                    </button>
                  </>
                )}
              </div>
              <Link href="/privacy-policy#cookies" className="mt-3 inline-block text-[11px] font-semibold uppercase text-white/45 hover:text-white">
                {tl(COOKIES.read)} →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
