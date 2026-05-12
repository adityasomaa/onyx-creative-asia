import type { Metadata } from "next";
import Link from "next/link";
import { RevealText } from "@/components/Reveal";
import { INSIGHTS } from "@/lib/insights";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Field notes from the studio — on brand, performance, AI systems, and the work behind them. Long-form essays from Onyx Creative Asia.",
  alternates: { canonical: "/insights" },
  openGraph: {
    title: "Insights — Onyx Creative Asia",
    description:
      "Field notes from the studio — on brand, performance, AI systems, and the work behind them.",
    url: "/insights",
    type: "website",
  },
};

const DATE_FMT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default function InsightsPage() {
  return (
    <>
      <section className="container-x pt-40 md:pt-52 pb-16 md:pb-24">
        <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-6">
          (Insights — field notes)
        </p>
        <h1 className="text-display-md font-medium leading-[0.92] tracking-tight max-w-5xl text-balance">
          <RevealText text="Long-form on brand," />
          <br />
          <span className="font-light italic">
            <RevealText text="performance, and systems." delay={0.15} />
          </span>
        </h1>
        <p className="mt-14 md:mt-10 max-w-xl text-lg text-ink/70 leading-relaxed">
          Pieces about the work — what we ship, what we learned, what we'd do
          differently. We write when the lesson is sharp enough to hand to
          someone else.
        </p>
      </section>

      <section className="container-x pb-24 md:pb-32 border-t border-hairline pt-16 md:pt-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-3">
            <p className="text-xs uppercase tracking-[0.25em] opacity-60">
              ({INSIGHTS.length.toString().padStart(2, "0")} essays)
            </p>
          </div>
          <ul className="md:col-span-8 md:col-start-5 border-t border-hairline">
            {INSIGHTS.map((piece, i) => (
              <li
                key={piece.slug}
                className="border-b border-hairline group"
              >
                <Link
                  href={`/insights/${piece.slug}`}
                  className="py-7 md:py-8 flex items-baseline gap-6 transition-opacity duration-300 hover:opacity-80"
                >
                  <span className="text-xs opacity-50 tabular-nums w-6 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <p className="text-xl md:text-2xl font-medium tracking-tight leading-snug">
                      {piece.title}
                    </p>
                    <p className="mt-3 text-sm text-ink/70 leading-relaxed max-w-2xl">
                      {piece.excerpt}
                    </p>
                    <p className="mt-3 text-xs opacity-60 uppercase tracking-[0.18em] flex items-center gap-3 flex-wrap">
                      <span>{piece.tag}</span>
                      <span aria-hidden>·</span>
                      <span>{piece.readingTimeMin} min read</span>
                      <span aria-hidden>·</span>
                      <span>{DATE_FMT.format(new Date(piece.publishedAt))}</span>
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="text-xs opacity-50 transition-transform duration-500 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-x pb-24 md:pb-32 border-t border-hairline pt-12 md:pt-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <p className="text-lg max-w-md text-ink/80 leading-relaxed">
            Want a heads-up when the next piece lands?
          </p>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3 text-bone transition-transform duration-500 ease-out-expo hover:scale-[1.03] w-fit"
          >
            <span className="text-sm font-medium">Get on the list</span>
            <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
