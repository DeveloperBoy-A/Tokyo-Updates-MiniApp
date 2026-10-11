import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        tokyo: {
          bg: "#0a0a0a",
          surface: "#171717",
          elevated: "#1f1f1f",
          border: "#262626",
          pink: "#ff2e88",
          purple: "#a855f7",
          cyan: "#22d3ee",
          text: "#f5f5f5",
          muted: "#a3a3a3",
          dim: "#525252"
        }
      },
      boxShadow: {
        neon: "0 0 22px rgba(255, 46, 136, 0.22)",
        "neon-strong": "0 0 32px rgba(255, 46, 136, 0.36)"
      },
      backgroundImage: {
        "tokyo-glow": "radial-gradient(circle at 50% 0%, rgba(168,85,247,.18), transparent 45%)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 rgba(255,46,136,0)" },
          "50%": { boxShadow: "0 0 24px rgba(255,46,136,.25)" }
        }
      },
      animation: {
        "fade-up": "fade-up .45s ease-out both",
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
