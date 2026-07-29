import type { Metadata } from "next";
import { RevealText } from "@/components/Reveal";
import InsightsBrowser from "@/components/insights/InsightsBrowser";
import {
  INSIGHTS,
  INSIGHT_CATEGORIES,
  CATEGORY_BLURB,
  categorySlug,
} from "@/lib/insights";
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
  const base = "https://onyxcreative.asia";

  // A Blog with its posts enumerated, plus the categories as sub-collections.
  // Answer engines read this to know what the section covers without having
  // to crawl and cluster eight article pages themselves.
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${base}/insights#blog`,
    name: "Onyx Insights",
    description:
      "Market, technology, news, and practical guides on digital business development in Asia, written by the Onyx Creative Asia studio.",
    url: `${base}/insights`,
    inLanguage: "en",
    publisher: { "@id": `${base}/#organization` },
    blogPost: INSIGHTS.map((piece) => ({
      "@type": "BlogPosting",
      headline: piece.title,
      description: piece.excerpt,
      url: `${base}/insights/${piece.slug}`,
      datePublished: piece.publishedAt,
      articleSection: piece.category,
      keywords: [piece.category, ...piece.topics].join(", "),
    })),
    hasPart: INSIGHT_CATEGORIES.map((c) => ({
      "@type": "CollectionPage",
      name: `${c} insights`,
      description: CATEGORY_BLURB[c],
      url: `${base}/insights/category/${categorySlug(c)}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      <section className="container-x pt-40 md:pt-52 pb-10 md:pb-14">
        <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-6">
          <T>Insights</T>
        </p>
        <h1 className="text-display-md font-medium leading-[0.95] tracking-tight max-w-4xl text-balance">
          <RevealText text="Useful articles" />
        </h1>
        <p
          data-speakable
          className="mt-8 max-w-xl text-lg text-ink/70 leading-relaxed"
        >
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
