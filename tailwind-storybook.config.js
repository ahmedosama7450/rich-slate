/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("overwind-ui/tailwind"), require("./tailwind-base.config")],

  content: [
    "./node_modules/overwind-ui/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
};
