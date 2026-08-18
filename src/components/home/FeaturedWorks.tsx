import Link from "next/link";
import { PROJECTS } from "@/lib/data";
import Reveal from "@/components/Reveal";
import ProjectCover from "@/components/ProjectCover";
import { T } from "@/lib/i18n";

/**
 * Rebrand 2026: the selected-work row from the reference. Kicker and
 * headline on the left, "view all" on the right, then a run of cards
 * where the cover sits on a graphite panel with the client name and the
 * discipline underneath.
 */
export default function FeaturedWorks() {
  const items = PROJECTS.slice(0, 4);

  return (
    <section className="bg-ink text-bone">
      <div className="container-x border-t border-hairline-light py-24 md:py-32">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-silver">
                <T>Selected work</T>
              </p>
              <h2 className="mt-5 max-w-2xl text-2xl font-semibold uppercase leading-tight tracking-[0.01em] md:text-4xl">
                <T>Digital solutions that drive growth.</T>
              </h2>
            </div>
            <Link
              href="/works"
              data-cursor="hover"
              className="group inline-flex items-center gap-3 border-b border-bone/30 pb-2 text-[10px] uppercase tracking-[0.22em] text-platinum transition-colors hover:border-bone hover:text-bone"
            >
              <T>View all work</T>
              <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </Reveal>

        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 md:mt-16">
          {items.map((p, i) => (
            <li key={p.slug}>
              <Reveal delay={i * 0.06}>
                <Link
                  href={`/works/${p.slug}`}
                  data-cursor="hover"
                  className="group block bg-graphite/60 p-3 transition-colors duration-500 hover:bg-graphite"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-ink">
                    <ProjectCover
                      src={p.cover}
                      loop={p.coverLoop}
                      alt={`${p.client}, ${p.title}`}
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <div className="flex items-end justify-between gap-3 px-1 pb-1 pt-4">
                    <div>
                      <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em]">
                        {p.client}
                      </h3>
                      <p className="mt-1.5 text-[11px] text-silver/80">
                        <T>{p.category}</T>
                      </p>
                    </div>
                    <span
                      aria-hidden
                      className="shrink-0 text-sm text-silver transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bone"
                    >
                      ↗
                    </span>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
