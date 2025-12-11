/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bgMain: "#FFFFFF",
        bgSecondary: "#F5F5F5",
        accent: "#000000",
        dark: "#000000",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
      boxShadow: {
        elegant: "0 2px 12px rgba(0, 0, 0, 0.08)",
        subtle: "0 1px 3px rgba(0, 0, 0, 0.05)",
        card: "0 4px 16px rgba(0, 0, 0, 0.06)",
      },
      spacing: {
        section: "4rem",
      },
    },
  },
  plugins: [],
};
