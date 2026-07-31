import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F8F8F6",
        surface: "#EFEDE8",
        ink: "#111111",
        muted: "#6B6B6B",
        accent: "#000000",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        hero: ["120px", { lineHeight: "0.94", letterSpacing: "-0.03em" }],
        "hero-md": ["72px", { lineHeight: "0.96", letterSpacing: "-0.02em" }],
        "hero-sm": ["48px", { lineHeight: "1.02", letterSpacing: "-0.01em" }],
        display: ["64px", { lineHeight: "1.0", letterSpacing: "-0.02em" }],
        h2: ["44px", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
      },
      spacing: {
        section: "160px",
        "section-md": "112px",
        "section-sm": "80px",
      },
      borderRadius: {
        lux: "28px",
      },
      transitionTimingFunction: {
        lux: "cubic-bezier(0.16, 1, 0.3, 1)",
        silk: "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      boxShadow: {
        soft: "0 20px 60px -20px rgba(17,17,17,0.12)",
        lift: "0 30px 80px -20px rgba(17,17,17,0.18)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
