"use client";

import { motion } from "framer-motion";

const STEPS = [
  { t: "Inquiry", d: "You reach out and tell us what you need." },
  { t: "Discovery", d: "We dig into your goals, audience, and scope." },
  { t: "Development", d: "We design and build, with you in the loop." },
  { t: "Delivery", d: "We launch and hand it over, ready to run." },
  { t: "Maintenance", d: "We keep it healthy, updated, and improving." },
];

/**
 * Center-aligned delivery process as a single connected row. A light
 * runs left to right along the connecting line, following the order of
 * the steps. Scrolls horizontally on very small screens so it stays one
 * row.
 */
export default function ProcessFlow() {
  return (
    <section className="bg-ink text-bone py-24 md:py-32">
      <div className="container-x text-center">
        <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-4">
          Process
        </p>
        <h2 className="text-display-sm font-medium leading-[0.95] tracking-tight text-balance">
          How we deliver your project
        </h2>
      </div>

      <div className="container-x mt-14 md:mt-20">
        <div className="overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="relative mx-auto min-w-[760px] max-w-5xl px-2">
            {/* Connecting line */}
            <div className="absolute left-2 right-2 top-[7px] h-px bg-bone/15" />
            {/* Travelling light */}
            <motion.div
              aria-hidden
              className="absolute top-[7px] h-[3px] w-28 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-bone to-transparent"
              style={{ boxShadow: "0 0 14px 2px rgba(244,241,236,0.55)" }}
              initial={{ left: "-8%" }}
              animate={{ left: ["-8%", "100%"] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
            />

            <div className="grid grid-cols-5 gap-4">
              {STEPS.map((s, i) => (
                <div key={s.t} className="px-2 text-center">
                  <span className="mx-auto mb-6 block h-3.5 w-3.5 rounded-full bg-bone" />
                  <p className="mb-2 text-[10px] uppercase tracking-[0.25em] tabular-nums opacity-45">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="text-base md:text-lg font-medium tracking-tight">
                    {s.t}
                  </h3>
                  <p className="mt-2 text-xs md:text-sm leading-snug opacity-70">
                    {s.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
