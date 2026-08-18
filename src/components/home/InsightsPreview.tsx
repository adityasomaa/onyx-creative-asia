import Link from "next/link";
import Image from "next/image";
import { INSIGHTS } from "@/lib/insights";
import Reveal from "@/components/Reveal";
import { T } from "@/lib/i18n";

const DATE_FMT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/**
 * Rebrand 2026: the insights row from the reference. Headline and the
 * "view all" link stack on the left, three of the newest articles run
 * across the right.
 */
export default function InsightsPreview() {
  const items = [...INSIGHTS]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 3);

  return (
    <section className="bg-ink text-bone">
      <div className="container-x border-t border-hairline-light py-24 md:py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-4">
            <p className="text-[10px] uppercase tracking-[0.32em] text-silver">
              <T>Insights</T>
            </p>
            <h2 className="mt-5 text-2xl font-semibold uppercase leading-tight tracking-[0.01em] md:text-4xl">
              <T>Ideas, trends, and strategies.</T>
            </h2>
            <Link
              href="/insights"
              data-cursor="hover"
              className="group mt-8 inline-flex items-center gap-3 border-b border-bone/30 pb-2 text-[10px] uppercase tracking-[0.22em] text-platinum transition-colors hover:border-bone hover:text-bone"
            >
              <T>View all insights</T>
              <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </Reveal>

          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:col-span-8">
            {items.map((piece, i) => (
              <li key={piece.slug}>
                <Reveal delay={i * 0.06}>
                  <Link
                    href={`/insights/${piece.slug}`}
                    data-cursor="hover"
                    className="group block h-full bg-graphite/60 transition-colors duration-500 hover:bg-graphite"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-ink">
                      <Image
                        src={piece.cover}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 100vw"
                        className="object-cover grayscale transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-[9px] uppercase tracking-[0.24em] text-silver">
                        <T>{piece.category}</T>
                      </p>
                      <h3 className="mt-3 text-[13px] font-medium leading-snug">
                        <T>{piece.title}</T>
                      </h3>
                      <p className="mt-4 text-[10px] uppercase tracking-[0.16em] text-silver/70">
                        {DATE_FMT.format(new Date(piece.publishedAt))}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
