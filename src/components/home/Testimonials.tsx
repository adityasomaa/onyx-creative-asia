"use client";

import { TESTIMONIALS } from "@/lib/data";
import { RevealText } from "@/components/Reveal";
import { useT } from "@/lib/i18n";

export default function Testimonials() {
  const t = useT();
  const items = TESTIMONIALS;
  if (items.length === 0) return null;

  // Doubled so the marquee loops seamlessly (keyframe runs 0 -> -50%).
  const row = [...items, ...items];

  return (
    <section className="border-t border-hairline py-24 md:py-32 overflow-hidden">
      <div className="container-x text-center">
        <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-4">
          {t("Testimonials")}
        </p>
        <h2 className="text-display-sm font-medium leading-[0.95] tracking-tight text-balance">
          <RevealText text="What they say about us" />
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base md:text-lg text-ink/70 leading-relaxed">
          {t(
            "The people we build for, in their own words. Real teams, real projects.",
          )}
        </p>
      </div>

      <div className="relative mt-12 md:mt-16">
        {/* Edge fades left + right */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bone to-transparent md:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bone to-transparent md:w-40" />

        <div className="flex w-max gap-5 animate-marquee md:gap-6">
          {row.map((item, i) => (
            <figure
              key={i}
              className="flex w-[300px] shrink-0 flex-col rounded-2xl border border-hairline p-6 md:w-[420px] md:p-8"
            >
              <blockquote className="text-base md:text-lg leading-relaxed text-ink/85">
                &ldquo;{t(item.quote)}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-baseline gap-2 text-sm">
                <span className="font-medium">{item.author}</span>
                <span className="opacity-40">·</span>
                <span className="opacity-70 italic">{item.client}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
