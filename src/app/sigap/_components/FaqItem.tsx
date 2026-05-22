"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.25, 1, 0.5, 1] as const;

/**
 * FAQ row with smooth height + opacity animation on toggle. Replaces
 * the native <details>/<summary> approach because that pops without
 * any transition. Same a11y semantics (button + aria-expanded + a
 * panel role implied by the section context).
 */
export default function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="border-b border-hairline">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full text-left py-5 md:py-6 flex items-start justify-between gap-6 cursor-pointer group"
      >
        <span className="text-base md:text-lg font-medium leading-snug tracking-tight">
          {q}
        </span>
        <span
          aria-hidden
          className={`text-xl leading-none mt-0.5 transition-transform duration-500 ease-out-expo shrink-0 opacity-70 ${
            open ? "rotate-45" : "rotate-0"
          }`}
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: { duration: 0.45, ease: EASE },
                opacity: { duration: 0.3, ease: EASE, delay: 0.1 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.35, ease: EASE, delay: 0.05 },
                opacity: { duration: 0.2, ease: EASE },
              },
            }}
            className="overflow-hidden"
          >
            <p className="pb-6 md:pb-7 pr-10 text-sm md:text-base text-ink/70 leading-relaxed">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
