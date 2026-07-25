"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const EASE = [0.25, 1, 0.5, 1] as const;
const STEP = 90; // pointer travel between drops
const LIFETIME = 1000;
const MAX_LIVE = 7;

// Detailed things we actually do, dropped one after another as the cursor
// moves across the hero.
const PHRASES = [
  "WordPress web development",
  "Next.js web development",
  "Point of sale software development",
  "E-commerce store setup",
  "Wedding photography",
  "Product photography",
  "Brand identity design",
  "Logo design",
  "Social media management",
  "Instagram content production",
  "TikTok content production",
  "LinkedIn outreach automation",
  "Google Ads management",
  "Meta Ads management",
  "SEO optimization",
  "Email marketing automation",
  "WhatsApp chatbot development",
  "CRM automation",
  "Workflow automation",
  "Motion graphics",
  "Videography",
  "Conversion copywriting",
  "Landing page design",
  "Analytics and tracking setup",
];

type Drop = { id: number; x: number; y: number; text: string };

/**
 * Detailed service phrases trailing the cursor across the hero, replacing
 * the earlier image trail. Skipped on touch and for reduced motion.
 */
export default function HeroTextTrail() {
  const boundsRef = useRef<HTMLDivElement>(null);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [enabled, setEnabled] = useState(false);

  const last = useRef<{ x: number; y: number } | null>(null);
  const nextPhrase = useRef(0);
  const nextId = useRef(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const hover = window.matchMedia("(hover: hover)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(hover && !reduced);
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  useEffect(() => {
    if (!enabled) return;
    function onMove(e: PointerEvent) {
      const node = boundsRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

      const prev = last.current;
      if (prev && Math.hypot(x - prev.x, y - prev.y) < STEP) return;
      last.current = { x, y };

      const text = PHRASES[nextPhrase.current % PHRASES.length];
      nextPhrase.current += 1;
      const id = nextId.current++;
      setDrops((cur) => [...cur.slice(-(MAX_LIVE - 1)), { id, x, y, text }]);
      const t = window.setTimeout(() => {
        setDrops((cur) => cur.filter((d) => d.id !== id));
      }, LIFETIME);
      timers.current.push(t);
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);

  return (
    <div
      ref={boundsRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
    >
      <AnimatePresence>
        {drops.map((d) => (
          <motion.span
            key={d.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 0.55, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{ left: d.x, top: d.y }}
            className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-sm font-medium uppercase tracking-[0.14em] text-bone md:text-base"
          >
            {d.text}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
