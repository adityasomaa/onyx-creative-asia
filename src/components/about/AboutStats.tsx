"use client";

import { motion } from "framer-motion";
import { STATS } from "@/lib/data";
import Counter from "@/components/ui/Counter";

const EASE = [0.25, 1, 0.5, 1] as const;

/**
 * "Experience" section: a single hairline under the heading, then the
 * record counters that tick up from zero on scroll.
 */
export default function AboutStats() {
  return (
    <section className="container-x pb-24 md:pb-32 pt-16 md:pt-24">
      <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-4">
        Experience
      </p>
      <h2 className="text-display-sm font-medium leading-[0.95] tracking-tight text-balance">
        Our number records
      </h2>

      <div className="mt-10 md:mt-14 border-t border-hairline pt-10 md:pt-14 grid grid-cols-2 md:grid-cols-4 gap-y-10 md:gap-x-12">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE, delay: i * 0.06 }}
          >
            <p className="text-display-sm font-medium tracking-tight">
              <Counter to={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] opacity-60">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
