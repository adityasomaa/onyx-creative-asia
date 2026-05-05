"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "onyx-cookie-consent";
const EASE = [0.76, 0, 0.24, 1] as const;

type Consent = "accepted" | "declined" | null;

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = (localStorage.getItem(STORAGE_KEY) ?? null) as Consent;
    if (stored) return; // Already decided.

    // Wait for the loader (≈3.6s) plus a beat, so the banner doesn't fight
    // the intro animation. On returning visitors (no loader) the banner
    // still appears at this delay, which is fine.
    const t = setTimeout(() => setShow(true), 4200);
    return () => clearTimeout(t);
  }, []);

  function decide(value: "accepted" | "declined") {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // SSR / private mode — non-fatal.
    }
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="cookie-banner"
          role="dialog"
          aria-live="polite"
          aria-label="Cookie preferences"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="fixed inset-x-3 bottom-3 z-[130] md:inset-x-auto md:right-6 md:bottom-6 md:max-w-md"
        >
          <div className="rounded-2xl border border-hairline bg-ink text-bone shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)] backdrop-blur-md">
            <div className="p-5 md:p-6">
              <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-3">
                (Cookies)
              </p>
              <p className="text-sm leading-relaxed text-bone/85">
                We use a small set of cookies to make the site work and to
                understand how it&apos;s used. None for tracking or ads. Read{" "}
                <Link
                  href="/privacy"
                  className="border-b border-bone/40 hover:border-bone"
                >
                  our privacy policy
                </Link>
                .
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => decide("accepted")}
                  className="rounded-full bg-bone px-5 py-2.5 text-sm font-medium text-ink transition-transform duration-500 ease-out-expo hover:scale-[1.03]"
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => decide("declined")}
                  className="text-sm border-b border-bone/40 hover:border-bone pb-0.5 transition-colors"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
