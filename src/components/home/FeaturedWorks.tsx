"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PROJECTS } from "@/lib/data";
import Reveal, { RevealText } from "@/components/Reveal";
import WorkCard from "@/components/works/WorkCard";
import { useT } from "@/lib/i18n";

const EASE = [0.25, 1, 0.5, 1] as const;

export default function FeaturedWorks() {
  const items = PROJECTS.slice(0, 4);
  const t = useT();

  return (
    <section className="container-x py-24 md:py-32 border-t border-hairline">
      <div className="flex items-end justify-between mb-12 md:mb-16">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-4">
            {t("(Selected works)")}
          </p>
          <h2 className="text-display-sm font-medium leading-[0.95] tracking-tight max-w-2xl text-balance">
            <RevealText text="Brands we've helped scale." />
          </h2>
        </div>
        <Reveal className="hidden md:block" delay={0.2}>
          <Link
            href="/works"
            className="text-sm border-b border-ink/40 hover:border-ink pb-1 transition-colors"
          >
            {t("All works")} →
          </Link>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {items.map((p, i) => (
          <motion.div
            key={p.slug}
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: EASE, delay: (i % 2) * 0.1 }}
            // Tidy 2-col masonry: right column (odd index) sits lower so
            // the grid has editorial rhythm while every card stays the
            // same uniform 16:9.
            className={i % 2 === 1 ? "md:mt-16" : ""}
          >
            <WorkCard project={p} sizes="(min-width: 768px) 50vw, 100vw" />
          </motion.div>
        ))}
      </div>

      <div className="mt-12 md:hidden text-center">
        <Link
          href="/works"
          className="inline-block text-sm border-b border-ink/40 hover:border-ink pb-1"
        >
          {t("All works")} →
        </Link>
      </div>
    </section>
  );
}
