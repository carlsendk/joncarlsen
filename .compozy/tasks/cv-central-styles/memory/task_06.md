# Task Memory: task_06.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot
- Add ESLint 9 flat config (`eslint.config.mjs`) + `npm run lint` scoped to `src/`, stock Tailwind class-hygiene rules + arbitrary allowlist. NO canonical-scale rule (that is task_07). Must pass clean on CURRENT source (task_01 not yet landed).

## Important Decisions
- Plugin: `eslint-plugin-better-tailwindcss@4.5.0` (Tailwind v4 compatible: peer `tailwindcss ^4.1.17`; supports Astro, ESLint 9, flat config). Chosen over classic `eslint-plugin-tailwindcss` (incomplete v4 support).
- Pin ESLint to 9.x (9.39.4), NOT 10 — task requires ESLint 9 flat config.
- v4 theme resolution via settings `better-tailwindcss.entryPoint: "src/styles/global.css"`.
- Correctness rules (conflicting/duplicate/unregistered) = error; stylistic `enforce-consistent-class-order` = warn (exit 0 ignores warnings) to avoid churning markup tasks 02-05 own. Ordering can be promoted to error at task_08 once conversion lands.
- Arbitrary handling: must NOT hard-error `text-[0.625rem]` (color/scale = task_07 scope per ADR-003). Allowlist documented system arbitraries incl `tracking-[0.2em]`.

## Learnings
- Arbitraries currently in markup: `tracking-[0.2em]` (22x), `text-[0.625rem]` (1x, untracked Header.astro).
- Custom plain-CSS classes in global.css: `reveal`, `link-underline` (bare selectors, not @utility) — must not be flagged unregistered (may need `detectComponentClasses` and/or ignore list — VERIFY empirically).
- Node 26 local, Netlify NODE_VERSION=22.

## Files / Surfaces
- NEW: eslint.config.mjs; MODIFIED: package.json (devDeps + lint/test scripts). Tests dir outside src/.

## Errors / Corrections
- Rule names in better-tailwindcss@4.5.0: validity rule is `no-unknown-classes` (NOT no-unregistered-classes). Recommended config already splits correctness=error / stylistic=warn — spread `configs.recommended.rules`.
- `flat/base` astro config does NOT parse TS frontmatter → "interface/typeof reserved" parse errors. FIX: install `@typescript-eslint/parser@8.61.0` and set `languageOptions.parserOptions.parser`. Use `flat/base` (not flat/recommended) to avoid leaking JS/TS lint rules onto frontmatter.
- `detectComponentClasses:true` does NOT cover bare-selector classes `reveal`/`link-underline` (defined in @media, not @layer components) nor `prose-cv` (used but undefined in src). FIX: `no-unknown-classes` `ignore: ["^reveal$","^link-underline$","^prose-cv$"]`, kept at error.
- `enforce-consistent-line-wrapping` is very noisy formatting → set "off".
- Arbitrary restriction (`no-restricted-classes`) regex uses negative-lookahead to allowlist `tracking-[0.2em]`; severity warn so `text-[0.625rem]` (Header.astro, font-size = task_07 scope) surfaces without breaking exit 0.

## Verified Result
- `npx eslint "src/**/*.astro"` → exit 0, 0 errors, 47 warnings (mostly class-order, will shrink as tasks 02-05 convert). tracking-[0.2em] NOT flagged by restriction; text-[0.625rem] flagged as warning.

## Follow-ups (out of scope for task_06)
- `prose-cv` is referenced in work/[slug].astro but has no CSS definition in src — conversion tasks (02-05) should define or remove it.
- Once task_01 lands cv-* role classes: verify they pass (detectComponentClasses should detect @layer components @apply classes; else extend ignore list). Promote ordering warn→error at task_08 gate after conversion.

## Ready for Next Run
- task_07 plugs the custom canonical-scale rule into this same config (font-size scale + colour-literal ban). Stock layer is in place.
