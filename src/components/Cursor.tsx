"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const sx = useSpring(x, { stiffness: 350, damping: 30, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 350, damping: 30, mass: 0.5 });

  useEffect(() => {
    const supportsHover = window.matchMedia("(hover: hover)").matches;
    if (!supportsHover) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const enter = (e: Event) => {
      const t = e.target as HTMLElement;
      if (t.closest("a, button, [data-cursor='hover']")) {
        setHovering(true);
      }
    };
    const leave = (e: Event) => {
      const t = e.target as HTMLElement;
      if (t.closest("a, button, [data-cursor='hover']")) {
        setHovering(false);
      }
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", enter);
    document.addEventListener("mouseout", leave);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", enter);
      document.removeEventListener("mouseout", leave);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[150] mix-blend-difference"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        animate={{
          width: hovering ? 56 : 12,
          height: hovering ? 56 : 12,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-bone"
      />
    </motion.div>
  );
}
