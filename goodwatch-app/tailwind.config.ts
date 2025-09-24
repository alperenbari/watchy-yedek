import type { Config } from "tailwindcss";

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./src/**/*.{mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#0d1017",
        surface: "#161b26",
        accent: "#ff9f1c",
        "accent-muted": "#f7b267",
        "accent-contrast": "#0d1017",
        "foreground-primary": "#f5f6fa",
        "foreground-muted": "#9ea3b0",
        "card-border": "rgba(255,255,255,0.08)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      boxShadow: {
        spotlight: "0 30px 80px rgba(15, 23, 42, 0.45)",
        card: "0 12px 40px rgba(15, 23, 42, 0.35)",
        "card-hover": "0 16px 50px rgba(15, 23, 42, 0.55)",
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(circle at top, rgba(255,255,255,0.15), transparent 65%)",
      },
      borderRadius: {
        card: "1.25rem",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
