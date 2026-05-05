"use client";

import { motion } from "framer-motion";
import { TESTIMONIALS } from "@/lib/data";
import Reveal, { RevealText } from "@/components/Reveal";

const EASE = [0.25, 1, 0.5, 1] as const;

export default function Testimonials() {
  const hasItems = TESTIMONIALS.length > 0;

  return (
    <section className="container-x py-24 md:py-32 border-t border-hairline">
      <div className="flex items-end justify-between mb-12 md:mb-16 gap-6 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-4">
            (Testimonials)
          </p>
          <h2 className="text-display-sm font-medium leading-[0.95] tracking-tight max-w-3xl text-balance">
            <RevealText text="Words from the work." />
          </h2>
        </div>
      </div>

      {hasItems ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.author + t.client}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease: EASE, delay: (i % 2) * 0.1 }}
              className="border-t border-hairline pt-8"
            >
              <blockquote className="text-2xl md:text-3xl font-medium leading-snug tracking-tight text-balance">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 text-sm flex items-baseline gap-3 flex-wrap">
                <span className="font-medium">{t.author}</span>
                <span className="opacity-50">·</span>
                <span className="opacity-70">{t.role}</span>
                <span className="opacity-50">·</span>
                <span className="opacity-70 italic">{t.client}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      ) : (
        <Reveal>
          <div className="border-t border-hairline pt-12 md:pt-16">
            <p className="text-2xl md:text-3xl font-light italic leading-snug tracking-tight max-w-3xl text-balance text-ink/60">
              &ldquo;Real client words shipping soon. The work earns them — we
              don't write them ourselves.&rdquo;
            </p>
            <p className="mt-6 text-xs uppercase tracking-[0.25em] opacity-60">
              (Pending — first quotes coming with the next case-study round)
            </p>
          </div>
        </Reveal>
      )}
    </section>
  );
}
