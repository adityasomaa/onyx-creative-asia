"use client";

import { EXPERTISE } from "@/lib/copy";
import SectionHeader from "@/components/site/SectionHeader";
import ServiceStack from "@/components/services/ServiceStack";

/**
 * Expertise: the section header, then the six services as a stack of
 * cards that pile up as the page scrolls. Every card is fully readable
 * and links to its service page; nothing opens or closes.
 */
export default function Expertise() {
  return (
    <section id="expertise" className="relative z-10 scroll-mt-16 bg-white pb-16 pt-24 md:pb-24 md:pt-40">
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
      <ServiceStack variant="panel" className="mt-10 md:mt-16" />
    </section>
  );
}
