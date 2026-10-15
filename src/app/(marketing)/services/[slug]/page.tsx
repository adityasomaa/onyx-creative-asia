import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICES } from "@/lib/services";
import ServiceDetail from "@/components/services/ServiceDetail";

type Params = { slug: string };
const BASE = "https://onyxcreative.asia";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const s = SERVICES.find((x) => x.id === slug);
  if (!s) return { title: "Not found" };
  const url = `/services/${s.id}`;
  const description = `${s.short.en} ${s.headline.en}`;
  return {
    title: s.title.en,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${s.title.en} | Onyx Creative Asia`, description, url },
  };
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const s = SERVICES.find((x) => x.id === slug);
  if (!s) notFound();

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title.en,
    description: s.body.en,
    url: `${BASE}/services/${s.id}`,
    provider: { "@id": `${BASE}/#organization` },
    areaServed: ["Indonesia", "Asia"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${s.title.en}: what's included`,
      itemListElement: s.included.map((it) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: it.en } })),
    },
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      { "@type": "ListItem", position: 2, name: "Services", item: `${BASE}/services` },
      { "@type": "ListItem", position: 3, name: s.title.en, item: `${BASE}/services/${s.id}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <ServiceDetail service={s} />
    </>
  );
}
