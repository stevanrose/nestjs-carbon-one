import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";

// If you're using jest:
import globals from "globals";

export default tseslint.config(
  {
    ignores: ["dist", "coverage", "node_modules"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      prettier,
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      {
        rules: {
          "prettier/prettier": "error",
          "@typescript-eslint/no-unused-vars": [
            "error",
            { argsIgnorePattern: "^_" },
          ],
          "@typescript-eslint/explicit-function-return-type": "off",
          "@typescript-eslint/no-misused-promises": [
            "error",
            { checksVoidReturn: false },
          ],
        },
      },
    ],
  }
);
