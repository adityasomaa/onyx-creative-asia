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

const LOOP = 7; // seconds for a packet to travel the whole run

/**
 * Delivery process as a flow diagram: opaque step cards sitting on a
 * connecting line, with packets running along it.
 *
 * The packets are painted *underneath* the cards (the cards carry the
 * section's own background and a higher stacking order), so a packet
 * visibly passes behind each step rather than sliding over the top of it.
 * That is the whole trick, and it is why the cards must not be
 * transparent.
 *
 * Desktop runs left to right, mobile runs top to bottom.
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

      {/* ─── Desktop: horizontal run ─── */}
      <div className="container-x mt-16 hidden md:mt-24 md:block">
        <div className="relative mx-auto max-w-6xl">
          {/* Track + packets, behind the cards */}
          <div className="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-px -translate-y-1/2">
            <div className="h-px w-full bg-gradient-to-r from-bone/10 to-bone/45" />
            {[0, 0.5].map((delay) => (
              <motion.span
                key={delay}
                aria-hidden
                className="absolute top-1/2 h-[3px] w-24 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-bone to-transparent"
                initial={{ left: "-10%" }}
                animate={{ left: ["-10%", "100%"] }}
                transition={{
                  duration: LOOP,
                  repeat: Infinity,
                  ease: "linear",
                  delay: delay * LOOP,
                }}
              />
            ))}
          </div>

          <ol className="relative z-10 grid grid-cols-5 gap-4">
            {STEPS.map((s, i) => (
              <li
                key={s.t}
                /* bg-ink is load-bearing: it is what hides the packet. */
                className="rounded-2xl border border-bone/15 bg-ink p-5 lg:p-6"
              >
                <p className="mb-2 text-[10px] uppercase tracking-[0.25em] tabular-nums opacity-45">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-base lg:text-lg font-medium tracking-tight">
                  <T>{s.t}</T>
                </h3>
                <p className="mt-2 text-xs lg:text-sm leading-snug opacity-70">
                  <T>{s.d}</T>
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ─── Mobile: vertical run ─── */}
      <div className="container-x mt-12 md:hidden">
        <div className="relative mx-auto max-w-md">
          <div className="pointer-events-none absolute bottom-0 left-6 top-0 z-0 w-px">
            <div className="h-full w-px bg-gradient-to-b from-bone/10 to-bone/45" />
            {[0, 0.5].map((delay) => (
              <motion.span
                key={delay}
                aria-hidden
                className="absolute left-1/2 h-24 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-transparent via-bone to-transparent"
                initial={{ top: "-10%" }}
                animate={{ top: ["-10%", "100%"] }}
                transition={{
                  duration: LOOP,
                  repeat: Infinity,
                  ease: "linear",
                  delay: delay * LOOP,
                }}
              />
            ))}
          </div>

          <ol className="relative z-10 flex flex-col gap-4">
            {STEPS.map((s, i) => (
              <li
                key={s.t}
                className="ml-2 rounded-2xl border border-bone/15 bg-ink p-5"
              >
                <p className="mb-1.5 text-[10px] uppercase tracking-[0.25em] tabular-nums opacity-45">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-lg font-medium tracking-tight">
                  <T>{s.t}</T>
                </h3>
                <p className="mt-1.5 text-sm leading-snug opacity-70">
                  <T>{s.d}</T>
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
