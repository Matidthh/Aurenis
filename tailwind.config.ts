import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#bae0fd",
          300: "#7cc7fc",
          400: "#36abf7",
          500: "#0c8ee9",
          600: "#016fc7",
          700: "#0258a1",
          800: "#064b85",
          900: "#0b3f6f",
          950: "#07284a",
        },
      },
    },
  },
  plugins: [],
};

export default config;
