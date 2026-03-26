// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Display font for headings — bold and athletic
        display: ["'Barlow Condensed'", "sans-serif"],
        // Body font — clean and readable
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        brand: {
          50:  "#fff7ed",
          100: "#ffedd5",
          500: "#f97316", // main orange
          600: "#ea580c",
          700: "#c2410c",
        },
        dark: {
          900: "#0a0a0a",
          800: "#111111",
          700: "#1a1a1a",
          600: "#222222",
          500: "#333333",
        },
      },
    },
  },
  plugins: [],
};
