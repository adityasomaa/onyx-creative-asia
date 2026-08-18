"use client";

import { motion } from "framer-motion";
import HeroVideo from "./HeroVideo";
import ScrollArrows from "./ScrollArrows";
import Button from "@/components/ui/Button";
import { STATS } from "@/lib/data";
import { useT } from "@/lib/i18n";

const EASE = [0.76, 0, 0.24, 1] as const;
const ENTER = 0.35;

/**
 * Rebrand 2026 hero.
 *
 * Left-aligned rather than centred, with the headline split across two
 * tones so the studio name reads first and the positioning sits under it
 * in silver. The stats row is the studio's own numbers from STATS, not
 * the placeholder figures in the design mockup.
 */
export default function Hero() {
  const t = useT();

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-ink text-bone">
      <HeroVideo />
      {/* The video is the architectural plate from the reference, so it is
          pushed right and faded into the ink on its left edge, letting the
          copy column sit on flat black rather than over moving footage. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-ink via-ink/85 to-ink/20 md:via-ink/70 md:to-transparent"
      />

      <div className="container-x relative z-10 flex min-h-[100svh] flex-col justify-center py-32">
        <motion.p
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: ENTER }}
          className="text-[10px] uppercase tracking-[0.34em] text-silver md:text-xs"
        >
          {t("Strategy. Creative. Technology. Growth.")}
        </motion.p>

        <motion.h1
          initial={{ y: 28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: EASE, delay: ENTER + 0.12 }}
          className="mt-8 max-w-4xl text-balance text-3xl font-semibold uppercase leading-[1.12] tracking-[0.005em] sm:text-4xl md:text-5xl lg:text-[3.6rem]"
        >
          <span className="block">{t("Onyx Creative Asia,")}</span>
          <span className="block font-normal text-silver">
            {t("all in one digital marketing agency.")}
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: EASE, delay: ENTER + 0.24 }}
          className="mt-8 max-w-lg text-sm leading-relaxed text-platinum/75 md:text-base"
        >
          {t(
            "We help ambitious brands grow with data-driven strategy, creative storytelling, and performance-focused execution. Everything your brand needs to grow, under one roof.",
          )}
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: EASE, delay: ENTER + 0.36 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Button href="/contact" tone="light" square>
            {t("Let's build your growth")}
          </Button>
          <Button href="/works" tone="outlineLight" square>
            {t("See our work")}
          </Button>
        </motion.div>

        {/* Studio numbers. Deliberately the real ones. */}
        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: EASE, delay: ENTER + 0.5 }}
          className="mt-14 flex flex-wrap items-start gap-x-8 gap-y-6 md:mt-20 md:gap-x-12"
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={
                i === 0 ? "pr-8 md:pr-12" : "border-l border-bone/15 pl-8 md:pl-12"
              }
            >
              <dt className="text-2xl font-medium tabular-nums md:text-3xl">
                {s.value}
                {s.suffix}
              </dt>
              <dd className="mt-2 max-w-[7rem] text-[9px] uppercase leading-relaxed tracking-[0.22em] text-silver md:text-[10px]">
                {t(s.label)}
              </dd>
            </div>
          ))}
          <div className="border-l border-bone/15 pl-8 md:pl-12">
            <dt className="text-[9px] uppercase tracking-[0.22em] text-silver md:text-[10px]">
              {t("Across")}
            </dt>
            <dd className="mt-2 text-2xl font-light md:text-3xl">{t("Asia")}</dd>
          </div>
        </motion.dl>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: EASE, delay: ENTER + 0.7 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <ScrollArrows />
      </motion.div>
    </section>
  );
}
