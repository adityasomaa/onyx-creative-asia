import type { Metadata } from "next";
import Link from "next/link";
import { PROJECTS, SERVICES, getProjectsForService } from "@/lib/data";
import { RevealText } from "@/components/Reveal";
import WorkCard from "@/components/works/WorkCard";
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
  const activeService = service
    ? SERVICES.find((s) => s.id === service)
    : undefined;
  const projects = activeService
    ? getProjectsForService(activeService.id)
    : PROJECTS;

  return (
    <>
      <section className="container-x pt-40 md:pt-52 pb-10 md:pb-14">
        <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-6">
          (<T>Selected works</T>, {new Date().getFullYear()})
        </p>
        <h1 className="text-display-md font-medium leading-[0.95] tracking-tight max-w-4xl text-balance">
          <RevealText text="The work we deliver." />
        </h1>
      </section>

      {/* Service filter. Each work card's tags link here too. */}
      <section className="container-x pb-10 md:pb-12">
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link
              href="/works"
              className={`inline-flex rounded-full border px-4 py-2 text-sm tracking-tight transition-colors duration-300 ${
                activeService
                  ? "border-hairline text-ink/70 hover:border-ink/40"
                  : "border-ink bg-ink text-bone"
              }`}
            >
              All work
            </Link>
          </li>
          {SERVICES.map((s) => {
            const on = activeService?.id === s.id;
            return (
              <li key={s.id}>
                <Link
                  href={`/works?service=${s.id}`}
                  className={`inline-flex rounded-full border px-4 py-2 text-sm tracking-tight transition-colors duration-300 ${
                    on
                      ? "border-ink bg-ink text-bone"
                      : "border-hairline text-ink/70 hover:border-ink/40"
                  }`}
                >
                  {s.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {projects.length === 0 ? (
        <section className="container-x pb-24 md:pb-32 border-t border-hairline pt-16">
          <p className="text-lg text-ink/70 max-w-lg">
            No work to show under {activeService?.title ?? "this filter"} yet.{" "}
            <Link
              href="/works"
              className="border-b border-ink/40 hover:border-ink"
            >
              See all work
            </Link>
            .
          </p>
        </section>
      ) : (
        <section className="container-x pb-24 md:pb-32 border-t border-hairline pt-12 md:pt-16">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-x-8 md:gap-y-16">
            {projects.map((p, i) => (
              // Tidy 2-col masonry: the right column sits lower for rhythm.
              <li key={p.slug} className={i % 2 === 1 ? "md:mt-16" : ""}>
                <WorkCard project={p} sizes="(min-width: 768px) 50vw, 100vw" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
