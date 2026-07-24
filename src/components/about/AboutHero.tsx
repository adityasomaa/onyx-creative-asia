"use client";

import { RevealText } from "@/components/Reveal";
import Button from "@/components/ui/Button";

function discover() {
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number) => void } })
    .__lenis;
  const target = window.innerHeight * 0.85;
  if (lenis) lenis.scrollTo(target);
  else window.scrollTo({ top: target, behavior: "smooth" });
}

export default function AboutHero() {
  return (
    <section className="container-x pt-40 md:pt-52 pb-20 md:pb-28">
      <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-6">
        About
      </p>
      <h1 className="max-w-5xl text-3xl sm:text-4xl md:text-5xl lg:text-display-md font-medium leading-[1.05] tracking-tight text-balance">
        <RevealText text="Your One Stop Business Development Digital Solution" />
      </h1>
      <p className="mt-8 max-w-2xl text-base md:text-lg leading-relaxed text-ink/70">
        An independent studio in Bali running every digital service your
        business needs to grow, from your website to your marketing to your
        automations, under one roof.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Button href="/contact" tone="dark">
          Start a project
        </Button>
        <Button onClick={discover} tone="outlineDark" arrow={false}>
          Discover
        </Button>
      </div>
    </section>
  );
}
