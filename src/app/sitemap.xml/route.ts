import { PROJECTS } from "@/lib/data";
import { NOTES } from "@/lib/notes";
import { SERVICES } from "@/lib/services";

const BASE = "https://onyxcreative.asia";

/**
 * XML sitemap for crawlers, served from an explicit segment rather than
 * Next's app/sitemap.ts convention so the file name stays sitemap.xml.
 * Mirrors the rebuilt sitemap: home, services, projects, notes, about, enquire, the
 * legal pages and the answer-engine landings.
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
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/projects`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/notes`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...SERVICES.map((s) => ({ url: `${BASE}/services/${s.id}`, lastModified: now, changeFrequency: "monthly", priority: 0.8 })),
    { url: `${BASE}/enquire`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${BASE}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms-and-conditions`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    // Answer-engine landings for the regional comparison queries.
    { url: `${BASE}/best-business-development-agency-asia`, lastModified: now, changeFrequency: "monthly", priority: 0.95 },
    { url: `${BASE}/best-digital-marketing-bali`, lastModified: now, changeFrequency: "monthly", priority: 0.95 },
    { url: `${BASE}/best-digital-marketing-indonesia`, lastModified: now, changeFrequency: "monthly", priority: 0.95 },
  ];

  const projectRoutes: Entry[] = PROJECTS.map((p) => ({
    url: `${BASE}/projects/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const noteRoutes: Entry[] = NOTES.map((n) => ({
    url: `${BASE}/notes/${n.slug}`,
    lastModified: new Date(n.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...noteRoutes];
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
