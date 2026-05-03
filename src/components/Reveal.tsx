"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef, type ReactNode } from "react";

const EASE = [0.25, 1, 0.5, 1] as const;

const variants: Variants = {
  hidden: { y: 30, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.9, ease: EASE },
  },
};

export default function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
  amount = 0.2,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "p" | "h1" | "h2" | "h3";
  amount?: number | "some" | "all";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount, margin: "0px 0px -10% 0px" });
  const MotionTag = motion[Tag] as typeof motion.div;
  return (
    <MotionTag
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealText({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, {
    once: true,
    amount: "some",
    margin: "0px 0px -5% 0px",
  });
  const words = text.split(" ");

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="reveal-mask align-bottom mr-[0.25em]">
          <motion.span
            initial={{ y: "110%" }}
            animate={inView ? { y: "0%" } : { y: "110%" }}
            transition={{ duration: 0.9, ease: EASE, delay: delay + i * 0.05 }}
            className="inline-block will-change-transform"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
