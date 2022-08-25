const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("rich-slate/tailwind"), require("overwind-ui/tailwind")],

  content: [
    "./node_modules/overwind-ui/**/*.{js,ts,jsx,tsx}",
    "./node_modules/rich-slate/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ["Open Sans", "sans-serif", ...defaultTheme.fontFamily.sans],
      },
    },
  },
};
