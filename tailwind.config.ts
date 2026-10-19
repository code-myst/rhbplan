import type { Config } from "tailwindcss";

const v = (name: string) => `hsl(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist)", "var(--font-hind)", "system-ui", "sans-serif"],
      },
      colors: {
        border: v("border"),
        background: v("background"),
        foreground: v("foreground"),
        card: v("card"),
        primary: { DEFAULT: v("primary"), foreground: v("primary-foreground") },
        secondary: { DEFAULT: v("secondary"), foreground: v("secondary-foreground") },
        muted: { DEFAULT: v("muted"), foreground: v("muted-foreground") },
        success: v("success"),
      },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)" },
    },
  },
  plugins: [],
};

export default config;
