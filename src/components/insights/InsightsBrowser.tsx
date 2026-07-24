"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { INSIGHTS } from "@/lib/insights";

const EASE = [0.25, 1, 0.5, 1] as const;

// Themed dummy images (verified Unsplash), one per article by index.
const IMAGES = [
  "photo-1497215728101-856f4ea42174",
  "photo-1552664730-d307ca884978",
  "photo-1521737711867-e3b97375f902",
  "photo-1519823551278-64ac92734fb1",
];
const imgUrl = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const DATE_FMT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const primary = (tag: string) => tag.split("·")[0].trim();

export default function InsightsBrowser() {
  const categories = useMemo(
    () => Array.from(new Set(INSIGHTS.map((p) => primary(p.tag)))),
    [],
  );
  const imageFor = useMemo(() => {
    const m: Record<string, string> = {};
    INSIGHTS.forEach((p, i) => (m[p.slug] = IMAGES[i % IMAGES.length]));
    return m;
  }, []);

  const [active, setActive] = useState<string | null>(null);
  const items = active
    ? INSIGHTS.filter((p) => primary(p.tag) === active)
    : INSIGHTS;

  const pill = (on: boolean) =>
    `inline-flex rounded-full border px-4 py-2 text-sm tracking-tight transition-colors duration-300 ${
      on
        ? "border-ink bg-ink text-bone"
        : "border-hairline text-ink/70 hover:border-ink/40"
    }`;

  return (
    <>
      <section className="container-x pb-10 md:pb-12">
        <ul className="flex flex-wrap gap-2">
          <li>
            <button
              type="button"
              onClick={() => setActive(null)}
              className={pill(active === null)}
            >
              All
            </button>
          </li>
          {categories.map((c) => (
            <li key={c}>
              <button
                type="button"
                onClick={() => setActive(c)}
                className={pill(active === c)}
              >
                {c}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-x pb-24 md:pb-32 border-t border-hairline pt-12 md:pt-16">
        <AnimatePresence mode="wait">
          <motion.ul
            key={active ?? "all"}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
          >
            {items.map((piece) => (
              <li key={piece.slug}>
                <Link
                  href={`/insights/${piece.slug}`}
                  className="group block"
                  data-cursor="hover"
                >
                  <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-ink">
                    <Image
                      src={imgUrl(imageFor[piece.slug])}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-[1.03]"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-bone/90 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-ink">
                      {piece.tag}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-[0.18em] opacity-55 flex items-center gap-2">
                      <span>{piece.readingTimeMin} min read</span>
                      <span aria-hidden>·</span>
                      <span>{DATE_FMT.format(new Date(piece.publishedAt))}</span>
                    </p>
                    <h3 className="mt-2 text-lg md:text-xl font-medium tracking-tight leading-snug">
                      {piece.title}
                    </h3>
                    <p className="mt-2 text-sm text-ink/65 leading-relaxed line-clamp-2">
                      {piece.excerpt}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </section>
    </>
  );
}
