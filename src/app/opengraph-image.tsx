import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "Onyx Creative Asia — Brand, Performance & AI Systems for ambitious teams";

/**
 * Default OpenGraph image — Black Box monochrome editorial. Used for
 * social previews on home + any page that doesn't override its own OG
 * image. Edge-runtime so it's generated fresh on demand without a build
 * artefact.
 */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          background: "#0E0E0E",
          color: "#F4F1EC",
          display: "flex",
          flexDirection: "column",
          padding: "72px 80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* top hairline header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 18,
            letterSpacing: "0.18em",
            opacity: 0.7,
          }}
        >
          <span>[ ONYX_CREATIVE.SYS ]</span>
          <span>BALI · ASIA · MMXXVI</span>
        </div>
        <div
          style={{
            height: 1,
            background: "rgba(244,241,236,0.42)",
            marginTop: 18,
            display: "flex",
          }}
        />

        {/* main lockup */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginTop: 24,
          }}
        >
          <div
            style={{
              fontSize: 130,
              fontWeight: 700,
              lineHeight: 0.92,
              letterSpacing: "-0.04em",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>STUDIO.</span>
            <span>OPEN.</span>
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 40,
              fontStyle: "italic",
              fontWeight: 300,
              opacity: 0.92,
              display: "flex",
            }}
          >
            Brand. Performance. AI Systems.
          </div>
        </div>

        {/* footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 22,
            letterSpacing: "0.05em",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontWeight: 700, fontSize: 36 }}>ONYX</span>
            <span style={{ fontStyle: "italic", opacity: 0.85, fontSize: 24 }}>
              Creative
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 4,
              opacity: 0.85,
            }}
          >
            <span>onyxcreative.asia</span>
            <span style={{ opacity: 0.6 }}>For ambitious teams.</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
