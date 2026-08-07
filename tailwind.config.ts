import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#151415",
        yellow: "#f1eade",
        cream: "#f1eade",
        light: "#f7f2e9",
        brown: "#7b5136",
        grey: "#3f383c",
        stone: "#242324",
        stroke: "#9faf9b",
        red: "#ff5113",
        dark: "#151415",
        warm: "#7b5136",
        sand: "#9faf9b",
        "warm-light": "#a97a5a",
      },
      fontFamily: {
        display: ["var(--font-display)", "Cormorant Garamond", "Georgia", "serif"],
        body: ["var(--font-body)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      fontSize: {
        lrg: "var(--large)",
        "lrg-max": "max(var(--large), 16vw)",
        h0: "var(--h0)",
        h1: "var(--h1)",
        h2: "var(--h2)",
        h3: "var(--h3)",
        h4: "var(--h4)",
        h5: "var(--h5)",
        h6: "var(--h6)",
        p: "var(--p)",
        m: "var(--m)",
        mm: "var(--mm)",
      },
      spacing: {
        gap: "var(--g-gap)",
        margin: "var(--g-margin)",
        section: "var(--large)",
        "section-sm": "var(--h1)",
      },
      borderRadius: {
        obs: "0.4rem",
        block: "var(--h3)",
      },
      transitionTimingFunction: {
        "f-cubic": "var(--f-cubic)",
        "f-cubic-in": "var(--f-cubic-in)",
        "f-fast": "var(--f-fast)",
        "f-smooth": "var(--f-smooth)",
        "f-bounce": "var(--f-bounce)",
      },
      transitionDuration: {
        900: "900ms",
      },
      boxShadow: {
        soft: "0 20px 60px -20px rgba(0,0,0,0.5)",
        lift: "0 30px 80px -20px rgba(0,0,0,0.6)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translate3d(25%,0,0) rotate(.01deg)" },
          "100%": { transform: "translate3d(-25%,0,0) rotate(.01deg)" },
        },
        "marquee-hor": {
          "0%": { transform: "translate3d(0,25%,0) rotate(.01deg)" },
          "100%": { transform: "translate3d(0,-25%,0) rotate(.01deg)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        "fade-in": "fade-in 1.2s var(--f-cubic) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
