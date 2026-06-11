# Task Memory: task_07.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot
- DONE: custom `local/canonical-scale` ESLint rule — flags off-scale named font sizes + colour literals in markup; wired into `eslint.config.mjs`; RuleTester + integration tests. lint/check/test/build all exit 0.

## Important Decisions
- Rule ships at **warn**, not error (matches the repo's class-order convention: conversion tasks 02–05 still own markup with off-scale drift). task_08 promotes to error in the build gate. This keeps both integration tests honest: the shipped-config test asserts lint exits 0 + the rule still *flags* drift; a separate "task 08 gate" test bumps severity to error via `overrideConfig` and asserts a non-zero exit.
- Rule scope: only NAMED font sizes (`text-lg`/`text-4xl`). Arbitrary sizes like `text-[0.625rem]` (Header.astro) are left to the stock `no-restricted-classes` rule — not double-flagged.
- Did NOT fix the real `text-4xl` drift in `work/[slug].astro:25` — it's task_05's gated conversion work; changing it here would corrupt the no-visual-regression Playwright baseline.

## Learnings
- astro-eslint-parser emits JSX-style AST: class attrs are `JSXAttribute` (name `class`/`className`/`class:list`), value = `Literal` | `JSXExpressionContainer` | `TemplateLiteral` | `ArrayExpression` (class:list). `class:list` name node is `JSXNamespacedName`.
- RuleTester works with `languageOptions:{parser: astroParser, parserOptions:{parser: tsParser}}`; each case needs a `.astro` `filename`. Do NOT set `options: undefined` on a case — RuleTester asserts options must be an array; omit the key instead.
- Semantic tokens (text-accent/fg/muted, bg-bg, border-border) pass because they're absent from the Tailwind default-palette list; colour detection keys off palette names + `#hex` + `rgb()/hsl()/oklch()` functions.

## Files / Surfaces
- (new) `eslint-rules/canonical-scale.mjs` — the rule (default export).
- `eslint.config.mjs` — imports rule, registers `local` plugin, adds `local/canonical-scale` at warn with `CANONICAL_TEXT_SIZES` + `ALLOWED_ARBITRARIES`.
- (new) `tests/canonical-scale.test.mjs` — RuleTester unit + live-config integration tests.

## Errors / Corrections
- First RuleTester run failed "options must be an array" → caused by `options: undefined` on no-option cases; fixed by conditionally spreading the key.

## Ready for Next Run
- task_08: prepend `npm run lint` to netlify.toml build command AND promote `local/canonical-scale` (and the class-order rule) from warn → error once conversion (02–05) is complete and source is clean of `text-4xl`/`text-[0.625rem]`.
