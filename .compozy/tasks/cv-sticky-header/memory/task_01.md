# Task Memory: task_01.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

Create `src/components/Header.astro` (props-free, `id="site-header"`) — sticky/translucent bar with derived back-link, identity home-link, LinkedIn/GitHub icons, composed `<ThemeToggle />`. Build the file only; NOT wired into any page (task_02 does that). Done.

## Important Decisions

- Layout order (ADR-001): back-link · identity (`mr-auto`) · `<nav aria-label="Profile links">` with icon links + `<ThemeToggle />`. Reused `mx-auto max-w-2xl px-6` container, `sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur`.
- Back-link styling copied verbatim from `cv.astro` nav (`link-underline font-mono text-xs uppercase tracking-wider text-muted …`).
- Identity = `<a href="/">` with stacked name (`font-display text-sm`) + title (`font-mono text-[0.625rem] uppercase`), compact vs Hero; no `<h1>`.
- Icon links: inline SVGs (LinkedIn/GitHub brand paths, `fill="currentColor"`), `aria-label` on `<a>`, `aria-hidden` on SVG, `target=_blank rel=noopener noreferrer`.
- Composed `<ThemeToggle />` as-is (fixed positioning still on it — fine while Header is unmounted; its refactor is task_02). Did NOT touch ThemeToggle.astro or Base.astro.

## Learnings

- Evidence split (mount can't cover all branches): real-render over built HTML covers catch-all back-link + link filter + identity-not-h1; `/` and `/cv` branches verified via verbatim function copy in a throwaway node script.
- Astro skips `_`-prefixed pages from routing — name throwaway scaffolds WITHOUT leading underscore (used `src/pages/hdrtest.astro`, deleted after).
- Unused component is omitted from `dist` (unreachable) but still type-checked by `astro check` — the intended "present but unused" state.

## Files / Surfaces

- Added: `src/components/Header.astro` (only source-tree change; `git status` shows just `?? src/components/Header.astro`).
- Read-only refs: `ThemeToggle.astro`, `Hero.astro`, `cv.astro` (back-link), `cv.ts` (name/title/links), `global.css` (tokens, `.link-underline`).

## Errors / Corrections

- First scaffold `_hdrtest.astro` was not emitted (underscore = private route); renamed to `hdrtest.astro`, rebuilt, then deleted.

## Ready for Next Run

- task_02 wires `<Header />` into `Base.astro` (first `<body>` child, replace standalone `<ThemeToggle />`), refactors ThemeToggle (drop `fixed top-3 right-3 z-50`; `is:inline` → bundled `<script>`), adds `#site-header` print-hide + `html { scroll-padding-top }` in global.css.
- Header currently imports `./ThemeToggle.astro` and renders it — task_02 keeps it composed here, just changes ThemeToggle internals.
