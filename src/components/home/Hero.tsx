"use client";

import { motion } from "framer-motion";
import { useIntroState } from "@/lib/intro";

const EASE = [0.76, 0, 0.24, 1] as const;

export default function Hero() {
  const introState = useIntroState();
  const ENTER_DELAY = introState === true ? 2.6 : 0.2;
  const ready = introState !== null;

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-end pb-12 md:pb-20 pt-32 md:pt-40 container-x overflow-hidden">
      {/* Top meta */}
      <div className="absolute top-24 md:top-28 left-0 right-0 container-x flex flex-col md:flex-row justify-between text-xs uppercase tracking-[0.25em] gap-2">
        <motion.span
          initial={{ y: 20, opacity: 0 }}
          animate={ready ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ duration: 1, ease: EASE, delay: ENTER_DELAY }}
          className="opacity-70"
        >
          (Independent studio — Asia)
        </motion.span>
        <motion.span
          initial={{ y: 20, opacity: 0 }}
          animate={ready ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ duration: 1, ease: EASE, delay: ENTER_DELAY + 0.05 }}
          className="opacity-70"
        >
          {`(${new Date().getFullYear()} — Always shipping)`}
        </motion.span>
      </div>

      {/* Main headline */}
      <h1 className="text-display-lg font-medium leading-[0.88] tracking-tight text-balance">
        <Line ready={ready} delay={ENTER_DELAY + 0.1}>Brand, performance,</Line>
        <Line ready={ready} delay={ENTER_DELAY + 0.18} italic>
          and AI systems
        </Line>
        <Line ready={ready} delay={ENTER_DELAY + 0.26}>for ambitious teams.</Line>
      </h1>

      {/* Sub copy */}
      <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={ready ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ duration: 1, ease: EASE, delay: ENTER_DELAY + 0.55 }}
          className="md:col-span-5 md:col-start-7 text-base md:text-lg leading-relaxed text-ink/70 max-w-md"
        >
          Onyx Creative Asia builds the digital surface, the growth engine, and
          the automation layer — under one roof, with one team that actually
          ships.
        </motion.p>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, ease: EASE, delay: ENTER_DELAY + 0.8 }}
        className="mt-16 flex items-center gap-3 text-xs uppercase tracking-[0.25em] opacity-70"
      >
        <span className="h-px w-10 bg-ink" />
        <span>Scroll to explore</span>
      </motion.div>
    </section>
  );
}

function Line({
  children,
  delay,
  italic = false,
  ready,
}: {
  children: React.ReactNode;
  delay: number;
  italic?: boolean;
  ready: boolean;
}) {
  return (
    <span className="block reveal-mask">
      <motion.span
        initial={{ y: "110%" }}
        animate={ready ? { y: "0%" } : { y: "110%" }}
        transition={{ duration: 1.1, ease: EASE, delay }}
        className={`inline-block ${italic ? "font-light italic" : ""}`}
      >
        {children}
      </motion.span>
    </span>
  );
}
