import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        page: "var(--page)",
        panel: "var(--panel)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        stroke: "var(--stroke)",
        header: "var(--header)",
        callout: "var(--callout)",
        orange: "#F15A00",
        navy: "#0F1922",
        navyText: "#1B2A3A",
        sand: "#E9E4DA",
        grey: "#6B7280",
        ok: "#33D3A6",
        attn: "#E8B23D",
        crit: "#FF4757",
        bridge: {
          bg: "var(--bridge-bg)",
          panel: "var(--bridge-panel)",
          line: "var(--bridge-line)",
          text: "var(--bridge-text)",
          dim: "var(--bridge-dim)",
        },
      },
      fontFamily: {
        heading: [
          "var(--font-cormorant)",
          "var(--font-arabic)",
          "Georgia",
          "serif",
        ],
        ui: [
          "var(--font-space-grotesk)",
          "var(--font-arabic)",
          "system-ui",
          "sans-serif",
        ],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
        body: [
          "var(--font-inter)",
          "var(--font-arabic)",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
