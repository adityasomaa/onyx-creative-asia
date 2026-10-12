"use client";

import { motion } from "framer-motion";
import { useReduce } from "./useReduce";
import { cn } from "@/lib/cn";

/**
 * "ONYX CREATIVE»" — Tektur caps followed by a double chevron, the same
 * construction as the reference's wordmark. Size it with a text-size
 * class; the chevron scales with the cap height. `animate` builds the
 * letters in one by one (used by the loader).
 */

const WORD = "ONYX CREATIVE";

export function Chevrons({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 22 20" className={cn("h-[0.78em] w-auto", className)} aria-hidden>
      <path d="M1 1h5.2l8.6 9-8.6 9H1l8.6-9z" fill="currentColor" />
      <path d="M8.2 1h5.2L22 10l-8.6 9H8.2l8.6-9z" fill="currentColor" />
    </svg>
  );
}

export default function Wordmark({ className, animate = false }: { className?: string; animate?: boolean }) {
  const reduce = useReduce();
  const play = animate && !reduce;
  return (
    <span className={cn("inline-flex items-center gap-[0.12em] font-tek font-semibold uppercase leading-none tracking-[-0.02em]", className)}>
      <span className="sr-only">Onyx Creative Asia</span>
      <span aria-hidden className="inline-flex">
        {Array.from(WORD).map((c, i) =>
          play ? (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: "0.35em" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.05 + i * 0.035 }}
            >
              {c === " " ? " " : c}
            </motion.span>
          ) : (
            <span key={i}>{c === " " ? " " : c}</span>
          ),
        )}
      </span>
      {play ? (
        <motion.span
          aria-hidden
          className="inline-flex"
          initial={{ opacity: 0, x: "-0.3em" }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 + WORD.length * 0.035 }}
        >
          <Chevrons />
        </motion.span>
      ) : (
        <Chevrons />
      )}
    </span>
  );
}
