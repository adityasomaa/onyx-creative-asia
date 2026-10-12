"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useReduce } from "./useReduce";
import { cn } from "@/lib/cn";

const DIGITS = "0123456789".split("");

/**
 * Digits that roll up into place the first time they scroll into view,
 * like the reference's stat cards. Each digit is a 0–9 strip that stops
 * at its value, later digits landing a beat after earlier ones.
 */
export default function Odometer({ value, className }: { value: number | string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReduce();
  const chars = String(value).split("");

  return (
    <span ref={ref} className={cn("inline-flex leading-none", className)} aria-label={String(value)}>
      {chars.map((c, i) => {
        const d = DIGITS.indexOf(c);
        if (d < 0) {
          return (
            <span key={i} aria-hidden>
              {c}
            </span>
          );
        }
        return (
          <span key={i} aria-hidden className="relative inline-block h-[1em] overflow-hidden">
            <motion.span
              className="flex flex-col"
              initial={{ y: "0em" }}
              animate={{ y: inView || reduce ? `${-d}em` : "0em" }}
              transition={{ duration: reduce ? 0 : 1.4, ease: [0.16, 1, 0.3, 1], delay: reduce ? 0 : i * 0.12 }}
            >
              {DIGITS.map((x) => (
                <span key={x} className="block h-[1em]">
                  {x}
                </span>
              ))}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
