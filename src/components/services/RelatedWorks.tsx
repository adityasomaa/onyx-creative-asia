"use client";

import { motion } from "framer-motion";
import { getProjectsForService } from "@/lib/data";
import WorkCard from "@/components/works/WorkCard";

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
            <WorkCard
              project={p}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
