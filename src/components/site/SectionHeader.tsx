"use client";

import type { L } from "@/lib/l10n";
import { useL } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import Headline from "./Headline";
import Reveal from "./Reveal";

/** `[ QUESTION ]` kicker in the reference's bracketed style. */
export function Bracket({ v, className, dark }: { v: L | string; className?: string; dark?: boolean }) {
  const tl = useL();
  return (
    <p className={cn("flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[-0.02em]", className)}>
      <span className={dark ? "text-white/30" : "text-faint"}>[</span>
      <span className={dark ? "text-white/60" : "text-fg2"}>{tl(v)}</span>
      <span className={dark ? "text-white/30" : "text-faint"}>]</span>
    </p>
  );
}

/** Section name with the short accent rule under it. */
export function SectionTitle({ v, className, dark }: { v: L | string; className?: string; dark?: boolean }) {
  const tl = useL();
  return (
    <div className={cn("inline-flex flex-col gap-1.5", className)}>
      <span className={cn("text-[24px] font-medium tracking-[-0.03em] md:text-[32px]", dark ? "text-white" : "text-fg")}>{tl(v)}</span>
      <span className="h-[2px] w-full bg-accent" />
    </div>
  );
}

/** Small left-ruled list of facts, e.g. "Practice / Build, market, measure". */
export function MetaList({ items, className }: { items: { k: L; v: L }[]; className?: string }) {
  const tl = useL();
  return (
    <dl className={cn("flex flex-col gap-3 border-l border-rule pl-4", className)}>
      {items.map((it) => (
        <div key={it.k.en}>
          <dt className="text-[12px] tracking-[-0.02em] text-fg2">{tl(it.k)}</dt>
          <dd className="mt-1 text-[16px] font-medium tracking-[-0.03em] text-fg">{tl(it.v)}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * The reference's recurring section opener: the section name on the left
 * over a short fact list, and on the right a gray panel with a hatched
 * strip down its edge, a bracketed question, a Tektur headline with
 * highlighted words, a short subtitle, and the bottom-right corner cut.
 */
export default function SectionHeader({
  id,
  section,
  question,
  headline,
  subtitle,
  meta,
  aside,
  className,
}: {
  id?: string;
  section: L;
  question: L;
  headline: L;
  subtitle?: L;
  meta?: { k: L; v: L }[];
  aside?: React.ReactNode;
  className?: string;
}) {
  const tl = useL();
  return (
    <div id={id} className={cn("scroll-mt-24 px-4 md:px-8", className)}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[346px_1fr] lg:gap-2">
        <div className="flex flex-col justify-between gap-8 lg:min-h-[500px] lg:pt-8">
          <Reveal>
            <SectionTitle v={section} />
          </Reveal>
          {aside}
          {meta && meta.length > 0 && <MetaList items={meta} className="hidden lg:flex" />}
        </div>

        <div className="cut relative flex bg-paper [--cut:40px] lg:min-h-[500px]">
          <div className="hatch hidden w-6 shrink-0 opacity-60 mix-blend-darken md:block" />
          <div className="flex flex-1 flex-col justify-between gap-12 px-5 py-8 md:px-6 md:py-8">
            <div className="flex flex-col gap-6 md:gap-8">
              <Bracket v={question} />
              <Reveal>
                <Headline
                  v={headline}
                  className="max-w-[24ch] text-[30px] leading-[1.12] tracking-[-0.03em] text-fg sm:text-[38px] md:text-[48px] md:leading-[1.2]"
                />
              </Reveal>
            </div>
            {subtitle && (
              <p className="max-w-[460px] pr-10 text-[12px] font-semibold uppercase leading-[1.25] tracking-[-0.02em] text-fg2 md:text-[13px]">
                {tl(subtitle)}
              </p>
            )}
          </div>
        </div>

        {meta && meta.length > 0 && <MetaList items={meta} className="lg:hidden" />}
      </div>
    </div>
  );
}
