"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useInView } from "framer-motion";
import { PROJECTS } from "@/lib/data";
import Reveal, { RevealText } from "@/components/Reveal";
import { useT } from "@/lib/i18n";

// three.js is ~135 KB gzipped (two chunks), so it loads client-side, on
// demand, and only for this section.
const LiquidGlassCarousel = dynamic(
  () => import("@/components/ui/LiquidGlassCarousel").then((m) => m.LiquidGlassCarousel),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-bone" /> },
);

const PHONE = "(max-width: 767px)";
const panelHeightFor = () =>
  typeof window !== "undefined" && window.matchMedia(PHONE).matches ? 180 : 420;

const ITEMS = PROJECTS.map((p) => ({ src: p.cover, title: p.client, aspect: 16 / 9 }));

/**
 * Homepage works: every project as an endless row through a liquid-glass
 * lens. Clicking the centred project expands it; while it is open, a link
 * to its case study takes the counter's place.
 *
 * The carousel mounts as the section approaches the viewport. This far
 * down the page, mounting at load would download three.js for visitors
 * who never scroll here, and play the intro where nobody can see it.
 */
export default function FeaturedWorks() {
  const t = useT();
  const stageRef = useRef<HTMLDivElement>(null);
  const near = useInView(stageRef, { once: true, margin: "400px 0px" });
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState(false);
  // Covers are 16:9, so panel height sets width too. 180px keeps a panel
  // (and its 1.18x focus scale) inside a phone; desktops get the full 420.
  // Read on first render: the carousel is client-only, so there is no
  // server markup to mismatch, and starting at 420 on a phone would build
  // the WebGL engine twice.
  const [panelHeight, setPanelHeight] = useState(() => panelHeightFor());

  useEffect(() => {
    const mq = window.matchMedia(PHONE);
    const update = () => setPanelHeight(panelHeightFor());
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const project = PROJECTS[active] ?? PROJECTS[0];

  return (
    <section className="border-t border-hairline pb-12 pt-24 md:pb-16 md:pt-32">
      <div className="container-x mb-10 flex items-end justify-between gap-6 md:mb-14">
        <div className="max-w-2xl">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] opacity-60">{t("Works")}</p>
          {/* No nowrap: the English fits on one line but the translations
              are longer and were running off the right edge on mobile. */}
          <h2 className="text-display-sm font-medium leading-[0.95] tracking-tight text-balance">
            <RevealText text="Brands we've grown" />
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink/70 md:text-lg">
            {t("A look at recent projects across websites, marketing, brand, and automation.")}
          </p>
        </div>
        <Reveal className="hidden shrink-0 md:block" delay={0.2}>
          <Link href="/works" className="border-b border-ink/40 pb-1 text-sm transition-colors hover:border-ink">
            {t("All works")} →
          </Link>
        </Reveal>
      </div>

      {/* The canvas fades out over its top and bottom 10%: the lens bloom
          is lighter than the page, and without the fade it stopped at the
          canvas edge in a hard line. Panels never reach that band, even
          at their 1.18x focus scale. */}
      <div
        ref={stageRef}
        className="relative h-[62vh] min-h-[440px] md:h-[74vh] [&_canvas]:[mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]"
      >
        {near ? (
          <LiquidGlassCarousel
            items={ITEMS}
            background="#F4F1EC"
            panelHeight={panelHeight}
            gap={14}
            className="h-full min-h-0"
            onActiveChange={setActive}
            onFocusChange={setFocused}
            labels={{
              region: t("Selected works"),
              view: t("View"),
              close: t("Close"),
              closeAria: t("Close focused project"),
              of: t("of"),
              focused: t("open"),
              unavailable: t("The interactive preview is unavailable here. Every project is on the works page."),
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-bone" />
        )}

        <Link
          href={`/works/${project.slug}`}
          className="absolute bottom-[6%] left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bone transition-opacity duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          style={{ opacity: focused ? 1 : 0, pointerEvents: focused ? "auto" : "none" }}
          tabIndex={focused ? 0 : -1}
          aria-hidden={!focused}
        >
          {t("View case study")} →
        </Link>

        <p className="pointer-events-none absolute bottom-[6%] left-6 z-10 hidden text-xs uppercase tracking-[0.25em] text-ink/50 md:left-10 md:block lg:left-16">
          {t("Drag to explore")}
        </p>
      </div>

      <div className="mt-8 text-center md:hidden">
        <Link href="/works" className="inline-block border-b border-ink/40 pb-1 text-sm hover:border-ink">
          {t("All works")} →
        </Link>
      </div>
    </section>
  );
}
