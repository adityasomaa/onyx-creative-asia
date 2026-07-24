import type { Metadata } from "next";
import { RevealText } from "@/components/Reveal";
import WorksBrowser from "@/components/works/WorksBrowser";
import { T } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Works",
  description:
    "Selected projects across digital presence, digital marketing, creative studio, AI automation, growth and analytics, and managed services.",
  alternates: { canonical: "/works" },
  openGraph: {
    title: "Works, Onyx Creative Asia",
    description: "Selected projects from the studio.",
    url: "/works",
    type: "website",
  },
};

export default async function WorksPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;

  return (
    <>
      <section className="container-x pt-40 md:pt-52 pb-10 md:pb-14">
        <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-6">
          {"Works"}
        </p>
        <h1 className="text-display-md font-medium leading-[0.95] tracking-tight max-w-4xl text-balance">
          <RevealText text="Selected works" />
        </h1>
        <p className="mt-8 max-w-xl text-lg text-ink/70 leading-relaxed">
          <T>
            A selection of recent projects across websites, marketing, brand,
            and automation. Filter by the service behind each one.
          </T>
        </p>
      </section>

      <WorksBrowser initialService={service} />
    </>
  );
}
