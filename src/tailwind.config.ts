import type { Config } from "tailwindcss"
import defaultTheme from "tailwindcss/defaultTheme"

const config: Config = {
  darkMode: "class", // Enable dark mode using class
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: theme("colors.zinc.800"),
            a: { color: theme("colors.zinc.900") },
            h1: {
              fontSize: theme("fontSize.7xl"),
              fontWeight: "700",
              color: theme("colors.zinc.900"),
            },
            h2: {
              fontSize: theme("fontSize.3xl"),
              fontWeight: "600",
              color: theme("colors.zinc.800"),
            },
            p: {
              fontSize: theme("fontSize.base"),
              lineHeight: "1.75",
              color: theme("colors.zinc.700"),
            },
          },
        },
        dark: {
          css: {
            color: theme("colors.zinc.100"),
            a: { color: theme("colors.zinc.200") },
            h1: {
              color: theme("colors.white"),
            },
            h2: {
              color: theme("colors.zinc.100"),
            },
            p: {
              color: theme("colors.zinc.300"),
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
}

export default config
