import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parago: {
          blue: "#2F5FE0",
          navy: "#0A0E27",
          navyDeep: "#050714",
          gold: "#D9B98A",
          peach: "#F3C994",
          peachDark: "#EDBB7C",
        },
      },
      fontFamily: {
        sans: [
          "Poppins",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      letterSpacing: {
        widest2: "0.2em",
      },
      boxShadow: {
        panel: "0 30px 80px -20px rgba(10, 14, 39, 0.35)",
      },
    },
  },
  plugins: [],
};
export default config;