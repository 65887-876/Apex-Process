import next from "eslint-config-next";

/** Flat ESLint config for Next.js 16. */
const config = [
  ...next,
  {
    ignores: [".next/**", "node_modules/**", "public/**", "scripts/**"],
  },
];

export default config;
