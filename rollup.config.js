import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import typescript from "rollup-plugin-typescript2";
import copy from "rollup-plugin-copy";
import autoprefixer from "autoprefixer";

import pkg from "./package.json";

const config = {
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
    postcss({ config: false, plugins: [autoprefixer()] }), // TODO Do we need to minimize? or next.js will take care of that
    resolve(),
    commonjs(),
    typescript(),
    copy({
      targets: [
        { src: "./src/globals.css", dest: "dist", rename: "styles.css" },
      ],
    }),
    copy({
      targets: [
        { src: "tailwind-base.config.js", dest: "dist", rename: "tailwind.js" },
      ],
    }),
  ],
};

export default config;
