/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("overwind-ui/tailwind"), require("./tailwind-base.config")],

  content: ["./src/**/*.{js,ts,jsx,tsx}"],
};
