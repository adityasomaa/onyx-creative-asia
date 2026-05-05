"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { PROJECTS } from "@/lib/data";
import Reveal, { RevealText } from "@/components/Reveal";

const EASE = [0.25, 1, 0.5, 1] as const;

export default function FeaturedWorks() {
  const items = PROJECTS.slice(0, 4);

  return (
    <section className="container-x py-24 md:py-32 border-t border-hairline">
      <div className="flex items-end justify-between mb-12 md:mb-16">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-4">
            (Selected works)
          </p>
          <h2 className="text-display-sm font-medium leading-[0.95] tracking-tight max-w-2xl text-balance">
            <RevealText text="A small group of brave brands." />
          </h2>
        </div>
        <Reveal className="hidden md:block" delay={0.2}>
          <Link
            href="/works"
            className="text-sm border-b border-ink/40 hover:border-ink pb-1 transition-colors"
          >
            All works →
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
            className={i % 3 === 0 ? "md:mt-0" : i % 3 === 1 ? "md:mt-16" : ""}
          >
            <Link
              href={`/works/${p.slug}`}
              className="group block"
              data-cursor="hover"
            >
              <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-ink/5">
                <Image
                  src={p.cover}
                  alt={`${p.client} — ${p.title}`}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  quality={90}
                  className="object-cover grayscale contrast-[1.05] transition-[filter,transform] duration-[1200ms] ease-out-expo group-hover:grayscale-0 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors duration-700" />
              </div>
              <div className="flex items-baseline justify-between mt-4 md:mt-5 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] opacity-60">
                    {p.category} — {p.year}
                  </p>
                  <h3 className="mt-2 text-xl md:text-2xl font-medium tracking-tight">
                    {p.client}
                    <span className="font-light italic text-ink/60">, {p.title.toLowerCase()}</span>
                  </h3>
                </div>
                <span
                  aria-hidden
                  className="text-2xl transition-transform duration-700 ease-out-expo group-hover:translate-x-2 group-hover:-translate-y-1"
                >
                  ↗
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 md:hidden text-center">
        <Link
          href="/works"
          className="inline-block text-sm border-b border-ink/40 hover:border-ink pb-1"
        >
          All works →
        </Link>
      </div>
    </section>
  );
}
