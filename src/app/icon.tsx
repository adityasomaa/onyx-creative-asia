import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Brand icon — the Onyx "•" dot mark on ink. Matches the nav logo.
 * Rendered fresh on each request via the Edge Runtime, so the asset
 * is always in sync with the design tokens below.
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
          borderRadius: 6,
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 999,
            background: "#F4F1EC",
          }}
        />
      </div>
    ),
    size
  );
}
