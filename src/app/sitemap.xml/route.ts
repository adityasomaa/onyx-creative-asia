import { PROJECTS, SERVICES } from "@/lib/data";
import { INSIGHTS, INSIGHT_CATEGORIES, categorySlug } from "@/lib/insights";

const BASE = "https://onyxcreative.asia";

/**
 * XML sitemap for crawlers.
 *
 * This is a plain route handler rather than Next's `app/sitemap.ts`
 * convention: that convention claims the whole `/sitemap` path, which
 * collides with the human-readable sitemap page at /sitemap. Serving the
 * XML from an explicit `sitemap.xml` segment leaves that path free.
 */

type Entry = {
  url: string;
  lastModified: Date;
  changeFrequency: string;
  priority: number;
};

function buildEntries(): Entry[] {
  const now = new Date();

  const staticRoutes: Entry[] = [
    { url: `${BASE}/`,         lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/works`,    lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/about`,    lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/insights`, lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/enquire`,  lastModified: now, changeFrequency: "yearly",  priority: 0.7 },
    { url: `${BASE}/sitemap`,  lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/privacy`,  lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/terms`,    lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    // Generative Engine Optimization (GEO) landings — answer-engine-
    // friendly comparison + FAQ pages targeting "best digital marketing
    // agency in Bali / Indonesia" queries.
    { url: `${BASE}/best-digital-marketing-bali`,      lastModified: now, changeFrequency: "monthly", priority: 0.95 },
    { url: `${BASE}/best-digital-marketing-indonesia`, lastModified: now, changeFrequency: "monthly", priority: 0.95 },
  ];

  const serviceRoutes: Entry[] = SERVICES.map((s) => ({
    url: `${BASE}/services/${s.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const projectRoutes: Entry[] = PROJECTS.map((p) => ({
    url: `${BASE}/works/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // One entry per category. These are the pages a "market insight" or
  // "how-to guide" query can actually land on; the filter row on /insights
  // is client state and produces no URL of its own.
  const categoryRoutes: Entry[] = INSIGHT_CATEGORIES.map((c) => ({
    url: `${BASE}/insights/category/${categorySlug(c)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const insightRoutes: Entry[] = INSIGHTS.map((i) => ({
    url: `${BASE}/insights/${i.slug}`,
    lastModified: new Date(i.publishedAt),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...projectRoutes,
    ...categoryRoutes,
    ...insightRoutes,
  ];
}

export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${buildEntries()
  .map(
    (e) => `  <url>
    <loc>${e.url}</loc>
    <lastmod>${e.lastModified.toISOString()}</lastmod>
    <changefreq>${e.changeFrequency}</changefreq>
    <priority>${e.priority.toFixed(2)}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
