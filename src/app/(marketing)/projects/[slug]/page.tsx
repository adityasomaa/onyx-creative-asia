import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECTS, getTestimonialForProject } from "@/lib/data";
import ProjectDetail from "@/components/projects2/ProjectDetail";

type Params = { slug: string };
const BASE = "https://onyxcreative.asia";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = PROJECTS.find((x) => x.slug === slug);
  if (!p) return { title: "Not found" };
  const url = `/projects/${p.slug}`;
  const title = `${p.client}, ${p.title}`;
  return {
    title,
    description: p.description,
    alternates: { canonical: url },
    openGraph: { title, description: p.description, url, type: "article", images: [p.cover] },
    twitter: { card: "summary_large_image", title, description: p.description, images: [p.cover] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  const t = getTestimonialForProject(project.slug);
  // Review markup only for a client's own words: a placeholder quote in
  // review rich results is exactly what Google's policy forbids.
  const review =
    t && !t.placeholder
      ? {
          "@context": "https://schema.org",
          "@type": "Review",
          reviewBody: t.quote,
          author: { "@type": "Person", name: t.author, jobTitle: t.role, worksFor: { "@type": "Organization", name: t.client } },
          itemReviewed: { "@id": `${BASE}/#organization` },
          reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
        }
      : null;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      { "@type": "ListItem", position: 2, name: "Projects", item: `${BASE}/projects` },
      { "@type": "ListItem", position: 3, name: project.client },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {review && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(review) }} />}
      <ProjectDetail project={project} />
    </>
  );
}
