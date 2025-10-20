import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize FlatCompat with the base directory for resolving configurations
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 1. Extend Next.js/TypeScript recommended rules (these likely enable 'no-explicit-any')
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 2. Configuration for specific rules
  {
    // This rule block should come after the extensions to ensure it overrides them
    rules: {
      // Disable the specific rule for the entire project
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  
  // 3. Configuration for file ignores
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
