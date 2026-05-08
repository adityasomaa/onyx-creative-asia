import type { Metadata } from "next";
import Link from "next/link";
import { PROJECTS } from "@/lib/data";
import { RevealText } from "@/components/Reveal";
import ProjectCover from "@/components/ProjectCover";

export const metadata: Metadata = {
  title: "Works",
  description:
    "Selected projects across web, paid media, social, and AI systems — including Great Bali Properties, RADcruiters, and The Hair Extensions Bali.",
  alternates: { canonical: "/works" },
  openGraph: {
    title: "Works — Onyx Creative Asia",
    description:
      "Selected projects from the studio — web, performance, social, AI systems.",
    url: "/works",
    type: "website",
  },
};

export default function WorksPage() {
  return (
    <>
      <section className="container-x pt-40 md:pt-52 pb-16 md:pb-24">
        <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-6">
          (Selected works — {new Date().getFullYear()})
        </p>
        <h1 className="text-display-md font-medium leading-[0.92] tracking-tight max-w-5xl text-balance">
          <RevealText text="Brands we've helped" />
          <br />
          <span className="font-light italic">
            <RevealText text="show up & scale up." delay={0.15} />
          </span>
        </h1>
      </section>

      {PROJECTS.length === 0 ? (
        <section className="container-x pb-24 md:pb-32 border-t border-hairline pt-16">
          <p className="text-lg text-ink/70 max-w-md">
            New work shipping soon. In the meantime —{" "}
            <Link href="/contact" className="border-b border-ink/40 hover:border-ink">
              start a project
            </Link>
            .
          </p>
        </section>
      ) : (
        <section className="container-x pb-24 md:pb-32 border-t border-hairline pt-12 md:pt-16">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-x-8 md:gap-y-16">
            {PROJECTS.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} />
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof PROJECTS)[number];
  index: number;
}) {
  return (
    <li className={index % 3 === 1 ? "md:mt-16" : ""}>
      <Link
        href={`/works/${project.slug}`}
        className="group block"
        data-cursor="hover"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-ink">
          <ProjectCover
            src={project.cover}
            loop={project.coverLoop}
            alt={`${project.client} — ${project.title}`}
            sizes="(min-width: 768px) 50vw, 100vw"
          />
          <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors duration-700 z-10" />
        </div>
        <div className="flex items-baseline justify-between mt-5 gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] opacity-60">
              {project.category} — {project.year}
            </p>
            <h2 className="mt-2 text-2xl md:text-3xl font-medium tracking-tight">
              {project.client}
              <span className="font-light italic text-ink/60">
                , {project.title.toLowerCase()}
              </span>
            </h2>
          </div>
          <span
            aria-hidden
            className="text-2xl transition-transform duration-700 ease-out-expo group-hover:translate-x-2 group-hover:-translate-y-1"
          >
            ↗
          </span>
        </div>
      </Link>
    </li>
  );
}
