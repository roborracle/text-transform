import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "cli/dist/**",
      "coverage/**",
      "extension/**",
      "next-env.d.ts",
    ],
  },
  // Allow require() in test files, Jest setup, and CLI entry point
  {
    files: ["**/__tests__/**", "jest.setup.ts", "cli/bin/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];

export default eslintConfig;
