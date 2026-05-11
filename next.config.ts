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
    // Main domain users hitting /agents directly are blocked in middleware.
    //
    // Use `beforeFiles` so the rewrite fires BEFORE Next.js tries to match
    // the filesystem — otherwise visiting agents.onyxcreative.asia/ would
    // match app/page.tsx (the marketing home) and never get rewritten.
    // Two patterns: `/` for the root, `/:path+` for everything below.
    return {
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "host", value: "agents.onyxcreative.asia" }],
          destination: "/agents",
        },
        {
          source: "/:path+",
          has: [{ type: "host", value: "agents.onyxcreative.asia" }],
          destination: "/agents/:path+",
        },
      ],
    };
  },
};

export default nextConfig;
