import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NOTES, noteBySlug } from "@/lib/notes";
import NoteArticle from "@/components/notes2/NoteArticle";

type Params = { slug: string };
const BASE = "https://onyxcreative.asia";

export function generateStaticParams() {
  return NOTES.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const n = noteBySlug(slug);
  if (!n) return { title: "Not found" };
  const url = `/notes/${n.slug}`;
  return {
    title: n.title.en,
    description: n.dek.en,
    alternates: { canonical: url },
    openGraph: { title: n.title.en, description: n.dek.en, url, type: "article", images: [n.cover], publishedTime: n.date },
  };
}

export default async function NotePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const note = noteBySlug(slug);
  if (!note) notFound();

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: note.title.en,
    description: note.dek.en,
    image: `${BASE}${note.cover}`,
    datePublished: note.date,
    dateModified: note.date,
    inLanguage: "en",
    author: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "Onyx Creative Asia" },
    publisher: { "@id": `${BASE}/#organization` },
    mainEntityOfPage: `${BASE}/notes/${note.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      <NoteArticle note={note} />
    </>
  );
}
