import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  PROJECTS,
  defaultUrlLabel,
  getTestimonialForProject,
} from "@/lib/data";
import Reveal, { RevealText } from "@/components/Reveal";
import ProjectCover from "@/components/ProjectCover";
import Button from "@/components/ui/Button";
import { T } from "@/lib/i18n";

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
    title: `${project.client}, ${project.title}`,
    description: project.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${project.client}, ${project.title}`,
      description: project.description,
      url,
      type: "article",
      images: [project.cover],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.client}, ${project.title}`,
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

  // Some projects aren't publicly linkable, so the visit CTA is optional.
  const ctaLabel = project.url
    ? (project.urlLabel ?? defaultUrlLabel(project.url))
    : null;
  const testimonial = getTestimonialForProject(project.slug);

  // Per-project Review schema for AI answer engines + Google rich
  // results. Inline (not a standalone Review type), Schema.org allows
  // CreativeWork to carry review[], but for an agency case study the
  // cleanest is a top-level Review pointing back at our Organization.
  const REVIEW_JSON_LD = testimonial && !testimonial.placeholder
    ? {
        "@context": "https://schema.org",
        "@type": "Review",
        reviewBody: testimonial.quote,
        author: {
          "@type": "Person",
          name: testimonial.author,
          jobTitle: testimonial.role,
          worksFor: {
            "@type": "Organization",
            name: testimonial.client,
          },
        },
        itemReviewed: {
          "@id": "https://onyxcreative.asia/#organization",
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
      }
    : null;

  // Breadcrumbs give Google the sitelink path and give an answer engine an
  // explicit parent for the page it is about to quote.
  const BREADCRUMB_JSON_LD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://onyxcreative.asia" },
      { "@type": "ListItem", position: 2, name: "Works", item: "https://onyxcreative.asia/works" },
      { "@type": "ListItem", position: 3, name: project.client },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }}
      />
      {/* Top, caption + headline */}
      <section className="container-x pt-40 md:pt-52 pb-12 md:pb-16">
        {/* Just position and year: the discipline is listed further down
            under Discipline, so repeating it here only added noise. */}
        <div className="flex items-center gap-4 text-xs uppercase tracking-[0.25em] opacity-60 mb-8">
          <span className="tabular-nums">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span className="h-px flex-1 bg-ink/20 max-w-24" />
          <span>{project.year}</span>
        </div>

        <h1 className="text-display-md font-medium leading-[0.92] tracking-tight max-w-5xl text-balance">
          <RevealText text={project.client} />
        </h1>

        {project.blurb && (
          <p className="mt-6 max-w-2xl text-xl md:text-2xl leading-snug text-ink/70 text-balance">
            <T>{project.blurb}</T>
          </p>
        )}
      </section>

      {/* Hero cover (image + optional looping video) */}
      <section className="container-x pb-12 md:pb-20">
        <Reveal amount={0.1}>
          {/* 16:9 exactly matches the generated cover, so the whole
              device mockup stays in frame instead of being cropped. */}
          <div className="group relative aspect-[16/9] overflow-hidden rounded-3xl bg-ink">
            <ProjectCover
              src={project.cover}
              loop={project.coverLoopHd ?? project.coverLoop}
              alt={`${project.client}, ${project.title}`}
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
        {/* Joining first would make one composite string the dictionary can
            never match, so each discipline is translated on its own. */}
        <Meta
          label="Discipline"
          value={
            project.services?.length ? (
              project.services.map((s, i) => (
                <span key={s}>
                  {i > 0 && <span className="opacity-50"> · </span>}
                  <T>{s}</T>
                </span>
              ))
            ) : (
              <T>{project.category}</T>
            )
          }
        />
        {project.url && ctaLabel && (
          <div className="col-span-2 md:col-span-6 md:col-start-7 flex md:justify-end items-end">
            <Button href={project.url} newTab tone="dark">
              {ctaLabel}
            </Button>
          </div>
        )}
      </section>

      {/* Case study: what it is, what was wrong, what we built, what changed */}
      {project.study && (
        <>
          <CaseSection label="Overview">
            <p className="text-xl md:text-2xl leading-snug text-ink/85 max-w-3xl text-balance">
              <T>{project.study.overview}</T>
            </p>
          </CaseSection>

          <CaseSection label="What needed to change">
            <PointList items={project.study.needed} />
          </CaseSection>

          <CaseSection label="What we did">
            <PointList items={project.study.did} />
          </CaseSection>

          <CaseSection label="What changed">
            <PointList items={project.study.changed} />
          </CaseSection>
        </>
      )}

      {/* Client testimonial, only when one exists for this project */}
      {testimonial && (
        <section className="container-x pb-24 md:pb-32 border-t border-hairline pt-16 md:pt-20">
          {REVIEW_JSON_LD && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(REVIEW_JSON_LD),
              }}
            />
          )}
          <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-6">
            <T>What they say about us</T>
          </p>
          <Reveal>
            <blockquote className="text-xl sm:text-2xl md:text-display-sm font-medium leading-[1.2] md:leading-[1.05] tracking-tight max-w-4xl text-balance">
              <span className="opacity-40 mr-1">&ldquo;</span>
              <T>{testimonial.quote}</T>
              <span className="opacity-40 ml-0.5">&rdquo;</span>
            </blockquote>
          </Reveal>
          <Reveal delay={0.1}>
            <figcaption className="mt-8 text-sm flex items-baseline gap-3 flex-wrap">
              {/* Real names have no dictionary entry and fall through unchanged;
                  this only translates role-shaped attributions. */}
              <span className="font-medium">
                <T>{testimonial.author}</T>
              </span>
              <span className="opacity-50">·</span>
              <span className="opacity-70"><T>{testimonial.role}</T></span>
              <span className="opacity-50">·</span>
              <span className="opacity-70 italic">{testimonial.client}</span>
            </figcaption>
          </Reveal>
        </section>
      )}

      {/* Footer nav: prev / next / back */}
      <section className="container-x pb-24 md:pb-32 border-t border-hairline pt-12 md:pt-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Link
            href="/works"
            className="text-sm tracking-tight border-b border-ink/40 hover:border-ink pb-1 transition-colors w-fit"
          >
            ← <T>All works</T>
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

/** One numbered case-study beat: label on the left, content on the right. */
function CaseSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="container-x pb-20 md:pb-28 border-t border-hairline pt-12 md:pt-16">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        <Reveal className="md:col-span-3">
          <h2 className="text-xs uppercase tracking-[0.25em] opacity-60">
            <T>{label}</T>
          </h2>
        </Reveal>
        <Reveal className="md:col-span-8 md:col-start-5" delay={0.1}>
          {children}
        </Reveal>
      </div>
    </section>
  );
}

function PointList({ items }: { items: string[] }) {
  return (
    <ul className="border-t border-hairline max-w-3xl">
      {items.map((item, i) => (
        <li
          key={item}
          className="border-b border-hairline py-5 flex items-baseline gap-6 text-base md:text-lg"
        >
          <span className="text-xs opacity-45 tabular-nums w-6 shrink-0">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="leading-relaxed">
            <T>{item}</T>
          </span>
        </li>
      ))}
    </ul>
  );
}

function Meta({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="col-span-1 md:col-span-2">
      <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-2">
        <T>{label}</T>
      </p>
      <p className="text-base md:text-lg">{value}</p>
    </div>
  );
}
