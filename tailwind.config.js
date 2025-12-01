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
        ink: "#0f172a",
        mint: "#5ef3d0",
        sand: "#f8f4e9"
      }
    }
  },
  plugins: []
};
