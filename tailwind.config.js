/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("overwind-ui/tailwind")],

  content: ["./src/**/*.{js,ts,jsx,tsx}"],

  plugins: [require("@tailwindcss/typography")],
};
