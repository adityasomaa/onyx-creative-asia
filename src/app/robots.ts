import type { MetadataRoute } from "next";

/**
 * Robots policy. Allow all public pages; block private routes that
 * shouldn't show up in search (the leads API, our own internal probes).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: "https://onyxcreative.asia/sitemap.xml",
    host: "https://onyxcreative.asia",
  };
}
