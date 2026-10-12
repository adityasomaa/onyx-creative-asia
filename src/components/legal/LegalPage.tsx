"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useL, useLocale } from "@/lib/i18n";
import { LEGAL, FOOTER } from "@/lib/copy";

export type LegalSection = { id: string; title: string; body: ReactNode };

/**
 * Legal page in the reference's layout: big title, accent rule, an "on
 * this page" index with a contact card beside numbered sections. The
 * documents are English-only (a note says so in other languages), since
 * an unreviewed translation of a legal text is worse than none.
 */
export default function LegalPage({
  title,
  updated,
  other,
  sections,
}: {
  title: string;
  updated: string;
  other: { href: string; label: typeof FOOTER.termsFull };
  sections: LegalSection[];
}) {
  const tl = useL();
  const { locale } = useLocale();
  return (
    <div className="bg-white px-4 pb-24 pt-[110px] md:px-8 md:pt-[140px]">
      <h1 className="font-tek text-[44px] font-medium uppercase leading-none tracking-[-0.02em] text-fg md:text-[72px]">{title}</h1>
      <div className="mt-6 flex items-center justify-between text-[11px] font-semibold uppercase text-mute">
        <span>
          {tl(LEGAL.updated)} — {updated}
        </span>
        <Link href={other.href} className="text-fg hover:text-fg2">
          {tl(other.label)}
        </Link>
      </div>
      <div className="mt-4 h-1 bg-accent" />
      {locale !== "en" && <p className="mt-6 text-[12px] font-semibold uppercase text-fg2">{tl(LEGAL.englishOnly)}</p>}

      <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[300px_1fr] lg:gap-16">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-[10px] font-semibold uppercase text-mute">{tl(LEGAL.onThisPage)}</p>
          <ol className="mt-4 border-t border-rule">
            {sections.map((s, i) => (
              <li key={s.id} className="border-b border-rule">
                <a href={`#${s.id}`} className="flex gap-3 py-2.5 text-[11px] font-semibold uppercase text-fg hover:text-fg2">
                  <span className="text-mute">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
          <div className="cut mt-10 bg-coal p-5 text-white [--cut:22px]">
            <p className="text-[11px] font-semibold uppercase text-white/50">[ {tl(LEGAL.human)} ]</p>
            <p className="mt-3 text-[13px] font-semibold uppercase leading-[1.25]">{tl(LEGAL.humanBody)}</p>
            <a href="mailto:hello@onyxcreative.asia" className="mt-4 inline-block bg-accent px-2 py-1 text-[11px] font-semibold uppercase text-accent-ink">
              › hello@onyxcreative.asia
            </a>
          </div>
        </aside>

        <div>
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="grid scroll-mt-28 grid-cols-[44px_1fr] gap-4 border-t border-rule py-10 md:grid-cols-[64px_1fr]">
              <span className="font-tek text-[20px] font-medium text-faint">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="font-tek text-[24px] font-medium uppercase leading-[1.1] text-fg md:text-[30px]">{s.title}</h2>
                <div className="mt-5 max-w-[720px] space-y-4 text-[15px] leading-[1.55] tracking-[-0.02em] text-fg2 [&_li]:flex [&_li]:gap-3 [&_li]:before:mt-[0.6em] [&_li]:before:h-1 [&_li]:before:w-1 [&_li]:before:shrink-0 [&_li]:before:bg-accent [&_li]:before:content-[''] [&_ul]:space-y-2 [&_a]:text-fg [&_a]:underline [&_a]:underline-offset-4">
                  {s.body}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
