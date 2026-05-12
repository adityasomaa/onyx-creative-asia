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
    // Add new agents by extending the slug alternation below.
    const HAS = [{ type: "host" as const, value: "agents.onyxcreative.asia" }];
    return {
      beforeFiles: [
        { source: "/", has: HAS, destination: "/agents" },
        { source: "/login", has: HAS, destination: "/agents/login" },
        { source: "/api/auth", has: HAS, destination: "/agents/api/auth" },
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
