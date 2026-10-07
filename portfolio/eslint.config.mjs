import { FlatCompat } from "@eslint/eslintrc";
const compat = new FlatCompat({ baseDirectory: import.meta.dirname });
// Logos and the portrait are tiny static files already sized for display, so plain <img> is intentional.
export default [...compat.extends("next/core-web-vitals", "next/typescript"), { rules: { "@next/next/no-img-element": "off" } }];
