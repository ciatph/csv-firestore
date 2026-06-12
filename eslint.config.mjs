import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.node
    }
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs"
    }
  },
  {
    rules: {
      'indent': ['error', 2],
      'linebreak-style': ['error', 'unix'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],
      'eol-last': ['error', 'always'],
      'no-multi-spaces': 'error',
      'no-trailing-spaces': 'error',
      'no-undef': 'error',
      // 'no-console': ['error', { 'allow': ['error'] }]
      // 'no-unused-vars': 'off',
      //
    }
  }
]);
