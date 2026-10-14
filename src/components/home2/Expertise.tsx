"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useL } from "@/lib/i18n";
import { EXPERTISE, UI } from "@/lib/copy";
import { SERVICES, projectsFor } from "@/lib/services";
import { cn } from "@/lib/cn";
import SectionHeader from "@/components/site/SectionHeader";
import ServiceArt from "@/components/site/art/ServiceArt";

function Caret({ up, className }: { up?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 26 14" className={cn("h-3.5 w-6.5 shrink-0 transition-transform duration-500", up && "rotate-180", className)} aria-hidden>
      <path d="M1 1.5l12 11 12-11" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

/**
 * Expertise: the section header, then the five services as an accordion.
 * Closed rows are light; the open row turns dark with the number in the
 * accent, a display headline, the body, and its motion graphic on the right.
 * A hash of #svc-<id> (the hero cards link to it) opens that row.
 */
export default function Expertise() {
  const tl = useL();
  const [open, setOpen] = useState<string>(SERVICES[0].id);

  useEffect(() => {
    const sync = () => {
      const m = /^#svc-(.+)$/.exec(window.location.hash);
      if (m && SERVICES.some((s) => s.id === m[1])) setOpen(m[1]);
    };
    sync();
    window.addEventListener("hashchange", sync);
    // Same-page hash clicks are handled by the transition layer via
    // history.replaceState, which fires no hashchange: poll briefly on click.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      if (a?.getAttribute("href")?.includes("#svc-")) setTimeout(sync, 30);
    };
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", sync);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <section id="expertise" className="relative z-10 scroll-mt-16 bg-white pt-24 md:pt-40">
      <SectionHeader
        section={EXPERTISE.section}
        question={EXPERTISE.question}
        headline={EXPERTISE.headline}
        subtitle={EXPERTISE.subtitle}
        meta={[
          { k: EXPERTISE.metaA, v: EXPERTISE.metaAValue },
          { k: EXPERTISE.metaB, v: EXPERTISE.metaBValue },
        ]}
      />

      <ul className="mt-16 md:mt-24">
        {SERVICES.map((s) => {
          const isOpen = open === s.id;
          const count = projectsFor(s.id).length;
          return (
            <li
              key={s.id}
              id={`svc-${s.id}`}
              className={cn("relative scroll-mt-20 border-b border-white transition-colors duration-500", isOpen ? "bg-coal text-white" : "bg-paper text-fg")}
            >
              {/* Motion graphic: right third of the open row, full height (desktop). */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    key="img"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-y-0 right-0 hidden w-[38%] md:block"
                  >
                    <ServiceArt id={s.art} className="absolute inset-0 h-full w-full" />
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`svc-body-${s.id}`}
                onClick={() => setOpen(isOpen ? "" : s.id)}
                className={cn(
                  "group relative grid w-full grid-cols-[1fr_auto] items-center gap-4 px-4 text-left md:grid-cols-[300px_44px_1fr_auto] md:px-8",
                  isOpen ? "pb-4 pt-10 md:pr-[calc(38%+32px)] md:pt-20" : "py-7 hover:bg-[#ececec] md:py-[68px]",
                )}
              >
                {isOpen ? (
                  <span className="flex flex-col gap-3">
                    <span className="w-fit font-tek text-[26px] font-medium leading-none text-accent">
                      {s.number}
                      <span className="mt-2.5 block h-[2px] w-[64px] bg-accent" />
                    </span>
                    <span className="font-tek text-[20px] font-medium uppercase leading-[1.05] md:text-[22px]">{tl(s.title)}</span>
                  </span>
                ) : (
                  <span className="flex items-baseline gap-3 font-tek text-[20px] font-medium uppercase leading-none md:text-[24px]">
                    <span className="text-fg2">{s.number}</span>
                    <span>{tl(s.title)}</span>
                  </span>
                )}
                <Caret up={isOpen} className={cn("justify-self-end md:justify-self-start", isOpen ? "text-accent md:self-start md:mt-2" : "text-fg")} />
                {isOpen ? (
                  <span className="col-span-2 max-w-[520px] font-tek text-[26px] font-medium uppercase leading-[1.1] tracking-[-0.02em] md:col-span-1 md:text-[32px]">
                    {tl(s.headline)}
                  </span>
                ) : (
                  <span className="hidden text-[16px] font-medium tracking-[-0.03em] md:block">{tl(s.short)}</span>
                )}
                <span className="hidden text-[12px] font-semibold uppercase md:block">
                  {!isOpen && count > 0 ? `${count} ${tl(count === 1 ? UI.projectCount : UI.projectsCount)}` : ""}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="body"
                    id={`svc-body-${s.id}`}
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
                    className="relative overflow-hidden"
                  >
                    <div className="px-4 pb-10 md:grid md:grid-cols-[300px_44px_1fr] md:px-8 md:pb-20 md:pr-[calc(38%+32px)]">
                      <span className="hidden md:block" />
                      <span className="hidden md:block" />
                      <div className="flex max-w-[520px] flex-col gap-6 pt-2">
                        <p className="text-[16px] font-medium leading-[1.35] tracking-[-0.03em] text-white/55">{tl(s.body)}</p>
                        {count > 0 && (
                          <p className="text-[12px] font-semibold uppercase text-accent">
                            {count} {tl(count === 1 ? UI.projectCount : UI.projectsCount)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="relative h-[240px] md:hidden">
                      <ServiceArt id={s.art} className="absolute inset-0 h-full w-full" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
