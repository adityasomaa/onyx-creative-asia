import type { Metadata } from "next";
import { RevealText } from "@/components/Reveal";
import InsightsBrowser from "@/components/insights/InsightsBrowser";
import { T } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Everything interesting you should know in the digital marketing world, from the Onyx Creative Asia studio.",
  alternates: { canonical: "/insights" },
  openGraph: {
    title: "Insights, Onyx Creative Asia",
    description:
      "Everything interesting you should know in the digital marketing world.",
    url: "/insights",
    type: "website",
  },
};

export default function InsightsPage() {
  return (
    <>
      <section className="container-x pt-40 md:pt-52 pb-10 md:pb-14">
        <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-6">
          {"Insights"}
        </p>
        <h1 className="text-display-md font-medium leading-[0.95] tracking-tight max-w-4xl text-balance">
          <RevealText text="Useful articles" />
        </h1>
        <p className="mt-8 max-w-xl text-lg text-ink/70 leading-relaxed">
          <T>
            Everything interesting you should know in the Digital Marketing
            world.
          </T>
        </p>
      </section>

      <InsightsBrowser />
    </>
  );
}
