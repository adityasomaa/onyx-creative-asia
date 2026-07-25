"use client";

import { motion } from "framer-motion";
import HeroVideo from "./HeroVideo";
import HeroTextTrail from "./HeroTextTrail";
import ScrollArrows from "./ScrollArrows";
import Button from "@/components/ui/Button";
import { useT } from "@/lib/i18n";

const EASE = [0.76, 0, 0.24, 1] as const;
const ENTER = 0.35;

function discover() {
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number) => void } })
    .__lenis;
  const target = window.innerHeight;
  if (lenis) lenis.scrollTo(target);
  else window.scrollTo({ top: target, behavior: "smooth" });
}

export default function Hero() {
  const t = useT();
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-ink text-bone">
      <HeroVideo />
      <HeroTextTrail />

      <div className="container-x relative z-10 flex min-h-[100svh] flex-col items-center justify-center py-32 text-center">
        <motion.p
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: ENTER }}
          className="text-xs uppercase tracking-[0.3em] text-bone/70 md:text-sm"
        >
          {t("Onyx Creative Asia")}
        </motion.p>

        <motion.h1
          initial={{ y: 28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: EASE, delay: ENTER + 0.12 }}
          className="mt-6 max-w-5xl text-balance text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {t("Your One Stop Business Development Digital Solution")}
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: EASE, delay: ENTER + 0.24 }}
          className="mt-8 max-w-2xl text-balance text-base leading-relaxed text-bone/80 md:text-lg"
        >
          {t(
            "We help your business grow digitally, the correct way. Everything you need, everything you will ever look for to grow digitally, we have it all.",
          )}
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: EASE, delay: ENTER + 0.36 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button href="/contact" tone="light">
            Start a project
          </Button>
          <Button onClick={discover} tone="outlineLight" arrow={false}>
            Discover
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: EASE, delay: ENTER + 0.7 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ScrollArrows />
        </motion.div>
      </div>
    </section>
  );
}
