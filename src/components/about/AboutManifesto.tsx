"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const EASE = [0.25, 1, 0.5, 1] as const;

const WORDS = [
  "We design",
  "for the people",
  "who use it,",
  "build for the",
  "teams who",
  "ship it, and",
  "measure what",
  "actually moves.",
];

export default function AboutManifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={ref}
      className="container-x py-32 md:py-48 relative"
    >
      <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-12">
        (Our position)
      </p>

      <h2 className="text-display-sm md:text-display-md font-medium leading-[0.95] tracking-tight text-balance max-w-5xl">
        {WORDS.map((word, i) => (
          <Word
            key={i}
            word={word}
            progress={scrollYProgress}
            range={[i * 0.04, i * 0.04 + 0.18]}
          />
        ))}
      </h2>

      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.4, ease: EASE }}
        style={{ originX: 0 }}
        className="mt-16 h-px w-full bg-ink/30"
      />
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
