import type { Metadata } from "next";
import { SERVICES } from "@/lib/data";
import Reveal, { RevealText } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Web development, paid media (Google/Meta/TikTok), social media, and AI systems — under one roof.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="container-x pt-40 md:pt-52 pb-16 md:pb-24">
        <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-6">
          (Capabilities)
        </p>
        <h1 className="text-display-md font-medium leading-[0.92] tracking-tight max-w-5xl text-balance">
          <RevealText text="Four disciplines." />
          <br />
          <span className="font-light italic">
            <RevealText text="One studio." delay={0.15} />
          </span>
        </h1>
        <p className="mt-10 max-w-xl text-lg text-ink/70 leading-relaxed">
          We don&apos;t hand work between five vendors. The team that builds
          your site is the same team running your ads and shipping the AI
          agent. Less hand-off, sharper execution.
        </p>
      </section>

      <section className="container-x pb-24 md:pb-32 space-y-24 md:space-y-32 border-t border-hairline pt-20">
        {SERVICES.map((s) => (
          <article
            key={s.id}
            id={s.id}
            className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 scroll-mt-32"
          >
            <Reveal className="md:col-span-4">
              <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-3 tabular-nums">
                {s.number} / 04
              </p>
              <h2 className="text-display-sm font-medium leading-[0.95] tracking-tight">
                {s.title}
              </h2>
              <p className="mt-4 text-lg font-light italic text-ink/70 max-w-sm">
                {s.short}
              </p>
            </Reveal>

            <Reveal className="md:col-span-8 md:col-start-6" delay={0.15}>
              <p className="text-xl md:text-2xl leading-snug text-ink/85 max-w-2xl text-balance">
                {s.description}
              </p>

              <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-8 border-t border-hairline">
                {s.capabilities.map((c) => (
                  <li
                    key={c}
                    className="border-b border-hairline py-4 flex items-baseline gap-3 text-base"
                  >
                    <span className="text-xs opacity-50 tabular-nums">→</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </article>
        ))}
      </section>
    </>
  );
}
