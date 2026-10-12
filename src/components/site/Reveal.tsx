"use client";

import { motion } from "framer-motion";
import { useReduce } from "./useReduce";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Rise-and-fade on first sight. Reduced motion renders it in place. */
export default function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "span";
}) {
  const reduce = useReduce();
  const M = motion[as];
  if (reduce) return <M className={className}>{children}</M>;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </M>
  );
}
