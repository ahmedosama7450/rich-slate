const { nodeResolve } = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const peerDepsExternal = require("rollup-plugin-peer-deps-external");
const postcss = require("rollup-plugin-postcss");
const typescript = require("rollup-plugin-typescript2");

const autoprefixer = require("autoprefixer");
const tailwindcss = require("tailwindcss");

const tailwindConfig = require("./tailwind.config.js");
const pkg = require("./package.json");

/**
 * @type {import('rollup').RollupOptions}
 */
module.exports = {
  input: "./src/main.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    postcss({
      config: false,
      plugins: [tailwindcss(tailwindConfig), autoprefixer()],
      modules: true, // TODO Is this enough or I need to add prefix in tailwind config ?
    }), // TODO Do we need to minimize? or next.js will take care of that
    nodeResolve(),
    commonjs(),
    typescript(),
  ],
};
