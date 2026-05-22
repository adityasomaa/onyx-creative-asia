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
  async rewrites() {
    // Subdomain splits:
    //   agents.onyxcreative.asia/* → /agents/* (internal route)
    //   local.onyxcreative.asia/*  → /sigap/*  (Sigap sub-brand landing)
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
    const HAS_LOCAL = [
      { type: "host" as const, value: "local.onyxcreative.asia" },
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

        // ─── local.* (Sigap sub-brand) ──────────────────────────
        // Single-page landing today. Add more routes here as the
        // funnel grows (success page after WA click, FAQ deep-dive,
        // case studies, etc.).
        { source: "/", has: HAS_LOCAL, destination: "/sigap" },
      ],
    };
  },
};

export default nextConfig;
