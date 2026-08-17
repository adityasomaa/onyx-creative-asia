import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    // The service taxonomy has been reorganised twice: 4 disciplines -> 6
    // services -> the 7 of the 2026 rebrand. Every generation of those
    // URLs was indexed, so each one points at its closest current page
    // rather than 404ing. Chains are collapsed to a single hop.
    return [
      // 2026 rebrand: 6 services -> 7
      { source: "/services/digital-presence", destination: "/services/web-software-development", permanent: true },
      { source: "/services/digital-marketing", destination: "/services/ads-management", permanent: true },
      { source: "/services/creative-studio", destination: "/services/graphic-design", permanent: true },
      // AI automation is now a capability of the build service, not a service.
      { source: "/services/ai-automation", destination: "/services/web-software-development", permanent: true },
      { source: "/services/managed-services", destination: "/services/maintenance-service", permanent: true },
      // Original 4 disciplines, pointed straight at the current page.
      { source: "/services/web-development", destination: "/services/web-software-development", permanent: true },
      { source: "/services/paid-media", destination: "/services/ads-management", permanent: true },
      { source: "/services/social-media", destination: "/services/social-media-management", permanent: true },
      { source: "/services/ai-systems", destination: "/services/web-software-development", permanent: true },
      { source: "/pricing", destination: "/services", permanent: true },
      { source: "/works/great-bali-properties", destination: "/works", permanent: true },
    ];
  },
  async rewrites() {
    // Subdomain splits:
    //   agents.onyxcreative.asia/* → /agents/* (internal route)
    //   sigap.onyxcreative.asia/*  → /sigap/*  (Sigap sub-brand landing)
    //
    // Use EXPLICIT rewrites per known route rather than a catch-all. Two
    // reasons:
    //   1. A catch-all in `beforeFiles` would also rewrite `/_next/*`,
    //      `/fonts/*`, etc. and 404 the bundle/font assets — Tailwind
    //      CSS and Neue Montreal stopped loading because of this.
    //   2. Catch-all on `/:path+` could re-match the rewritten path
    //      (`/agents` → looks up against the catch-all again → rewrites
    //      to `/agents/agents` → 404).
    //
    // Add new pages on either subdomain by extending the lists below.
    const HAS_AGENTS = [
      { type: "host" as const, value: "agents.onyxcreative.asia" },
    ];
    const HAS_SIGAP = [
      { type: "host" as const, value: "sigap.onyxcreative.asia" },
    ];
    return {
      beforeFiles: [
        // ─── agents.* (internal dashboard) ──────────────────────
        { source: "/", has: HAS_AGENTS, destination: "/agents" },
        { source: "/login", has: HAS_AGENTS, destination: "/agents/login" },
        { source: "/api/auth", has: HAS_AGENTS, destination: "/agents/api/auth" },
        { source: "/dashboard", has: HAS_AGENTS, destination: "/agents/dashboard" },
        { source: "/submissions", has: HAS_AGENTS, destination: "/agents/submissions" },
        {
          source: "/submissions/:id",
          has: HAS_AGENTS,
          destination: "/agents/submissions/:id",
        },
        { source: "/flow", has: HAS_AGENTS, destination: "/agents/flow" },
        {
          source: "/onboarding/:slug",
          has: HAS_AGENTS,
          destination: "/agents/onboarding/:slug",
        },
        {
          source: "/results/:slug",
          has: HAS_AGENTS,
          destination: "/agents/results/:slug",
        },
        {
          source: "/:slug(director|strategist|maker|account-manager)",
          has: HAS_AGENTS,
          destination: "/agents/:slug",
        },

        // ─── sigap.* (Sigap sub-brand) ──────────────────────────
        // Single-page landing today. Add more routes here as the
        // funnel grows (success page after WA click, FAQ deep-dive,
        // case studies, etc.).
        { source: "/", has: HAS_SIGAP, destination: "/sigap" },
      ],
    };
  },
};

export default nextConfig;
