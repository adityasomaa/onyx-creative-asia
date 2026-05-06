import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Apple touch icon (180×180, used by iOS home-screen shortcut).
 * Larger canvas means we can show the dot + wordmark together.
 */
export default function AppleIcon() {
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
          color: "#F4F1EC",
          fontSize: 48,
          fontWeight: 500,
          letterSpacing: -1,
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          gap: 12,
          padding: 16,
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: 999,
            background: "#F4F1EC",
          }}
        />
        <span>Onyx</span>
      </div>
    ),
    size
  );
}
