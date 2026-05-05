import type { Metadata } from "next";
import Link from "next/link";
import { RevealText } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Field notes from the studio — on brand, performance, and AI systems. Long-form coming soon.",
};

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
          someone else. First essays publishing soon.
        </p>
      </section>

      <section className="container-x pb-24 md:pb-32 border-t border-hairline pt-16 md:pt-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-3">
            <p className="text-xs uppercase tracking-[0.25em] opacity-60">
              (What's coming)
            </p>
          </div>
          <ul className="md:col-span-8 md:col-start-5 border-t border-hairline">
            {UPCOMING.map((piece, i) => (
              <li
                key={piece.title}
                className="border-b border-hairline py-6 flex items-baseline gap-6"
              >
                <span className="text-xs opacity-50 tabular-nums w-6 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <p className="text-xl md:text-2xl font-medium tracking-tight">
                    {piece.title}
                  </p>
                  <p className="mt-2 text-sm opacity-60 uppercase tracking-[0.18em]">
                    {piece.tag}
                  </p>
                </div>
                <span className="text-xs opacity-50 uppercase tracking-[0.18em]">
                  Soon
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-x pb-24 md:pb-32 border-t border-hairline pt-12 md:pt-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <p className="text-lg max-w-md text-ink/80 leading-relaxed">
            Want a heads-up when the first piece lands?
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

const UPCOMING = [
  {
    title: "Designing for the spotlight, not the brochure",
    tag: "Web · Motion",
  },
  {
    title: "When AI agents earn their seat at the table",
    tag: "AI Systems",
  },
  {
    title: "Performance creative isn't a different language. It's the same one, faster.",
    tag: "Paid Media",
  },
  {
    title: "Why we shipped a hero video instead of a hero image",
    tag: "Web · Brand",
  },
];
