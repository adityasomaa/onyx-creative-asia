"use client";

import { motion } from "framer-motion";
import HeroVideo from "./HeroVideo";

const EASE = [0.76, 0, 0.24, 1] as const;
// Hold the headline below the mask while the loader covers the page.
const ENTER = 0.4;

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-ink text-bone">
      <HeroVideo />

      <div className="container-x relative z-10 flex min-h-[100svh] flex-col justify-end pb-12 pt-32 md:pb-20 md:pt-40">
        {/* Top meta */}
        <div className="absolute left-0 right-0 top-24 flex flex-col justify-between gap-3 px-6 text-xs uppercase tracking-[0.25em] md:top-28 md:flex-row md:gap-2 md:px-10 lg:px-16">
          <motion.span
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: EASE, delay: ENTER }}
            className="opacity-80"
          >
            (Independent studio — Asia)
          </motion.span>
          <motion.span
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: EASE, delay: ENTER + 0.05 }}
            className="opacity-80"
          >
            {`(${new Date().getFullYear()} — Always shipping)`}
          </motion.span>
        </div>

        {/* Main headline */}
        <h1 className="text-balance text-display-lg font-medium leading-[0.88] tracking-tight">
          <Line delay={ENTER + 0.1}>Brand, performance,</Line>
          <Line delay={ENTER + 0.18} italic>
            and AI systems
          </Line>
          <Line delay={ENTER + 0.26}>for ambitious teams.</Line>
        </h1>

        {/* Sub copy */}
        <div className="mt-20 grid grid-cols-1 items-end gap-8 md:mt-16 md:grid-cols-12">
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: EASE, delay: ENTER + 0.55 }}
            className="max-w-md text-base leading-relaxed text-bone/80 md:col-span-5 md:col-start-7 md:text-lg"
          >
            Onyx Creative Asia builds the digital surface, the growth engine,
            and the automation layer — under one roof, with one team that
            actually ships.
          </motion.p>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: EASE, delay: ENTER + 0.8 }}
          className="mt-16 flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-bone/70"
        >
          <span className="h-px w-10 bg-bone" />
          <span>Scroll to explore</span>
        </motion.div>
      </div>
    </section>
  );
}

function Line({
  children,
  delay,
  italic = false,
}: {
  children: React.ReactNode;
  delay: number;
  italic?: boolean;
}) {
  return (
    <span className="block reveal-mask">
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.1, ease: EASE, delay }}
        className={`inline-block ${italic ? "font-light italic" : ""}`}
      >
        {children}
      </motion.span>
    </span>
  );
}
