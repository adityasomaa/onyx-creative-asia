"use client";

import { motion } from "framer-motion";
import { STATS } from "@/lib/data";

const EASE = [0.25, 1, 0.5, 1] as const;

export default function AboutStats() {
  return (
    <section className="container-x pb-24 md:pb-32 border-t border-hairline pt-20 md:pt-28">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 md:gap-x-12">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: EASE, delay: i * 0.08 }}
            className="border-l border-ink/15 pl-4 md:pl-6"
          >
            <p className="text-display-sm font-medium tracking-tight tabular-nums">
              {stat.value}
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
