/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("overwind-ui/tailwind")],

  content: [
    "./node_modules/overwind-ui/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  plugins: [require("@tailwindcss/typography")],
};
