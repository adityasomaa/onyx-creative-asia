import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  images: {
    // Vercel's image optimizer is off.
    //
    // The Hobby plan's transformation quota ran out and every
    // /_next/image request started returning 402
    // (OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED), which broke every image
    // on the site at once: the logo, the work covers, the article covers.
    // Serving the files straight from public/ costs nothing and cannot
    // hit a quota.
    //
    // The trade is no automatic AVIF/WebP or resizing, so source files
    // have to be the right size themselves. They already are: the logos
    // are ~60KB, the work posters are pre-rendered at their display size,
    // and the Unsplash URLs request a width rather than the original.
    //
    // Turn this back on if the plan is upgraded; `formats` and
    // `remotePatterns` are kept so it is a one-line revert.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    // The October 2026 rebuild adopted a new sitemap. Every URL the old
    // site exposed, including the earlier generations it already
    // redirected, points at its nearest new equivalent so nothing that
    // was indexed or bookmarked 404s.
    return [
      // portfolio: /works -> /projects
      { source: "/works", destination: "/projects", permanent: true },
      { source: "/works/great-bali-properties", destination: "/projects", permanent: true },
      // Slug-shaped paths only: public/works/ still serves the case-study
      // covers and loops, and a bare :slug would redirect those too.
      { source: "/works/:slug([a-z0-9-]+)", destination: "/projects/:slug", permanent: true },
      // blog: /insights -> /notes (the old posts were retired with the rebuild)
      { source: "/insights", destination: "/notes", permanent: true },
      { source: "/insights/:path*", destination: "/notes", permanent: true },
      // contact: /enquire (and the older /contact redirect) -> /contact
      { source: "/enquire", destination: "/contact", permanent: true },
      // legal
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/terms", destination: "/terms-and-conditions", permanent: true },
      // services now live on the home page's Expertise section
      { source: "/services", destination: "/#expertise", permanent: true },
      { source: "/services/:path*", destination: "/#expertise", permanent: true },
      { source: "/pricing", destination: "/#pricing", permanent: true },
      // the human-readable sitemap page is gone; the XML sitemap remains
      { source: "/sitemap", destination: "/", permanent: true },
    ];
  },
  // No host rewrites any more.
  //
  // agents.onyxcreative.asia was detached from the project, so the host
  // conditions it matched can never fire. The area still exists on the
  // apex, at /agents.
  //
  // If a subdomain comes back, note why these were explicit rewrites per
  // route rather than a catch-all: a catch-all in `beforeFiles` also
  // swallows /_next/* and /fonts/*, which 404s the bundle and the fonts,
  // and a catch-all on /:path+ re-matches its own output (/agents becomes
  // /agents/agents).
};

export default nextConfig;
