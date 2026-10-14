"use client";

import { motion } from "framer-motion";
import { useReduce } from "./useReduce";
import { cn } from "@/lib/cn";

/**
 * The Onyx logo: an infinity mark drawn in Tektur's geometry (45° chamfers,
 * the O's octagonal counter) followed by "ONYX CREATIVE" in Tektur
 * SemiBold. Size it with a text-size class: the mark's stroke matches the
 * SemiBold stem (0.14em) and its outer edge is exactly cap height.
 * `animate` draws the mark, then builds the letters in (used by the loader).
 *
 * The mark is one centre-line path: two chamfered loops meeting on 45°
 * diagonals at the middle, stroked with a miter join so the crossing stays
 * sharp. The same geometry is in design/brand/assets/onyx-mark.svg.
 */

export const MARK = {
  viewBox: "-154 -66 308 132",
  d: "M0 0L50 -50L112 -50L138 -24L138 24L112 50L50 50ZM0 0L-50 -50L-112 -50L-138 -24L-138 24L-112 50L-50 50Z",
  stroke: 28,
};

export function InfinityMark({ className, draw = false }: { className?: string; draw?: boolean }) {
  return (
    <svg viewBox={MARK.viewBox} className={cn("h-[0.71em] w-auto shrink-0", className)} aria-hidden>
      {draw ? (
        <motion.path
          d={MARK.d}
          fill="none"
          stroke="currentColor"
          strokeWidth={MARK.stroke}
          strokeLinejoin="miter"
          strokeMiterlimit={10}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
        />
      ) : (
        <path d={MARK.d} fill="none" stroke="currentColor" strokeWidth={MARK.stroke} strokeLinejoin="miter" strokeMiterlimit={10} />
      )}
    </svg>
  );
}

/** Double chevron. No longer part of the logo; kept as a pointer (the "who have we worked with" arrow). */
export function Chevrons({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 22 20" className={cn("h-[0.78em] w-auto", className)} aria-hidden>
      <path d="M1 1h5.2l8.6 9-8.6 9H1l8.6-9z" fill="currentColor" />
      <path d="M8.2 1h5.2L22 10l-8.6 9H8.2l8.6-9z" fill="currentColor" />
    </svg>
  );
}

const WORD = "ONYX CREATIVE";

export default function Wordmark({ className, animate = false }: { className?: string; animate?: boolean }) {
  const reduce = useReduce();
  const play = animate && !reduce;
  return (
    <span className={cn("inline-flex items-center gap-[0.34em] font-tek font-semibold uppercase leading-none tracking-[-0.02em]", className)}>
      <span className="sr-only">Onyx Creative Asia</span>
      <InfinityMark draw={play} />
      <span aria-hidden className="inline-flex">
        {Array.from(WORD).map((c, i) =>
          play ? (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: "0.35em" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.45 + i * 0.035 }}
            >
              {c === " " ? " " : c}
            </motion.span>
          ) : (
            <span key={i}>{c === " " ? " " : c}</span>
          ),
        )}
      </span>
    </span>
  );
}
