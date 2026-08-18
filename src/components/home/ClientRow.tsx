import { PROJECTS } from "@/lib/data";
import Reveal from "@/components/Reveal";
import { T } from "@/lib/i18n";

/**
 * "Trusted by" row.
 *
 * The reference mockup fills this with invented brands. These are the real
 * clients, read off PROJECTS so the row cannot drift from the case studies,
 * and set as type rather than as logo files: we do not hold usable logo
 * artwork for every one of them, and a row of mismatched scraped PNGs
 * looks worse than a clean typographic run.
 */
export default function ClientRow() {
  const names = PROJECTS.map((p) => p.client);

  return (
    <section className="bg-ink text-bone">
      <div className="container-x border-t border-hairline-light py-16 md:py-20">
        <Reveal>
          <p className="text-center text-[10px] uppercase tracking-[0.32em] text-silver">
            <T>Trusted by ambitious brands</T>
          </p>
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:mt-12 md:gap-x-16">
            {names.map((n) => (
              <li
                key={n}
                className="text-xs uppercase tracking-[0.2em] text-platinum/55 transition-colors duration-500 hover:text-bone md:text-sm"
              >
                {n}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
