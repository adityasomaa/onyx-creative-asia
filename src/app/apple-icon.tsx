import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Apple touch icon (180×180, iOS home-screen shortcut). Same mark as the
 * favicon; iOS applies its own rounding, so this canvas stays square.
 */
export default function AppleIcon() {
  const mark = fs.readFileSync(
    path.join(process.cwd(), "public/onyx-logo-white.png"),
  );
  const src = `data:image/png;base64,${mark.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0E0E0E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" width={128} height={77} />
      </div>
    ),
    size,
  );
}
