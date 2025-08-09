import tseslint from "typescript-eslint";
import parser from "@typescript-eslint/parser";

export default tseslint.config({
  files: ["resources/ts/**/*.ts"],
  languageOptions: {
    parser,
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
    },
  },
  plugins: {
    "@typescript-eslint": tseslint.plugin,
  },
  rules: {
    semi: ["error", "always"],
    quotes: ["error", "single"],
  },
  ignores: ["node_modules/", "vendor/"],
});