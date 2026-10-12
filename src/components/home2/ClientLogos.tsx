"use client";

import { useL } from "@/lib/i18n";
import { CLIENTS_COPY } from "@/lib/copy";
import { PROJECTS } from "@/lib/data";
import { Chevrons } from "@/components/site/Wordmark";

/**
 * Dark strip of client names. Sticky, so the showreel below slides up
 * over it, as in the reference. The names are the real clients with case
 * studies on this site, set as wordmarks rather than invented logos.
 */
export default function ClientLogos() {
  const tl = useL();
  const names = PROJECTS.map((p) => p.client);
  const row = [...names, ...names];
  return (
    <section className="sticky top-0 z-0 bg-coal py-20 text-white md:py-24">
      <div className="flex flex-col items-center gap-8">
        <Chevrons className="h-8 rotate-90 text-[#4d4d4d]" />
        <p className="text-center text-[13px] font-semibold uppercase tracking-[-0.02em] text-faint">{tl(CLIENTS_COPY.title)}</p>
      </div>
      <div className="relative mt-10 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <ul className="flex w-max items-center gap-16 motion-safe:animate-[marquee-x_42s_linear_infinite] md:gap-[120px]" aria-label={tl(CLIENTS_COPY.title)}>
          {row.map((n, i) => (
            <li
              key={i}
              aria-hidden={i >= names.length}
              className="whitespace-nowrap font-tek text-[26px] font-medium uppercase tracking-[-0.02em] text-white/85 md:text-[34px]"
            >
              {n}
            </li>
          ))}
        </ul>
      </div>
      <div className="mx-auto mt-10 w-fit border-y border-white/15 px-5 py-4">
        <p className="max-w-[300px] text-center text-[13px] font-semibold uppercase leading-[1.2] tracking-[-0.02em] text-faint">
          {tl(CLIENTS_COPY.note)}
        </p>
      </div>
    </section>
  );
}
