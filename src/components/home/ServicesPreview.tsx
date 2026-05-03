"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { SERVICES } from "@/lib/data";
import { RevealText } from "@/components/Reveal";

const EASE = [0.25, 1, 0.5, 1] as const;

export default function ServicesPreview() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section className="bg-ink text-bone py-24 md:py-32 overflow-hidden">
      <div className="container-x">
        <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-4">
          (What we do)
        </p>
        <h2 className="text-display-sm font-medium leading-[0.95] tracking-tight max-w-3xl text-balance">
          <RevealText text="Four disciplines, working as one." />
        </h2>
      </div>

      <div className="mt-12 md:mt-20 border-t border-hairline-light">
        {SERVICES.map((s) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: EASE }}
            onHoverStart={() => setActive(s.id)}
            onHoverEnd={() => setActive(null)}
            className="border-b border-hairline-light"
          >
            <Link
              href={`/services#${s.id}`}
              className="container-x grid grid-cols-12 items-center py-8 md:py-12 group"
              data-cursor="hover"
            >
              <span className="col-span-2 md:col-span-1 text-xs md:text-sm opacity-60 tabular-nums">
                {s.number}
              </span>
              <h3 className="col-span-10 md:col-span-7 text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight transition-transform duration-700 ease-out-expo group-hover:translate-x-2">
                {s.title}
              </h3>
              <p className="hidden md:block md:col-span-3 text-sm opacity-70 max-w-xs">
                {s.short}
              </p>
              <span
                aria-hidden
                className="hidden md:flex md:col-span-1 justify-end text-2xl transition-all duration-700 ease-out-expo group-hover:translate-x-1"
              >
                {active === s.id ? "→" : "+"}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
