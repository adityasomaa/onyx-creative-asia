"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useLang } from "@/lib/i18n";

const EASE = [0.25, 1, 0.5, 1] as const;

// The manifesto reveals word-chunk by word-chunk on scroll, so each
// language needs its own chunk array (chunk boundaries differ between
// English and Indonesian). Same number of chunks keeps the reveal
// timing identical.
const WORDS_EN = [
  "We design",
  "for the people",
  "who use it,",
  "build for the",
  "teams who",
  "ship it, and",
  "measure what",
  "actually moves.",
];

const WORDS_ID = [
  "Kami merancang",
  "untuk orang",
  "yang memakainya,",
  "membangun untuk",
  "tim yang",
  "merilisnya, dan",
  "mengukur apa",
  "yang berdampak.",
];

export default function AboutManifesto() {
  const { lang, t } = useLang();
  const words = lang === "id" ? WORDS_ID : WORDS_EN;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={ref}
      className="container-x py-20 md:py-28 relative"
    >
      <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-12">
        {t("(Our position)")}
      </p>

      <h2 className="text-display-sm md:text-display-md font-medium leading-[0.95] tracking-tight text-balance max-w-5xl">
        {words.map((word, i) => (
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
        className="mt-10 md:mt-12 h-px w-full bg-ink/30"
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
