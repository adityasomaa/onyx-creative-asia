import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

// 192×192 — large enough that Google's favicon crawler will pick this
// over apple-icon.tsx (which is 180), and a multiple of 48 per Google's
// favicon guidelines.
export const size = { width: 192, height: 192 };
export const contentType = "image/png";

/**
 * Raster favicon fallback. icon.svg is the primary and adapts to the
 * browser's colour scheme; this covers anything that cannot use an SVG
 * favicon. Those skew light-UI and this cannot adapt, so it carries the
 * dark mark to match the SVG's default.
 *
 * The mark is a raster, so it is inlined as a data URI rather than
 * fetched: ImageResponse renders where a relative URL has no origin to
 * resolve against. Reading from `public/` at build time keeps the icon in
 * step with whatever the header is using.
 */
export default function Icon() {
  const mark = fs.readFileSync(
    path.join(process.cwd(), "public/onyx-logo-black.png"),
  );
  const src = `data:image/png;base64,${mark.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* 850x512 source, drawn at ~72% width so the mark keeps a margin */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" width={138} height={83} />
      </div>
    ),
    size,
  );
}
