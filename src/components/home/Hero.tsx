"use client";

import { motion } from "framer-motion";
import HeroVideo from "./HeroVideo";
import HeroImageTrail from "./HeroImageTrail";
import { PROJECTS } from "@/lib/data";

const EASE = [0.76, 0, 0.24, 1] as const;
const ENTER = 0.35;

// The trail cycles every project's cover. Swapping a project's `cover` for
// a real client screenshot updates the hero with no change here.
const TRAIL_IMAGES = PROJECTS.map((p) => p.cover);

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-ink text-bone">
      <HeroVideo />
      <HeroImageTrail images={TRAIL_IMAGES} />

      <div className="container-x relative z-10 flex min-h-[100svh] flex-col items-center justify-center py-32 text-center">
        <motion.p
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: ENTER }}
          className="text-xs uppercase tracking-[0.3em] text-bone/70 md:text-sm"
        >
          Onyx Creative Asia
        </motion.p>

        <motion.h1
          initial={{ y: 28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: EASE, delay: ENTER + 0.12 }}
          className="mt-6 max-w-5xl text-balance text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Your one stop business development digital solution
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: EASE, delay: ENTER + 0.24 }}
          className="mt-8 max-w-2xl text-balance text-base leading-relaxed text-bone/80 md:text-lg"
        >
          We help your business grow digitally, the correct way. Everything you
          need, everything you will ever look for to grow digitally, we have it
          all.
        </motion.p>

        {/* Wordless scroll cue, so the copy above stays exactly as specified. */}
        <motion.span
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: EASE, delay: ENTER + 0.6 }}
          className="absolute bottom-10 left-1/2 h-10 w-px -translate-x-1/2 bg-gradient-to-b from-bone/60 to-transparent"
        />
      </div>
    </section>
  );
}
