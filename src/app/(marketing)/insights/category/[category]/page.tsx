import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CATEGORY_BLURB,
  INSIGHT_CATEGORIES,
  categoryFromSlug,
  categorySlug,
  insightsByCategory,
} from "@/lib/insights";
import Reveal, { RevealText } from "@/components/Reveal";
import { T } from "@/lib/i18n";

/**
 * One indexable page per category.
 *
 * The filter row on /insights is client state, so every category looked
 * identical to a crawler: one URL, one title, one description. Giving each
 * category its own page means "market insight" and "how-to guide" queries
 * have something specific to land on, and each page carries a real
 * CollectionPage + ItemList that an answer engine can enumerate.
 */

type Params = { category: string };

const DATE_FMT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function generateStaticParams() {
  return INSIGHT_CATEGORIES.map((c) => ({ category: categorySlug(c) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = categoryFromSlug(category);
  if (!cat) return { title: "Not found" };

  const url = `/insights/category/${categorySlug(cat)}`;
  const title = `${cat} insights`;
  return {
    title,
    description: CATEGORY_BLURB[cat],
    alternates: { canonical: url },
    openGraph: {
      title,
      description: CATEGORY_BLURB[cat],
      url,
      type: "website",
    },
  };
}

export default async function InsightCategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category } = await params;
  const cat = categoryFromSlug(category);
  if (!cat) notFound();

  const items = insightsByCategory(cat);
  const base = "https://onyxcreative.asia";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cat} insights`,
    description: CATEGORY_BLURB[cat],
    url: `${base}/insights/category/${categorySlug(cat)}`,
    isPartOf: { "@type": "Blog", name: "Onyx Insights", url: `${base}/insights` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((piece, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${base}/insights/${piece.slug}`,
        name: piece.title,
      })),
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: base },
      { "@type": "ListItem", position: 2, name: "Insights", item: `${base}/insights` },
      { "@type": "ListItem", position: 3, name: cat },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="container-x pt-40 md:pt-52 pb-12 md:pb-16">
        <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-8 flex items-center gap-3">
          <Link href="/insights" className="hover:opacity-70 transition-opacity">
            ← <T>Insights</T>
          </Link>
          <span aria-hidden>·</span>
          <span>
            {items.length} <T>articles</T>
          </span>
        </p>

        <h1 className="text-display-md font-medium leading-[0.92] tracking-tight max-w-4xl text-balance">
          <RevealText text={cat} />
        </h1>

        <p
          data-speakable
          className="mt-6 max-w-2xl text-xl md:text-2xl leading-snug text-ink/70 text-balance"
        >
          <T>{CATEGORY_BLURB[cat]}</T>
        </p>
      </section>

      {/* Sibling categories, so a reader (and a crawler) can walk the taxonomy */}
      <section className="container-x pb-10 md:pb-12">
        <ul className="flex flex-wrap gap-2">
          {INSIGHT_CATEGORIES.map((c) => (
            <li key={c}>
              <Link
                href={`/insights/category/${categorySlug(c)}`}
                className={`inline-flex rounded-full border px-4 py-2 text-sm tracking-tight transition-colors duration-300 ${
                  c === cat
                    ? "border-ink bg-ink text-bone"
                    : "border-hairline text-ink/70 hover:border-ink/40"
                }`}
              >
                <T>{c}</T>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-x pb-24 md:pb-32 border-t border-hairline pt-12 md:pt-16">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {items.map((piece, i) => (
            <li key={piece.slug}>
              <Reveal delay={i * 0.05}>
                <Link
                  href={`/insights/${piece.slug}`}
                  className="group block"
                  data-cursor="hover"
                >
                  <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-ink">
                    <Image
                      src={piece.cover}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-[0.18em] opacity-55 flex items-center gap-2">
                      <span>
                        {piece.readingTimeMin} <T>min read</T>
                      </span>
                      <span aria-hidden>·</span>
                      <span>{DATE_FMT.format(new Date(piece.publishedAt))}</span>
                    </p>
                    <h2 className="mt-2 text-lg md:text-xl font-medium tracking-tight leading-snug">
                      <T>{piece.title}</T>
                    </h2>
                    <p className="mt-2 text-sm text-ink/65 leading-relaxed line-clamp-2">
                      <T>{piece.excerpt}</T>
                    </p>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
