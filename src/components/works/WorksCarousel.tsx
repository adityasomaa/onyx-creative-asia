"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { PROJECTS } from "@/lib/data";
import { useT } from "@/lib/i18n";

// three.js is ~135 KB gzipped (two chunks). Loading it client-side and only here keeps
// it out of every other route's bundle.
const LiquidGlassCarousel = dynamic(
  () => import("@/components/ui/LiquidGlassCarousel").then((m) => m.LiquidGlassCarousel),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-bone" /> },
);

const PHONE = "(max-width: 767px)";
const panelHeightFor = () =>
  typeof window !== "undefined" && window.matchMedia(PHONE).matches ? 180 : 420;

const ITEMS = PROJECTS.map((p) => ({ src: p.cover, title: p.client, aspect: 16 / 9 }));

/**
 * Every project as an endless row through a liquid-glass lens. Clicking
 * the centred project expands it; while it is open, a link to its case
 * study takes the counter's place.
 *
 * The filterable grid below stays the way to browse; this is the way in.
 */
export default function WorksCarousel() {
  const t = useT();
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState(false);
  // Covers are 16:9, so panel height sets width too. 180px keeps a panel
  // (and its 1.18x focus scale) inside a phone; desktops get the full 420.
  // Read on first render: the carousel itself is client-only, so there is
  // no server markup to mismatch, and starting at 420 on a phone would
  // build the WebGL engine twice.
  const [panelHeight, setPanelHeight] = useState(() => panelHeightFor());

  useEffect(() => {
    const mq = window.matchMedia(PHONE);
    const update = () => setPanelHeight(panelHeightFor());
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const project = PROJECTS[active] ?? PROJECTS[0];

  return (
    <section className="relative h-[62vh] min-h-[440px] border-t border-hairline md:h-[74vh]">
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
          unavailable: t("The interactive preview is unavailable here. Every project is listed below."),
        }}
      />

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
    </section>
  );
}
