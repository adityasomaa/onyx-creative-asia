"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { PROJECTS, SERVICES, getProjectsForService } from "@/lib/data";
import WorkCard from "@/components/works/WorkCard";

const EASE = [0.25, 1, 0.5, 1] as const;

/**
 * Works listing with a client-side service filter. Selecting a filter
 * updates the grid in place (no navigation, no scroll-to-top) and fades
 * the results in. The URL is kept in sync via replaceState so a filtered
 * view is still shareable and deep links from work-card tags land right.
 */
export default function WorksBrowser({
  initialService,
}: {
  initialService?: string;
}) {
  const valid =
    initialService && SERVICES.some((s) => s.id === initialService)
      ? initialService
      : null;
  const [active, setActive] = useState<string | null>(valid);

  const projects = active ? getProjectsForService(active) : PROJECTS;

  function select(id: string | null) {
    setActive(id);
    const url = id ? `/works?service=${id}` : "/works";
    window.history.replaceState(null, "", url);
  }

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
              onClick={() => select(null)}
              className={pill(active === null)}
            >
              All work
            </button>
          </li>
          {SERVICES.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => select(s.id)}
                className={pill(active === s.id)}
              >
                {s.title}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-x pb-24 md:pb-32 border-t border-hairline pt-12 md:pt-16">
        <AnimatePresence mode="wait">
          {projects.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="text-lg text-ink/70 max-w-lg"
            >
              No work under{" "}
              {SERVICES.find((s) => s.id === active)?.title ?? "this filter"}{" "}
              yet.{" "}
              <button
                type="button"
                onClick={() => select(null)}
                className="border-b border-ink/40 hover:border-ink"
              >
                See all work
              </button>
              .
            </motion.p>
          ) : (
            <motion.ul
              key={active ?? "all"}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-x-8 md:gap-y-16"
            >
              {projects.map((p, i) => (
                <li key={p.slug} className={i % 2 === 1 ? "md:mt-16" : ""}>
                  <WorkCard project={p} sizes="(min-width: 768px) 50vw, 100vw" />
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </section>

      {/* Hidden crawlable links so every filtered view is still indexable. */}
      <div className="sr-only" aria-hidden>
        {SERVICES.map((s) => (
          <Link key={s.id} href={`/works?service=${s.id}`}>
            {s.title}
          </Link>
        ))}
      </div>
    </>
  );
}
