"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Persistent contact CTA in the bottom-right corner.
 *
 * Hidden on:
 *   - /contact itself (you're already there)
 *   - the Loader's initial reveal (waits 1.2s after mount so the loader
 *     can finish its sequence without a button popping in mid-animation)
 *
 * Click → /contact. The actual chooser lives on the page so the button
 * doesn't need to carry any state.
 */

const EASE = [0.25, 1, 0.5, 1] as const;

export default function FloatingContactButton() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Wait for the loader sequence before fading in.
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 1200);
    return () => clearTimeout(t);
  }, []);

  // Suppress on the contact page itself.
  const onContact = pathname === "/contact" || pathname?.startsWith("/contact?");

  return (
    <AnimatePresence>
      {mounted && !onContact && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.95 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="fixed bottom-5 right-5 md:bottom-7 md:right-7 z-40"
        >
          <Link
            href="/contact"
            aria-label="Get in touch"
            className="group inline-flex items-center gap-3 rounded-full bg-ink text-bone pl-5 pr-5 md:pr-6 py-3 md:py-3.5 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.7)] transition-all duration-500 ease-out-expo hover:-translate-y-0.5"
          >
            <span
              aria-hidden
              className="relative flex h-2 w-2"
            >
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-sm font-medium tracking-tight">
              Get in touch
            </span>
            <span
              aria-hidden
              className="hidden md:inline text-xs tracking-[0.2em] uppercase opacity-60"
            >
              ·
            </span>
            <span
              aria-hidden
              className="hidden md:inline text-xs tracking-[0.2em] uppercase opacity-60 transition-opacity group-hover:opacity-90"
            >
              48h reply
            </span>
            <span
              aria-hidden
              className="text-base leading-none transition-transform duration-500 group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
