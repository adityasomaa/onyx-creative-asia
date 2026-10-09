"use client";

import ScrollSplitCard, { type ScrollSplitCardItem } from "@/components/ui/ScrollSplitCard";
import { useT } from "@/lib/i18n";

/**
 * "Business development is three jobs": the hero still splits into three
 * panels on scroll and flips to show what each job is. The same framing
 * as the Asia answer-engine page, told visually on the homepage.
 *
 * Panels run light to dark in the brand's own tones, and the image is
 * greyscaled the way the hero video is, so nothing here is off-palette.
 */
export default function ThreeJobs() {
  const t = useT();

  const cards: ScrollSplitCardItem[] = [
    {
      title: t("Build the surface"),
      description: t("The website, store and software your business actually sells through."),
      bgColor: "#EAE6DE",
      textColor: "#0E0E0E",
      icon: <Num n="01" />,
    },
    {
      title: t("Drive the demand"),
      description: t("Search, ads and social that bring the right people to it, measured."),
      bgColor: "#4D4D49",
      textColor: "#F4F1EC",
      icon: <Num n="02" />,
    },
    {
      title: t("Remove the busywork"),
      description: t("Automation for the repetitive work between an enquiry and a client."),
      bgColor: "#0E0E0E",
      textColor: "#F4F1EC",
      icon: <Num n="03" />,
    },
  ];

  return (
    <section className="border-t border-hairline">
      <ScrollSplitCard
        imageSrc="/videos/hero-poster.jpg"
        imageClassName="grayscale"
        cards={cards}
        startCaption={
          <>
            <p className="mb-4 text-xs uppercase tracking-[0.25em] opacity-60">
              {t("How we work")}
            </p>
            <h2 className="mx-auto max-w-3xl text-3xl font-medium leading-[0.95] tracking-tight text-balance md:text-5xl">
              {t("Business development is three jobs.")}
            </h2>
          </>
        }
        endCaption={
          <p className="text-3xl font-light italic tracking-tight md:text-5xl">
            {t("One team does all three.")}
          </p>
        }
      />
    </section>
  );
}

function Num({ n }: { n: string }) {
  return <span className="text-xs tabular-nums tracking-[0.25em] opacity-60">{n}</span>;
}
