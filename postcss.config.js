// This is used as storybook config. It is not used in the build process.
module.exports = {
  plugins: {
    "postcss-import": {},
    tailwindcss: { config: "./tailwind-storybook.config.js" },
    autoprefixer: {},
  },
};
