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
    // `beforeFiles` fires BEFORE Next.js touches the filesystem, but that
    // also includes static assets in public/ and the _next/* bundles. A
    // bare `/:path*` rewrite would grab `/fonts/Foo.ttf`, `/_next/static/
    // css/...`, etc. and 404 them — which is exactly the symptom we saw
    // (Tailwind CSS unstyled, fonts dropped to serif fallback).
    //
    // The path regex `(?!...)[^.]+` excludes:
    //   - paths beginning with `_next`, `fonts`, `projects`, `videos`,
    //     `api/leads` (the main-site contact API)
    //   - any path containing a dot (catches .ico, .png, .webp, .mp4,
    //     .json, etc. that the dashboard would never legitimately serve)
    // Everything else (clean URLs like /login, /director, /api/auth)
    // gets rewritten under /agents/.
    const HAS = [{ type: "host" as const, value: "agents.onyxcreative.asia" }];
    return {
      beforeFiles: [
        { source: "/", has: HAS, destination: "/agents" },
        {
          source:
            "/:path((?!_next|fonts|projects|videos|api/leads)[^.]+)",
          has: HAS,
          destination: "/agents/:path",
        },
      ],
    };
  },
};

export default nextConfig;
