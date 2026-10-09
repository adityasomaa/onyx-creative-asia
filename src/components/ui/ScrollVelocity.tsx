"use client";

/**
 * Text rows that drift sideways and speed up with scroll velocity.
 *
 * Adapted from componentry.dev "scroll-based-velocity"
 * (MIT License, Copyright (c) 2026 Harsh Jadhav).
 *
 * Changes for Onyx:
 *   - prefers-reduced-motion renders one still line instead of two
 *     moving rows
 *   - the frame loop idles while the band is off screen
 *   - the repeated copies are aria-hidden, with one readable copy for
 *     screen readers, so the text is announced once rather than sixteen
 *     times
 *   - each row takes its own class, so the two can differ in weight
 */

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "framer-motion";
import { cn } from "@/lib/cn";

/** The wrap range is one copy wide, so it must match the copy count. */
const COPIES = 8;

function Row({
  text,
  baseVelocity,
  className,
}: {
  text: string;
  baseVelocity: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "100px" });
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });
  const x = useTransform(baseX, (v) => `${wrap(-100 / COPIES, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (!inView) return;
    let moveBy = direction.current * baseVelocity * (delta / 1000);

    // Scrolling up reverses the drift; scrolling down restores it.
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;

    moveBy += direction.current * moveBy * factor;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div ref={ref} className="flex overflow-hidden whitespace-nowrap" aria-hidden>
      <motion.div className={cn("flex whitespace-nowrap", className)} style={{ x }}>
        {Array.from({ length: COPIES }).map((_, i) => (
          <span key={i} className="block pr-[0.35em]">
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function ScrollVelocity({
  text,
  velocity = 3,
  className,
  rowClassNames = [],
}: {
  text: string;
  /** Base drift in percent of one copy per second. */
  velocity?: number;
  className?: string;
  /** Per-row classes, applied in order to the first and second row. */
  rowClassNames?: [string?, string?];
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className={cn("overflow-hidden whitespace-nowrap", className)}>
        <p className={rowClassNames[0]}>{text}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <span className="sr-only">{text}</span>
      <Row text={text} baseVelocity={velocity} className={rowClassNames[0]} />
      <Row text={text} baseVelocity={-velocity} className={rowClassNames[1]} />
    </div>
  );
}
