import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import AboutHero from "@/components/about/AboutHero";
import ProcessFlow from "@/components/about/ProcessFlow";
import AboutStats from "@/components/about/AboutStats";
import { T } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "About",
  description:
    "Independent studio in Bali running every digital service your business needs to grow, from one team.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About, Onyx Creative Asia",
    description:
      "Independent studio in Bali. One team, every service, no hand-offs.",
    url: "/about",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />

      {/* Motto */}
      <section className="container-x pb-24 md:pb-32 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 border-t border-hairline pt-20">
        <Reveal className="md:col-span-5">
          <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-4">
            <T>Motto</T>
          </p>
          <h2 className="text-2xl md:text-3xl font-medium leading-tight tracking-tight">
            <T>Speed and care shouldn&apos;t trade off</T>
          </h2>
          <p className="mt-5 text-base md:text-lg leading-relaxed text-ink/70">
            <T>
              Most studios make you pick one. We built Onyx so you never have
              to.
            </T>
          </p>
        </Reveal>
        <Reveal className="md:col-span-6 md:col-start-7" delay={0.1}>
          <div className="space-y-5 text-base md:text-lg leading-relaxed text-ink/80">
            <p>
              <T>
                Onyx Creative Asia is an independent studio working at the
                intersection of brand, performance, and emerging technology. We
                build the digital surface, the growth engine, and the automation
                layer, for teams that want one partner instead of five.
              </T>
            </p>
            <p>
              <T>
                The team you meet is the team you work with. There is no account
                layer between strategy and the people writing the code or
                running the ads.
              </T>
            </p>
            <p>
              <T>
                Based in Bali, working with founders across Indonesia, Southeast
                Asia, and Europe, in hospitality, commerce, real estate, and
                software.
              </T>
            </p>
          </div>
        </Reveal>
      </section>

      {/* Process */}
      <ProcessFlow />

      {/* Experience */}
      <AboutStats />
    </>
  );
}
