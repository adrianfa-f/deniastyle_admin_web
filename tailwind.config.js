/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        rose: "#f9c5d1",
        beige: "#f5e6d3",
        primary: "#e8a9b4",
        accent: "#d9c2b0",
        darkText: "#4a3b32",
      },
    },
  },
  plugins: [],
};
