"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const WORDS = [
  "An",
  "independent",
  "studio",
  "in Bali —",
  "building",
  "brands,",
  "performance,",
  "and AI",
  "systems",
  "for ambitious",
  "teams who",
  "ship.",
];

export default function AboutPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <section ref={ref} className="container-x py-24 md:py-32 border-t border-hairline">
      <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-8 md:mb-12">
        (About — the studio)
      </p>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-end">
        <h2 className="md:col-span-9 text-display-sm md:text-display-md font-medium leading-[0.95] tracking-tight text-balance">
          {WORDS.map((word, i) => (
            <Word
              key={i}
              word={word}
              progress={scrollYProgress}
              range={[i * 0.025 + 0.05, i * 0.025 + 0.18]}
            />
          ))}
        </h2>

        <div className="md:col-span-3 md:pl-4">
          <Link
            href="/about"
            className="group inline-flex items-center gap-3 text-sm border-b border-ink/40 hover:border-ink pb-1 transition-colors"
          >
            More about us
            <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Word({
  word,
  progress,
  range,
}: {
  word: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">
      {word}
    </motion.span>
  );
}
