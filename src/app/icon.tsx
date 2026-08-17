import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

// 192×192 — large enough that Google's favicon crawler picks this over
// apple-icon.tsx (which is 180), and a multiple of 48 per Google's
// favicon guidelines.
export const size = { width: 192, height: 192 };
export const contentType = "image/png";

/**
 * Brand favicon: the CA mark on Onyx Black.
 *
 * The mark is a raster, so it is inlined as a data URI rather than
 * fetched. ImageResponse runs where a relative URL has no origin to
 * resolve against, and reading the file at build time keeps the icon in
 * step with whatever `public/brand` currently holds.
 */
export default function Icon() {
  const mark = fs.readFileSync(
    path.join(process.cwd(), "public/brand/ca-mark-tight-512.png"),
  );
  const src = `data:image/png;base64,${mark.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0A0A0A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 32,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" width={140} height={93} />
      </div>
    ),
    size,
  );
}
