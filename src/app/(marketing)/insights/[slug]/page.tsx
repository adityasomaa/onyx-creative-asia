import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categorySlug, findInsight, INSIGHTS } from "@/lib/insights";
import Image from "next/image";
import Reveal, { RevealText } from "@/components/Reveal";
import Button from "@/components/ui/Button";
import { T } from "@/lib/i18n";

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
    keywords: [piece.category, ...piece.topics],
    alternates: { canonical: url },
    openGraph: {
      title: piece.title,
      description: piece.excerpt,
      url,
      type: "article",
      publishedTime: piece.publishedAt,
      authors: ["Onyx Creative Asia"],
      section: piece.category,
      tags: piece.topics,
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

  // Answer engines quote a passage and cite the page it came from, so the
  // article ships the things that make it quotable: an explicit section,
  // the subjects it covers, a word count, and a speakable summary. The
  // breadcrumb gives both Google and an LLM the path back to the category.
  const wordCount = piece.sections.reduce(
    (n, sec) => n + sec.paragraphs.join(" ").split(/\s+/).length,
    0,
  );

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://onyxcreative.asia" },
      { "@type": "ListItem", position: 2, name: "Insights", item: "https://onyxcreative.asia/insights" },
      {
        "@type": "ListItem",
        position: 3,
        name: piece.category,
        item: `https://onyxcreative.asia/insights/category/${categorySlug(piece.category)}`,
      },
      { "@type": "ListItem", position: 4, name: piece.title },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
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
    keywords: [piece.category, ...piece.topics].join(", "),
    articleSection: piece.category,
    about: piece.topics.map((t) => ({ "@type": "Thing", name: t })),
    wordCount,
    timeRequired: `PT${piece.readingTimeMin}M`,
    inLanguage: "en",
    isAccessibleForFree: true,
    image: [piece.cover],
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "[data-speakable]"],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <article className="container-x pt-40 md:pt-52 pb-20 md:pb-28">
        {/* Everything on this page is centred: meta, headline, cover,
            and the body sections below it. */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-6 flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/insights"
              className="hover:opacity-70 transition-opacity"
            >
              ← <T>Insights</T>
            </Link>
            <span aria-hidden>·</span>
            <Link
              href={`/insights/category/${categorySlug(piece.category)}`}
              className="hover:opacity-70 transition-opacity"
            >
              <T>{piece.category}</T>
            </Link>
            <span aria-hidden>·</span>
            <span>
              {piece.readingTimeMin} <T>min read</T>
            </span>
            <span aria-hidden>·</span>
            <time dateTime={piece.publishedAt}>
              {DATE_FMT.format(new Date(piece.publishedAt))}
            </time>
          </p>

          <h1 className="text-display-sm md:text-display-md font-medium leading-[0.95] tracking-tight text-balance">
            <RevealText text={piece.title} />
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg md:text-xl text-ink/70 leading-relaxed">
            <T>{piece.excerpt}</T>
          </p>
        </div>

        {/* Cover */}
        <Reveal amount={0.1}>
          <div className="relative mt-12 md:mt-16 aspect-[16/9] overflow-hidden rounded-3xl bg-ink">
            <Image
              src={piece.cover}
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 90vw, 100vw"
              className="object-cover grayscale contrast-[1.05]"
            />
          </div>
        </Reveal>

        {/* Thin rule closes the header block off from the article body. */}
        <div className="mx-auto mt-12 md:mt-16 h-px w-full max-w-3xl bg-ink/12" />

        <div className="mx-auto mt-12 md:mt-16 max-w-2xl text-center">
          {piece.sections.map((sec) => (
            <section key={sec.heading} className="mb-12 md:mb-14 last:mb-0">
              <h2 className="text-2xl md:text-3xl font-medium tracking-tight leading-snug">
                <T>{sec.heading}</T>
              </h2>
              {sec.paragraphs.map((para, j) => (
                <p
                  key={j}
                  className="mt-5 text-lg md:text-xl leading-[1.7] text-ink/85"
                >
                  <T>{para}</T>
                </p>
              ))}
            </section>
          ))}
        </div>

        {/* And another after the content. */}
        <div className="mx-auto mt-14 md:mt-16 h-px w-full max-w-3xl bg-ink/12" />
      </article>

      {otherInsights.length > 0 && (
        <section className="container-x border-t border-hairline pt-16 md:pt-20 pb-24 md:pb-32">
          <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-10">
            <T>(Keep reading)</T>
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {otherInsights.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/insights/${other.slug}`}
                  className="group block border-t border-ink pt-6 transition-opacity duration-300 hover:opacity-80"
                >
                  <p className="text-xs uppercase tracking-[0.18em] opacity-60 mb-3">
                    <T>{other.category}</T>
                  </p>
                  <p className="text-lg md:text-xl font-medium tracking-tight leading-snug">
                    <T>{other.title}</T>
                  </p>
                  <p className="mt-3 text-sm text-ink/60 leading-relaxed line-clamp-3">
                    <T>{other.excerpt}</T>
                  </p>
                  <p className="mt-4 text-xs uppercase tracking-[0.18em] opacity-50 flex items-center gap-2">
                    <span><T>Read</T></span>
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
              <T>Like the way we think? Tell us what you&apos;re trying to build.</T>
            </p>
            <Button href="/enquire" tone="dark">
              Start a project
            </Button>
          </div>
        </section>
      )}
    </>
  );
}
