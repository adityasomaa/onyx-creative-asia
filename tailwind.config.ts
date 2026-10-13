import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // ── Marketing site (monodrift-structure rebuild) ──
        // `accent` is a CSS variable so the palette switcher can retint
        // every accent surface at runtime; it is stored as "R G B" so the
        // opacity modifiers (bg-accent/40) keep working. It resolves per
        // surface (--accent-s, see globals.css): a pale accent such as the
        // default white is drawn as night on light backgrounds.
        accent: "rgb(var(--accent-s) / <alpha-value>)",
        // Text on an accent surface.
        "accent-ink": "rgb(var(--accent-s-ink) / <alpha-value>)",
        fg: "#262626",
        fg2: "#4D4D4D",
        mute: "#8A8A8A",
        faint: "#C4C4C4",
        rule: "#E3E3E3",
        paper: "#F4F4F4",
        snow: "#FAFAFA",
        night: "#0E0E0E",
        coal: "#262626",
        // ── Legacy tokens, still used by /agents ──
        ink: {
          DEFAULT: "#0E0E0E",
          50: "#F7F7F5",
          100: "#EDEDEA",
          200: "#D6D6D2",
          300: "#A8A8A4",
          400: "#7A7A76",
          500: "#4D4D49",
          600: "#2E2E2C",
          700: "#1C1C1B",
          800: "#141413",
          900: "#0E0E0E",
          950: "#080808",
        },
        bone: {
          DEFAULT: "#F4F1EC",
          50: "#FBFAF7",
          100: "#F4F1EC",
          200: "#EAE6DE",
          300: "#D8D2C6",
          400: "#BDB5A4",
        },
      },
      fontFamily: {
        sans: ["var(--font-neue)", "system-ui", "sans-serif"],
        display: ["var(--font-neue)", "system-ui", "sans-serif"],
        tek: ["var(--font-tektur)", "system-ui", "sans-serif"],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono2: ["var(--font-fragment)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // Custom display scale for hero/section headlines
        "display-sm": ["clamp(2rem, 6vw, 4rem)", { lineHeight: "0.98", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(2.25rem, 7.5vw, 6rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(4rem, 12vw, 10rem)", { lineHeight: "0.88", letterSpacing: "-0.04em" }],
        "display-xl": ["clamp(5rem, 16vw, 14rem)", { lineHeight: "0.86", letterSpacing: "-0.05em" }],
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "out-quart": "cubic-bezier(0.25, 1, 0.5, 1)",
        "in-quart": "cubic-bezier(0.5, 0, 0.75, 0)",
        "in-out-quart": "cubic-bezier(0.76, 0, 0.24, 1)",
      },
      animation: {
        marquee: "marquee 40s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
