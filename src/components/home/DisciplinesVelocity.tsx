"use client";

import ScrollVelocity from "@/components/ui/ScrollVelocity";
import { SERVICES } from "@/lib/data";
import { useT } from "@/lib/i18n";

/**
 * The six disciplines as two rows drifting in opposite directions,
 * speeding up with scroll. Sits between the hero and the about preview,
 * so the first scroll a visitor makes is the one that moves it.
 *
 * The second row is light italic, echoing the "ONYX Creative" wordmark
 * in the footer.
 */
export default function DisciplinesVelocity() {
  const t = useT();
  const line = SERVICES.map((s) => t(s.title)).join(" — ") + " —";

  return (
    <section className="overflow-hidden py-12 md:py-20">
      <ScrollVelocity
        text={line}
        // ~250px/s at rest on a desktop, so a word takes ~6s to cross the
        // screen (was ~1000px/s); scrolling at 1000px/s adds 1.5x on top
        // (was 5x, which read as frantic).
        velocity={0.6}
        boost={1.5}
        className="text-[clamp(2.5rem,7.5vw,6.5rem)] leading-[1.08] tracking-tight"
        rowClassNames={["font-medium", "font-light italic text-ink/70"]}
      />
    </section>
  );
}
