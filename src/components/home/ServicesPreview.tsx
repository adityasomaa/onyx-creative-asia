import Link from "next/link";
import { SERVICES } from "@/lib/data";
import Reveal from "@/components/Reveal";
import ServiceIcon from "./ServiceIcon";
import { T } from "@/lib/i18n";

/**
 * Rebrand 2026: the services row from the reference. Centred kicker and
 * headline, then one bordered card per service on a graphite panel.
 *
 * Seven cards do not divide evenly into a 6-up row, so the grid runs
 * 2 / 4 / 7 and the last card is allowed to span on the middle step
 * rather than leaving a ragged hole.
 */
export default function ServicesPreview() {
  return (
    <section className="bg-ink text-bone">
      <div className="container-x py-24 md:py-32">
        <Reveal>
          <p className="text-center text-[10px] uppercase tracking-[0.32em] text-silver">
            <T>What we do</T>
          </p>
          <h2 className="mt-5 text-center text-2xl font-semibold uppercase tracking-[0.01em] md:text-4xl">
            <T>All services. One standard.</T>
          </h2>
          <span
            aria-hidden
            className="mx-auto mt-6 block h-px w-14 bg-bone/30"
          />
        </Reveal>

        <ul className="mt-14 grid grid-cols-2 gap-px overflow-hidden bg-bone/10 md:mt-16 md:grid-cols-4 lg:grid-cols-7">
          {SERVICES.map((s, i) => (
            <li key={s.id} className="flex bg-ink">
              <Reveal delay={i * 0.05} className="flex w-full">
                <Link
                  href={`/services/${s.id}`}
                  data-cursor="hover"
                  className="group flex h-full flex-col items-center bg-graphite/60 px-4 py-9 text-center transition-colors duration-500 hover:bg-graphite md:px-5 md:py-11"
                >
                  <span className="text-platinum transition-colors duration-500 group-hover:text-bone">
                    <ServiceIcon id={s.id} />
                  </span>
                  <h3 className="mt-6 text-[11px] font-semibold uppercase leading-snug tracking-[0.14em] md:text-xs">
                    <T>{s.title}</T>
                  </h3>
                  <p className="mt-4 text-[11px] leading-relaxed text-silver/85 md:text-xs">
                    <T>{s.short}</T>
                  </p>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
