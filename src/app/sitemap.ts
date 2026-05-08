import type { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/data";
import { INSIGHTS } from "@/lib/insights";

const BASE = "https://onyxcreative.asia";

/**
 * Dynamic sitemap. Static marketing routes + per-project case study pages
 * + per-insight article pages. Update priorities and change frequency as
 * new content lands.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,         lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/works`,    lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/about`,    lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/insights`, lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/contact`,  lastModified: now, changeFrequency: "yearly",  priority: 0.7 },
    { url: `${BASE}/privacy`,  lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/terms`,    lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = PROJECTS.map((p) => ({
    url: `${BASE}/works/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const insightRoutes: MetadataRoute.Sitemap = INSIGHTS.map((i) => ({
    url: `${BASE}/insights/${i.slug}`,
    lastModified: new Date(i.publishedAt),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...insightRoutes];
}
