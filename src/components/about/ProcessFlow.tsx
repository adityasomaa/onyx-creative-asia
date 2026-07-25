"use client";

import { motion } from "framer-motion";
import { T } from "@/lib/i18n";

const STEPS = [
  { t: "Inquiry", d: "You reach out and tell us what you need." },
  { t: "Discovery", d: "We dig into your goals, audience, and scope." },
  { t: "Development", d: "We design and build, with you in the loop." },
  { t: "Delivery", d: "We launch and hand it over, ready to run." },
  { t: "Maintenance", d: "We keep it healthy, updated, and improving." },
];

/**
 * Delivery process. A soft light glides along the connecting line in step
 * order. Desktop lays the steps out as one horizontal row; mobile switches
 * to a vertical timeline (dots + line on the left, copy on the right) so
 * there's never any sideways scrolling.
 */
export default function ProcessFlow() {
  return (
    <section className="bg-ink text-bone py-24 md:py-32">
      <div className="container-x text-center">
        <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-4">
          <T>Process</T>
        </p>
        <h2 className="text-display-sm font-medium leading-[0.95] tracking-tight text-balance">
          <T>How we deliver your project</T>
        </h2>
      </div>

      {/* ─── Desktop: horizontal row ─── */}
      <div className="container-x mt-14 hidden md:mt-20 md:block">
        <div className="relative mx-auto max-w-5xl px-2">
          {/* Connecting line */}
          <div className="absolute left-2 right-2 top-[7px] h-px -translate-y-1/2 bg-bone/15" />
          {/* Travelling light — thin, soft, sitting right on the line so it
              reads as the line brightening as it passes, not a bar on top. */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-[7px] h-[2px] w-40 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-bone to-transparent blur-[0.5px]"
            style={{ boxShadow: "0 0 10px 1px rgba(244,241,236,0.35)" }}
            initial={{ left: "-12%" }}
            animate={{ left: ["-12%", "100%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />

          <div className="grid grid-cols-5 gap-4">
            {STEPS.map((s, i) => (
              <div key={s.t} className="px-2 text-center">
                <span className="mx-auto mb-6 block h-3.5 w-3.5 rounded-full bg-bone" />
                <p className="mb-2 text-[10px] uppercase tracking-[0.25em] tabular-nums opacity-45">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-base md:text-lg font-medium tracking-tight">
                  <T>{s.t}</T>
                </h3>
                <p className="mt-2 text-xs md:text-sm leading-snug opacity-70">
                  <T>{s.d}</T>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Mobile: vertical timeline ─── */}
      <div className="container-x mt-12 md:hidden">
        <ol className="relative mx-auto max-w-md">
          {/* Travelling light — glides top to bottom along the dot column. */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute left-[7px] top-0 h-20 w-[2px] -translate-x-1/2 rounded-full bg-gradient-to-b from-transparent via-bone to-transparent blur-[0.5px]"
            style={{ boxShadow: "0 0 10px 1px rgba(244,241,236,0.35)" }}
            initial={{ top: "-12%" }}
            animate={{ top: ["-12%", "100%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
          {STEPS.map((s, i) => (
            <li key={s.t} className="relative flex gap-5">
              {/* Dot column: dot on top, connector filling down to the next */}
              <div className="relative flex flex-col items-center">
                <span className="z-10 mt-1 block h-3.5 w-3.5 shrink-0 rounded-full bg-bone" />
                {i < STEPS.length - 1 && (
                  <span className="mt-1 w-px flex-1 bg-bone/15" />
                )}
              </div>
              <div className="flex-1 pb-9">
                <p className="mb-1.5 text-[10px] uppercase tracking-[0.25em] tabular-nums opacity-45">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-lg font-medium tracking-tight">
                  <T>{s.t}</T>
                </h3>
                <p className="mt-1.5 text-sm leading-snug opacity-70">
                  <T>{s.d}</T>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
