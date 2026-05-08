import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PROJECTS, defaultUrlLabel } from "@/lib/data";
import Reveal, { RevealText } from "@/components/Reveal";
import ProjectCover from "@/components/ProjectCover";

type Params = { slug: string };

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return { title: "Not found" };

  const url = `/works/${project.slug}`;
  return {
    title: `${project.client} — ${project.title}`,
    description: project.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${project.client} — ${project.title}`,
      description: project.description,
      url,
      type: "article",
      images: [project.cover],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.client} — ${project.title}`,
      description: project.description,
      images: [project.cover],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  const index = PROJECTS.findIndex((p) => p.slug === slug);
  const total = PROJECTS.length;
  const next = PROJECTS[(index + 1) % total];
  const prev = PROJECTS[(index - 1 + total) % total];

  const ctaLabel = project.urlLabel ?? defaultUrlLabel(project.url);

  return (
    <>
      {/* Top — caption + headline */}
      <section className="container-x pt-40 md:pt-52 pb-12 md:pb-16">
        <div className="flex items-center gap-4 text-xs uppercase tracking-[0.25em] opacity-60 mb-8">
          <span className="tabular-nums">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span className="h-px flex-1 bg-ink/20 max-w-24" />
          <span>{project.category}</span>
          <span className="opacity-50">·</span>
          <span>{project.year}</span>
        </div>

        <h1 className="text-display-md font-medium leading-[0.92] tracking-tight max-w-5xl text-balance">
          <RevealText text={project.client} />
          <br />
          <span className="font-light italic">
            <RevealText text={project.title.toLowerCase() + "."} delay={0.15} />
          </span>
        </h1>
      </section>

      {/* Hero cover (image + optional looping video) */}
      <section className="container-x pb-12 md:pb-20">
        <Reveal amount={0.1}>
          <div className="relative aspect-[4/3] md:aspect-[16/8] overflow-hidden bg-ink group">
            <ProjectCover
              src={project.cover}
              loop={project.coverLoop}
              alt={`${project.client} — ${project.title}`}
              priority
              sizes="(min-width: 768px) 90vw, 100vw"
            />
          </div>
        </Reveal>
      </section>

      {/* Meta + CTA */}
      <section className="container-x pb-20 md:pb-28 grid grid-cols-2 md:grid-cols-12 gap-y-8 gap-x-8 border-t border-hairline pt-10 md:pt-14">
        <Meta label="Year" value={project.year} />
        {project.location && <Meta label="Location" value={project.location} />}
        <Meta
          label="Discipline"
          value={(project.services && project.services.join(" · ")) || project.category}
        />
        <div className="col-span-2 md:col-span-6 md:col-start-7 flex md:justify-end items-end">
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-bone transition-transform duration-500 ease-out-expo hover:scale-[1.03]"
            data-cursor="hover"
          >
            <span className="text-sm font-medium">{ctaLabel}</span>
            <span
              aria-hidden
              className="transition-transform duration-500 group-hover:translate-x-1"
            >
              ↗
            </span>
          </a>
        </div>
      </section>

      {/* Long description */}
      {project.longDescription && (
        <section className="container-x pb-20 md:pb-28 border-t border-hairline pt-12 md:pt-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
            <Reveal className="md:col-span-3">
              <p className="text-xs uppercase tracking-[0.25em] opacity-60">
                (The work)
              </p>
            </Reveal>
            <Reveal className="md:col-span-8 md:col-start-5" delay={0.1}>
              <p className="text-xl md:text-2xl leading-snug text-ink/85 max-w-3xl text-balance">
                {project.longDescription}
              </p>
            </Reveal>
          </div>
        </section>
      )}

      {/* Scope */}
      {project.scope && project.scope.length > 0 && (
        <section className="container-x pb-24 md:pb-32 border-t border-hairline pt-12 md:pt-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
            <Reveal className="md:col-span-3">
              <p className="text-xs uppercase tracking-[0.25em] opacity-60">
                (Scope)
              </p>
            </Reveal>
            <Reveal className="md:col-span-8 md:col-start-5" delay={0.1}>
              <ul className="border-t border-hairline">
                {project.scope.map((s, i) => (
                  <li
                    key={s}
                    className="border-b border-hairline py-5 flex items-baseline gap-6 text-base md:text-lg"
                  >
                    <span className="text-xs opacity-50 tabular-nums w-6 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs uppercase tracking-[0.18em] border border-ink/20 rounded-full px-3 py-1"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Footer nav: prev / next / back */}
      <section className="container-x pb-24 md:pb-32 border-t border-hairline pt-12 md:pt-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Link
            href="/works"
            className="text-sm tracking-tight border-b border-ink/40 hover:border-ink pb-1 transition-colors w-fit"
          >
            ← All works
          </Link>

          {total > 1 && (
            <div className="flex items-center gap-6 text-sm">
              {prev && prev.slug !== project.slug && (
                <Link
                  href={`/works/${prev.slug}`}
                  className="group inline-flex items-center gap-2 hover:opacity-70 transition-opacity"
                >
                  <span aria-hidden>←</span>
                  <span className="font-medium">{prev.client}</span>
                </Link>
              )}
              {next && next.slug !== project.slug && (
                <Link
                  href={`/works/${next.slug}`}
                  className="group inline-flex items-center gap-2 hover:opacity-70 transition-opacity"
                >
                  <span className="font-medium">{next.client}</span>
                  <span aria-hidden>→</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="col-span-1 md:col-span-2">
      <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-2">
        {label}
      </p>
      <p className="text-base md:text-lg">{value}</p>
    </div>
  );
}
