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
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "agents.onyxcreative.asia" }],
        destination: "/agents/:path*",
      },
    ];
  },
};

export default nextConfig;
