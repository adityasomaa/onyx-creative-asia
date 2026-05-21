import { ImageResponse } from "next/og";

// 192×192 — large enough that Google's favicon crawler will pick this
// over apple-icon.tsx (which is 180), and a multiple of 48 per Google's
// favicon guidelines. Renders down cleanly to the 16px slot in search
// results because the dot takes ~45% of the canvas (no fine details
// that disappear when shrunk).
export const size = { width: 192, height: 192 };
export const contentType = "image/png";

/**
 * Brand favicon — the Onyx "•" dot mark on ink. Matches the nav logo.
 * Rendered fresh on each request via the Edge Runtime so the asset stays
 * in sync with the design tokens (no manual export step). Deliberately
 * just the mark, no wordmark — text doesn't survive being shrunk to 16px
 * in a Google search result, but a high-contrast dot does.
 */
export default function Icon() {
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
          borderRadius: 32,
        }}
      >
        <div
          style={{
            width: 86,
            height: 86,
            borderRadius: 999,
            background: "#F4F1EC",
          }}
        />
      </div>
    ),
    size
  );
}
