"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Button from "@/components/ui/Button";
import { useT } from "@/lib/i18n";

// Word-chunk scroll reveal. The phrase is translated first, then split on
// spaces so the per-word stagger applies to the active-locale copy (for
// CN/JP with no spaces it simply reveals as one chunk).
const HEADLINE = "One team for everything your business needs online.";

export default function AboutPreview() {
  const t = useT();
  const words = t(HEADLINE).split(" ");
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <section ref={ref} className="bg-ink text-bone">
      <div className="container-x py-24 md:py-32 border-t border-hairline-light">
      <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-6 md:mb-12">
        {t("About")}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-end">
        <h2 className="md:col-span-9 text-2xl sm:text-4xl md:text-5xl lg:text-display-md font-medium leading-[1.02] tracking-tight text-balance">
          {words.map((word, i) => (
            <Word
              key={i}
              word={word}
              progress={scrollYProgress}
              range={[i * 0.025 + 0.05, i * 0.025 + 0.18]}
            />
          ))}
        </h2>

        <div className="md:col-span-3 md:pl-4">
          <p className="mb-6 text-base leading-relaxed text-bone/70">
            {t(
              "An independent studio in Bali running every digital service your business needs, from one team, under one roof.",
            )}
          </p>
          <Button href="/about" tone="light">
            More about us
          </Button>
        </div>
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
    <motion.span style={{ opacity }} className="mr-[0.18em] inline-block">
      {word}
    </motion.span>
  );
}
