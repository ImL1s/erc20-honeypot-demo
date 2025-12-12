/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "ui-sans-serif", "system-ui"]
      },
      colors: {
        ink: "#4b5563", // Pencil Grey / Soft Text
        surface: "#ffffff", // Watercolor Paper White
        mint: "#86efac", // Fresh Grass / Safe
        danger: "#fda4af", // Soft Red / Warnings (Pastel Red)
        sand: "#fdfcf8", // Cream / Cloud
        wood: "#92400e", // Earthy accents
        sky: "#bae6fd", // Sky Blue
      }
    }
  },
  plugins: []
};
