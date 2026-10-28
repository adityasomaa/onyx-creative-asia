"use client";

import { EXPERTISE, HERO, SERVICES_PAGE } from "@/lib/copy";
import SectionHeader from "@/components/site/SectionHeader";
import CutButton from "@/components/site/CutButton";
import Headline from "@/components/site/Headline";
import { useL } from "@/lib/i18n";
import ServiceStack from "./ServiceStack";

/** /services: the header, the six services as a card stack, and a way in. */
export default function ServicesIndex() {
  const tl = useL();
  return (
    <>
      <section className="bg-white pb-16 pt-[110px] md:pb-24 md:pt-[130px]">
        <SectionHeader
          section={SERVICES_PAGE.section}
          question={SERVICES_PAGE.question}
          headline={SERVICES_PAGE.headline}
          subtitle={SERVICES_PAGE.subtitle}
          meta={[
            { k: EXPERTISE.metaA, v: EXPERTISE.metaAValue },
            { k: EXPERTISE.metaB, v: EXPERTISE.metaBValue },
          ]}
        />
        <ServiceStack variant="panel" className="mt-12 md:mt-16" />
      </section>
      <section className="on-dark bg-night px-4 py-20 text-white md:px-8 md:py-28">
        <Headline v={SERVICES_PAGE.ctaTitle} className="max-w-[16ch] text-[38px] leading-[1.05] tracking-[-0.03em] md:text-[72px]" />
        <p className="mt-6 max-w-[520px] text-[13px] font-semibold uppercase leading-[1.3] text-white/70">{tl(SERVICES_PAGE.ctaBody)}</p>
        <div className="mt-10 w-full max-w-[420px]">
          <CutButton href="/enquire?type=project" label={HERO.cta} meta={HERO.ctaMeta} />
        </div>
      </section>
    </>
  );
}
