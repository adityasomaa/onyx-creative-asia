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
    // The service taxonomy was reorganised (4 disciplines -> 6 services).
    // Old detail URLs were indexed, so point them at the closest new one
    // instead of 404ing. Also covers the retired /pricing page and the
    // removed Great Bali Properties case study.
    return [
      { source: "/services/web-development", destination: "/services/digital-presence", permanent: true },
      { source: "/services/paid-media", destination: "/services/digital-marketing", permanent: true },
      { source: "/services/social-media", destination: "/services/digital-marketing", permanent: true },
      { source: "/services/ai-systems", destination: "/services/ai-automation", permanent: true },
      // The contact page moved to /enquire.
      { source: "/contact", destination: "/enquire", permanent: true },
      { source: "/pricing", destination: "/services", permanent: true },
      { source: "/works/great-bali-properties", destination: "/works", permanent: true },
    ];
  },
  // No host rewrites any more.
  //
  // agents.onyxcreative.asia and sigap.onyxcreative.asia were detached
  // from the project, so the host conditions they matched can never fire.
  // Both areas still exist on the apex, at /agents and /sigap.
  //
  // If a subdomain comes back, note why these were explicit rewrites per
  // route rather than a catch-all: a catch-all in `beforeFiles` also
  // swallows /_next/* and /fonts/*, which 404s the bundle and the fonts,
  // and a catch-all on /:path+ re-matches its own output (/agents becomes
  // /agents/agents).
};

export default nextConfig;
