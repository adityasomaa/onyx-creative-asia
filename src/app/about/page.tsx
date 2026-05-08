import type { Metadata } from "next";
import Reveal, { RevealText } from "@/components/Reveal";
import AboutManifesto from "@/components/about/AboutManifesto";
import AboutStats from "@/components/about/AboutStats";

export const metadata: Metadata = {
  title: "About",
  description:
    "Independent studio in Bali — building brand, growth, and AI systems for ambitious teams across Asia.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Onyx Creative Asia",
    description:
      "Independent studio in Bali. One team, four disciplines, no hand-offs.",
    url: "/about",
    type: "website",
  },
};

const PRINCIPLES = [
  {
    n: "01",
    t: "Make, don't decorate",
    d: "Every output earns its place. If a section doesn't move someone closer to a decision, it doesn't ship.",
  },
  {
    n: "02",
    t: "One team, no hand-offs",
    d: "Brand, build, and growth in the same room. Less coordination tax, faster ship cycles, sharper outcomes.",
  },
  {
    n: "03",
    t: "Systems over deliverables",
    d: "We don't sell hours. We hand back operating systems — sites, funnels, and agents that keep working.",
  },
  {
    n: "04",
    t: "Quiet confidence",
    d: "No jargon, no hype. The work speaks. We work best with founders and teams who think the same way.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="container-x pt-40 md:pt-52 pb-20 md:pb-28">
        <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-6">
          (About — the studio)
        </p>
        <h1 className="text-display-md font-medium leading-[0.92] tracking-tight max-w-5xl text-balance">
          <RevealText text="A small studio." />
          <br />
          <span className="font-light italic">
            <RevealText text="Built to ship." delay={0.15} />
          </span>
        </h1>
      </section>

      <section className="container-x pb-24 md:pb-32 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 border-t border-hairline pt-20">
        <Reveal className="md:col-span-5">
          <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-4">
            (Story)
          </p>
          <h2 className="text-3xl md:text-4xl font-medium leading-tight tracking-tight">
            We started Onyx because the
            <span className="font-light italic"> good agencies</span> moved too
            slow,
            <br />
            and the
            <span className="font-light italic"> fast ones</span> moved without
            care.
          </h2>
        </Reveal>
        <Reveal className="md:col-span-6 md:col-start-7" delay={0.1}>
          <div className="space-y-5 text-base md:text-lg leading-relaxed text-ink/80">
            <p>
              Onyx Creative Asia is an independent studio working at the
              intersection of brand, performance, and emerging technology. We
              build the digital surface, the growth engine, and the automation
              layer — for teams that want one partner instead of five.
            </p>
            <p>
              We&apos;re small on purpose. The team you meet is the team you
              work with. There is no account layer between strategy and the
              people writing the code or running the ads.
            </p>
            <p>
              Based in Bali, working with founders across Indonesia, Southeast
              Asia, and Europe — in hospitality, commerce, real estate, and
              software.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="bg-ink text-bone py-24 md:py-32">
        <div className="container-x">
          <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-12">
            (How we work)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 md:gap-y-16">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.n} delay={(i % 2) * 0.1}>
                <p className="text-xs opacity-60 tabular-nums mb-3">{p.n}</p>
                <h3 className="text-2xl md:text-3xl font-medium tracking-tight">
                  {p.t}
                </h3>
                <p className="mt-3 text-base leading-relaxed opacity-80 max-w-md">
                  {p.d}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <AboutManifesto />
      <AboutStats />
    </>
  );
}
