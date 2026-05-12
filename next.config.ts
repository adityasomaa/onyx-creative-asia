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
    // Subdomain split:
    //   agents.onyxcreative.asia/* → /agents/* (internal route)
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
    // Add new agents-platform pages by extending the list below.
    const HAS = [{ type: "host" as const, value: "agents.onyxcreative.asia" }];
    return {
      beforeFiles: [
        // root → roster
        { source: "/", has: HAS, destination: "/agents" },

        // auth pages
        { source: "/login", has: HAS, destination: "/agents/login" },
        { source: "/api/auth", has: HAS, destination: "/agents/api/auth" },

        // platform top-level sections
        { source: "/dashboard", has: HAS, destination: "/agents/dashboard" },
        { source: "/submissions", has: HAS, destination: "/agents/submissions" },
        {
          source: "/submissions/:id",
          has: HAS,
          destination: "/agents/submissions/:id",
        },
        { source: "/flow", has: HAS, destination: "/agents/flow" },

        // per-client portals (Phase 2 — page files land later, but the
        // rewrite is here so we don't forget when they ship)
        {
          source: "/onboarding/:slug",
          has: HAS,
          destination: "/agents/onboarding/:slug",
        },
        {
          source: "/results/:slug",
          has: HAS,
          destination: "/agents/results/:slug",
        },

        // agent detail — slug allow-list keeps it from re-rewriting itself
        {
          source: "/:slug(director|strategist|maker|account-manager)",
          has: HAS,
          destination: "/agents/:slug",
        },
      ],
    };
  },
};

export default nextConfig;
