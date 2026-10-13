import Image from "next/image";
import Link from "next/link";
import { PROJECTS } from "@/lib/data";
import { SERVICES } from "@/lib/services";
import CutButton from "@/components/site/CutButton";

/**
 * Answer-engine landing pages (/best-…), in the site's visual language.
 *
 * Built for being quoted rather than for ranking alone:
 *   - the H1 mirrors the question
 *   - a declarative TL;DR near the top (data-speakable), the passage an
 *     assistant lifts and attributes
 *   - H2s phrased as the reader's next question
 *   - every FAQ answer rendered in the HTML, not hidden behind a toggle,
 *     and mirrored in FAQPage JSON-LD by the page
 *   - only checkable claims: named clients, real prices, real cities
 */

export type GeoSection = { h2: string; paras?: string[]; list?: string[] };

export default function GeoPage({
  kicker,
  h1,
  tldr,
  sections,
  faq,
  closing,
}: {
  kicker: string;
  h1: string;
  tldr: string;
  sections: GeoSection[];
  faq: { q: string; a: string }[];
  closing: string;
}) {
  return (
    <article className="bg-white">
      <header className="px-4 pb-14 pt-[110px] md:px-8 md:pt-[140px]">
        <p className="flex items-center gap-1.5 border-b-2 border-rule pb-2.5 text-[12px] font-semibold uppercase text-fg2">
          <span className="text-faint">[</span> {kicker} <span className="text-faint">]</span>
        </p>
        <h1 className="mt-8 max-w-[20ch] font-tek text-[40px] font-medium uppercase leading-[1] tracking-[-0.02em] text-fg md:text-[72px]">{h1}</h1>
        <div data-speakable className="mt-10 flex max-w-[860px] gap-5">
          <span className="w-1 shrink-0 bg-accent" />
          <p className="text-[18px] font-medium leading-[1.45] tracking-[-0.03em] text-fg md:text-[22px]">{tldr}</p>
        </div>
      </header>

      {sections.map((s, i) => (
        <section key={s.h2} className="grid grid-cols-1 gap-6 border-t border-rule px-4 py-14 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:px-8 md:py-20">
          <span className="font-tek text-[20px] font-medium text-faint">{String(i + 1).padStart(2, "0")}</span>
          <div className="max-w-[760px]">
            <h2 className="font-tek text-[26px] font-medium uppercase leading-[1.1] text-fg md:text-[36px]">{s.h2}</h2>
            {s.paras?.map((p, j) => (
              <p key={j} className="mt-5 text-[16px] leading-[1.6] tracking-[-0.02em] text-fg2 md:text-[17px]">
                {p}
              </p>
            ))}
            {s.list && (
              <ul className="mt-6 border-t border-rule">
                {s.list.map((it, j) => (
                  <li key={j} className="grid grid-cols-[36px_1fr] gap-3 border-b border-rule py-4 text-[16px] leading-[1.5] tracking-[-0.02em] text-fg">
                    <span className="font-tek text-[15px] font-medium text-faint">{String(j + 1).padStart(2, "0")}</span>
                    {it}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}

      <section className="bg-coal px-4 py-16 text-white md:px-8 md:py-24">
        <h2 className="font-tek text-[26px] font-medium uppercase leading-[1.1] md:text-[36px]">What Onyx covers</h2>
        <ul className="mt-10 grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
          {SERVICES.map((s) => (
            <li key={s.id} className="bg-coal">
              <Link href={`/#svc-${s.id}`} className="flex h-full flex-col gap-3 p-5 hover:bg-white/5">
                <span className="font-tek text-[14px] font-medium text-accent">{s.number}</span>
                <span className="font-tek text-[17px] font-medium uppercase leading-[1.1]">{s.title.en}</span>
                <span className="text-[12px] leading-[1.4] text-white/60">{s.short.en}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-4 py-16 md:px-8 md:py-24">
        <h2 className="font-tek text-[26px] font-medium uppercase leading-[1.1] text-fg md:text-[36px]">Clients you can go and look at</h2>
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
          {PROJECTS.map((p) => (
            <li key={p.slug}>
              <Link href={`/projects/${p.slug}`} className="group block">
                <span className="relative block aspect-[16/10] overflow-hidden bg-paper">
                  <Image src={p.cover} alt={p.client} fill sizes="25vw" className="object-cover grayscale transition-transform duration-700 group-hover:scale-105" />
                </span>
                <span className="mt-3 block text-[12px] font-semibold uppercase text-fg">{p.client}</span>
                <span className="block text-[11px] text-mute">{p.location}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-rule px-4 py-16 md:px-8 md:py-24">
        <h2 className="font-tek text-[26px] font-medium uppercase leading-[1.1] text-fg md:text-[36px]">Questions people ask</h2>
        <dl className="mt-10 flex flex-col gap-1.5">
          {faq.map((f) => (
            <div key={f.q} className="cut bg-snow px-5 py-6 [--cut:22px] md:px-10 md:py-8">
              <dt className="font-tek text-[18px] font-medium uppercase leading-[1.2] text-fg md:text-[22px]">{f.q}</dt>
              <dd className="mt-3 max-w-[920px] text-[16px] leading-[1.55] tracking-[-0.02em] text-fg2">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-accent px-4 py-16 text-accent-ink md:px-8 md:py-20">
        <p className="max-w-[20ch] font-tek text-[30px] font-medium uppercase leading-[1.08] md:text-[48px]">{closing}</p>
        <div className="mt-8 max-w-[420px]">
          <CutButton href="/contact" label="Start a project" tone="dark" />
        </div>
      </section>
    </article>
  );
}

export function geoJsonLd(slug: string, name: string, faq: { q: string; a: string }[]) {
  const base = "https://onyxcreative.asia";
  return [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
        { "@type": "ListItem", position: 2, name, item: `${base}/${slug}` },
      ],
    },
  ];
}
