"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getProjectsForService } from "@/lib/data";
import ProjectCover from "@/components/ProjectCover";

const EASE = [0.25, 1, 0.5, 1] as const;

/**
 * "Related work" strip for a /services/[slug] page: the case studies that
 * used this discipline. Renders nothing when there are no matching
 * projects yet, so a young service just omits the section.
 */
export default function RelatedWorks({
  serviceSlug,
}: {
  serviceSlug: string;
}) {
  const items = getProjectsForService(serviceSlug);
  if (items.length === 0) return null;

  return (
    <section className="container-x pb-24 md:pb-32 border-t border-hairline pt-16 md:pt-20">
      <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-8">
        Related work
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {items.map((p, i) => (
          <motion.div
            key={p.slug}
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: EASE, delay: (i % 3) * 0.08 }}
          >
            <Link
              href={`/works/${p.slug}`}
              className="group block"
              data-cursor="hover"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-ink">
                <ProjectCover
                  src={p.cover}
                  loop={p.coverLoop}
                  alt={`${p.client}, ${p.title}`}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
                {/* Frosted-glass year chip over the cover. */}
                <div className="absolute right-3 top-3 z-20">
                  <span className="rounded-full bg-white/10 backdrop-blur-md ring-1 ring-white/20 px-2.5 py-1 text-[10px] font-medium tabular-nums tracking-wider text-bone">
                    {p.year}
                  </span>
                </div>
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors duration-700 z-10" />
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] opacity-60">
                    {p.category}, {p.year}
                  </p>
                  <h3 className="mt-1.5 text-lg md:text-xl font-medium tracking-tight">
                    {p.client}
                    <span className="font-light italic text-ink/60">
                      , {p.title.toLowerCase()}
                    </span>
                  </h3>
                </div>
                <span
                  aria-hidden
                  className="text-xl transition-transform duration-700 ease-out-expo group-hover:translate-x-1 group-hover:-translate-y-1"
                >
                  ↗
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
