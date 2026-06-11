// ESLint flat config — the drift guard's class-hygiene layer (ADR-003, task 06).
//
// Scope: src/ only (keeps the Netlify build-gate lint pass fast — ADR-003). The
// Astro `flat/base` layer supplies the parser/processor for `.astro` single-file
// components WITHOUT pulling in opinionated JS/TS lint rules that would flag
// component frontmatter; only Tailwind class-hygiene rules are layered on top.
//
// Tailwind v4 has no JS config file, so the plugin resolves the theme (tokens,
// custom font/color utilities, component classes) from the CSS entry point.
//
// On top of STOCK class hygiene — valid classes, ordering, no conflicts/duplicates,
// and an arbitrary-value restriction with an allowlist for documented system
// arbitraries — this config layers the bespoke `local/canonical-scale` rule
// (task 07): it enforces the canonical font-size scale and bans colour literals
// in markup, the two project-specific drift signals stock rules cannot see.

import astro from "eslint-plugin-astro";
import betterTailwindcss from "eslint-plugin-better-tailwindcss";
import tsParser from "@typescript-eslint/parser";
import canonicalScale from "./eslint-rules/canonical-scale.mjs";

// Documented system arbitraries that are part of the design vocabulary and must
// not be flagged by the arbitrary-value restriction (e.g. the eyebrow letter
// spacing). Anchored full-class matches.
const ALLOWED_ARBITRARIES = ["tracking-[0.2em]"];

// Bespoke project classes that are NOT Tailwind utilities/components and so are
// not resolvable from the Tailwind theme: animation/interaction hooks defined as
// bare selectors in global.css (`reveal`, `link-underline`) and the case-study
// prose wrapper (`prose-cv`). They are legitimate existing classes; ignore them
// so the validity rule (no-unknown-classes) stays an error for genuine typos.
const KNOWN_NON_TAILWIND_CLASSES = ["^reveal$", "^link-underline$", "^prose-cv$"];

// The canonical font-size scale (cv-visual-design type-scale amendment). Any other
// named font-size utility in markup is drift. `text-4xl`/`text-lg` are deliberately
// absent.
const CANONICAL_TEXT_SIZES = [
  "text-xs",
  "text-sm",
  "text-base",
  "text-xl",
  "text-2xl",
  "text-3xl",
  "text-5xl",
  "text-6xl",
];

const allowlistAlternation = ALLOWED_ARBITRARIES.map((cls) =>
  cls.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
).join("|");

export default [
  // Ignore everything outside the linted source surface.
  {
    ignores: ["dist/**", ".astro/**", ".netlify/**", "node_modules/**"],
  },

  // Astro parsing/processor only (no JS/TS rule opinions).
  ...astro.configs["flat/base"],

  // Tailwind class-hygiene rules, scoped to Astro components under src/.
  {
    files: ["src/**/*.astro"],
    // The Astro frontmatter is TypeScript; parse it with the TS parser nested in
    // the Astro parser so type syntax (interface/typeof/generics) doesn't error.
    languageOptions: {
      parserOptions: {
        parser: tsParser,
      },
    },
    plugins: {
      "better-tailwindcss": betterTailwindcss,
      local: { rules: { "canonical-scale": canonicalScale } },
    },
    settings: {
      "better-tailwindcss": {
        // Tailwind v4 CSS-based config entry point — used to resolve the theme,
        // custom token utilities, and component classes.
        entryPoint: "src/styles/global.css",
        // Detect @layer-components / @apply classes (the forthcoming cv-* role
        // classes) from the entry CSS so they read as known. Bare-selector
        // classes that this does NOT cover are handled by the ignore list below.
        detectComponentClasses: true,
      },
    },
    rules: {
      // Stock class hygiene: correctness at error, stylistic at warn.
      ...betterTailwindcss.configs.recommended.rules,
      // Line wrapping is pure formatting, not class hygiene, and is very noisy on
      // multi-line markup — off so real signal isn't buried (ADR-003: keep lean).
      "better-tailwindcss/enforce-consistent-line-wrapping": "off",
      // Validity stays an error, but ignore the bespoke non-Tailwind classes.
      "better-tailwindcss/no-unknown-classes": [
        "error",
        { ignore: KNOWN_NON_TAILWIND_CLASSES },
      ],
      // Arbitrary-value restriction: surface arbitrary utilities (warn — the
      // hard canonical-scale/colour gate is task 07) while allowlisting the
      // documented system arbitraries above.
      "better-tailwindcss/no-restricted-classes": [
        "warn",
        {
          restrict: [
            {
              pattern: `^(?!(?:${allowlistAlternation})$)(?:[a-z0-9:_-]+:)?[a-z0-9/_-]*-?\\[[^\\]]+\\]$`,
              message:
                "Avoid arbitrary values; use a token/scale utility or add the value to the documented allowlist.",
            },
          ],
        },
      ],
      // Bespoke canonical-scale guard (task 07): flags font-size utilities outside
      // the canonical scale and colour literals in markup. WARN during the
      // conversion window — tasks 02–05 still own markup that carries off-scale
      // drift (e.g. the case-study h1's `text-4xl`); task 08 promotes this to
      // error once conversion is complete and the source is clean, exactly as the
      // class-order rule is promoted.
      "local/canonical-scale": [
        "warn",
        {
          allowedTextSizes: CANONICAL_TEXT_SIZES,
          allowedArbitrary: ALLOWED_ARBITRARIES,
          banColorLiteralsInMarkup: true,
        },
      ],
    },
  },
];
