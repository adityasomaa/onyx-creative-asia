import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Onyx Creative Asia";

/**
 * Default social preview: the mark on ink, nothing else.
 *
 * This is what WhatsApp, and every other link unfurler, shows when the
 * site is shared. It used to be a typographic card with headline, footer
 * and URL, all of which shrink to unreadable in a WhatsApp preview
 * thumbnail. A single centred mark survives that crop at any size.
 *
 * Node runtime rather than edge, because the mark is read off disk.
 * 1200x630 is kept: it is the size every platform expects, and WhatsApp
 * renders a large card from it rather than a small square thumbnail.
 */
export default function Image() {
  const mark = fs.readFileSync(
    path.join(process.cwd(), "public/onyx-logo-white.png"),
  );
  const src = `data:image/png;base64,${mark.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          background: "#0E0E0E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* 850x512 source, ~36% of the canvas width so it keeps air around it */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" width={430} height={259} />
      </div>
    ),
    { ...size },
  );
}
