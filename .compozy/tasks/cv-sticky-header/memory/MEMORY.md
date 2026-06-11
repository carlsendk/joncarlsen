# Workflow Memory

Keep only durable, cross-task context here. Do not duplicate facts that are obvious from the repository, PRD documents, or git history.

## Current State

- task_01 done: `src/components/Header.astro` exists (sticky bar, derived back-link, identity home-link, LinkedIn/GitHub icons, composed `<ThemeToggle />`).
- task_02 done (verified, uncommitted): `<Header />` wired as first `<body>` child in `Base.astro`; ThemeToggle de-positioned with bundled handler; `global.css` print-hides `#site-header` (id-scoped) + `scroll-padding-top:4.5rem`. check/build/linkinator green; Playwright confirmed in-header toggle flips/persists, no flash, print hides header but keeps Hero. `_tasks.md` and task file updated to completed.
- task_03 done: the four secondary pages (`cv`, `impact`, `work/index`, `work/[slug]`) had their duplicate inline back-link `<nav>` blocks removed; each route now shows exactly one (header) back-link. check/build/linkinator green.

## Shared Decisions

- Header container mirrors page layout: `mx-auto max-w-2xl px-6`; root `<header id="site-header" class="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur">`. Reuse this hook/class across tasks (print-hide and scroll-padding key off `#site-header`).

## Shared Learnings

- **`astro check` (`npm run check`) OOM-crashes in this local clone** because `tsconfig.json` `include: ["**/*"]` pulls in the gitignored, untracked local-only `docs/` tree (~49 MB of minified JS; `.gitignore:21`). `docs/` does not exist in CI/clean checkout, so check is green there. To get representative check evidence locally: `mv docs /tmp/… ; npm run check ; mv /tmp/… docs`. With docs aside: `Result (30 files): 0 errors, 0 warnings, 16 hints` (16 hints = pre-existing zod `ts(6385)` deprecations in `src/content.config.ts`, not actionable).
- Astro does not route `_`-prefixed pages — name any throwaway render-evidence scaffold WITHOUT a leading underscore, and delete it after.
- An unused component is omitted from `dist` but still type-checked by `astro check` (the "present but unused" state).

## Open Risks

- None blocking. Note: the `docs/`-induced check crash is environmental, not a code defect; future tasks must use the docs-aside workaround for clean check evidence.

## Handoffs

- task_02: render `<Header />` as first `<body>` child in `Base.astro` replacing standalone `<ThemeToggle />`; strip `fixed top-3 right-3 z-50` from ThemeToggle and move its click handler `is:inline` → bundled `<script>` (keep inline flash guard in `<head>`); add `#site-header` to the print `display:none` list and `html { scroll-padding-top: … }` in `global.css`. Header already composes ThemeToggle — only its internals change.
