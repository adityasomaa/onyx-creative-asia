import type { Metadata } from "next";
import Image from "next/image";
import { PROJECTS } from "@/lib/data";
import Reveal, { RevealText } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Works",
  description:
    "Selected projects across web, paid media, social, and AI systems — built by Onyx Creative Asia.",
};

export default function WorksPage() {
  return (
    <>
      <section className="container-x pt-40 md:pt-52 pb-16 md:pb-24">
        <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-6">
          (Selected works — {new Date().getFullYear()})
        </p>
        <h1 className="text-display-md font-medium leading-[0.92] tracking-tight max-w-5xl text-balance">
          <RevealText text="Brands we've helped" />
          <br />
          <span className="font-light italic">
            <RevealText text="show up & scale up." delay={0.15} />
          </span>
        </h1>
      </section>

      <section className="container-x pb-24 md:pb-32 space-y-24 md:space-y-40">
        {PROJECTS.map((p, i) => (
          <article
            key={p.slug}
            id={p.slug}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-end scroll-mt-32"
          >
            <Reveal
              className={`md:col-span-7 ${i % 2 === 1 ? "md:order-2" : ""}`}
              amount={0.2}
            >
              <div className="relative aspect-[4/3] md:aspect-[16/11] overflow-hidden bg-ink/5 group">
                <Image
                  src={p.cover}
                  alt={`${p.client} — ${p.title}`}
                  fill
                  sizes="(min-width: 768px) 60vw, 100vw"
                  className="object-cover transition-transform duration-[1400ms] ease-out-expo group-hover:scale-[1.04]"
                />
              </div>
            </Reveal>

            <Reveal className="md:col-span-5" delay={0.1} amount={0.3}>
              <div className="flex items-center gap-4 text-xs uppercase tracking-[0.25em] opacity-60 mb-4">
                <span className="tabular-nums">
                  {String(i + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
                </span>
                <span className="h-px flex-1 bg-ink/20" />
                <span>{p.year}</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-medium tracking-tight leading-[0.95]">
                {p.client}
              </h2>
              <p className="mt-3 text-lg md:text-xl font-light italic text-ink/70">
                {p.title}
              </p>
              <p className="mt-6 text-base leading-relaxed text-ink/75 max-w-md">
                {p.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs uppercase tracking-[0.18em] border border-ink/20 rounded-full px-3 py-1"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
          </article>
        ))}
      </section>
    </>
  );
}
