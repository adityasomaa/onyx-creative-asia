import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findInsight, INSIGHTS } from "@/lib/insights";
import { RevealText } from "@/components/Reveal";

const DATE_FMT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

type Params = { slug: string };

export function generateStaticParams() {
  return INSIGHTS.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const piece = findInsight(slug);
  if (!piece) return {};
  const url = `/insights/${piece.slug}`;
  return {
    title: piece.title,
    description: piece.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: piece.title,
      description: piece.excerpt,
      url,
      type: "article",
      publishedTime: piece.publishedAt,
      authors: ["Onyx Creative Asia"],
      tags: piece.tag.split("·").map((t) => t.trim()),
    },
    twitter: {
      card: "summary_large_image",
      title: piece.title,
      description: piece.excerpt,
    },
  };
}

export default async function InsightPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const piece = findInsight(slug);
  if (!piece) notFound();

  const otherInsights = INSIGHTS.filter((i) => i.slug !== piece.slug).slice(0, 3);

  // JSON-LD article schema for richer search results.
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: piece.title,
    description: piece.excerpt,
    datePublished: piece.publishedAt,
    dateModified: piece.publishedAt,
    author: {
      "@type": "Organization",
      name: "Onyx Creative Asia",
      url: "https://onyxcreative.asia",
    },
    publisher: {
      "@type": "Organization",
      name: "Onyx Creative Asia",
      logo: {
        "@type": "ImageObject",
        url: "https://onyxcreative.asia/icon",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://onyxcreative.asia/insights/${piece.slug}`,
    },
    keywords: piece.tag,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <article className="container-x pt-40 md:pt-52 pb-20 md:pb-28">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-6 flex items-center gap-3 flex-wrap">
            <Link
              href="/insights"
              className="hover:opacity-70 transition-opacity"
            >
              ← Insights
            </Link>
            <span aria-hidden>·</span>
            <span>{piece.tag}</span>
            <span aria-hidden>·</span>
            <span>{piece.readingTimeMin} min read</span>
            <span aria-hidden>·</span>
            <time dateTime={piece.publishedAt}>
              {DATE_FMT.format(new Date(piece.publishedAt))}
            </time>
          </p>

          <h1 className="text-display-sm md:text-display-md font-medium leading-[0.95] tracking-tight text-balance">
            <RevealText text={piece.title} />
          </h1>

          <p className="mt-10 text-xl md:text-2xl text-ink/70 leading-relaxed font-light italic max-w-2xl">
            {piece.excerpt}
          </p>
        </div>

        <div className="mt-16 md:mt-20 max-w-2xl">
          {piece.body.map((block, i) =>
            typeof block === "string" ? (
              <p
                key={i}
                className="text-lg md:text-xl leading-[1.7] text-ink/85 mb-7"
              >
                {block}
              </p>
            ) : (
              <blockquote
                key={i}
                className="my-10 md:my-12 border-l-2 border-ink pl-6 md:pl-8"
              >
                <p className="text-2xl md:text-3xl font-medium leading-[1.25] tracking-tight text-ink italic">
                  &ldquo;{block.text}&rdquo;
                </p>
                {block.attribution && (
                  <p className="mt-4 text-sm uppercase tracking-[0.18em] opacity-60">
                    — {block.attribution}
                  </p>
                )}
              </blockquote>
            )
          )}
        </div>
      </article>

      {otherInsights.length > 0 && (
        <section className="container-x border-t border-hairline pt-16 md:pt-20 pb-24 md:pb-32">
          <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-10">
            (Keep reading)
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {otherInsights.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/insights/${other.slug}`}
                  className="group block border-t border-ink pt-6 transition-opacity duration-300 hover:opacity-80"
                >
                  <p className="text-xs uppercase tracking-[0.18em] opacity-60 mb-3">
                    {other.tag}
                  </p>
                  <p className="text-lg md:text-xl font-medium tracking-tight leading-snug">
                    {other.title}
                  </p>
                  <p className="mt-3 text-sm text-ink/60 leading-relaxed line-clamp-3">
                    {other.excerpt}
                  </p>
                  <p className="mt-4 text-xs uppercase tracking-[0.18em] opacity-50 flex items-center gap-2">
                    <span>Read</span>
                    <span
                      aria-hidden
                      className="transition-transform duration-500 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-16 md:mt-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-t border-hairline pt-12 md:pt-16">
            <p className="text-lg max-w-md text-ink/80 leading-relaxed">
              Like the way we think? Tell us what you're trying to build.
            </p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3 text-bone transition-transform duration-500 ease-out-expo hover:scale-[1.03] w-fit"
            >
              <span className="text-sm font-medium">Start a project</span>
              <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
