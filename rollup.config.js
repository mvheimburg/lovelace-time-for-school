import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/lovelace-time-for-school.ts",
  output: {
    file: "dist/lovelace-time-for-school.js",
    format: "es",
    sourcemap: true
  },
  plugins: [
    resolve({
      browser: true
    }),
    commonjs(),
    typescript()
  ]
};
