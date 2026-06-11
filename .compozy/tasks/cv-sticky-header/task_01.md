---
status: completed
title: Create `Header.astro` — sticky bar with identity, derived back-link, and LinkedIn/GitHub icons
type: frontend
complexity: medium
dependencies: []
---

# Task 1: Create `Header.astro` — sticky bar with identity, derived back-link, and LinkedIn/GitHub icons

## Overview
Create the single shared sticky header component that every route will inherit:
a translucent, always-visible bar carrying the compact identity (name + title as
a home link), a contextual back-link derived from the current path, and LinkedIn
+ GitHub icon links. The component is fully built here but **not yet wired into
the layout** (task_02 does that), so this task adds the file without changing the
live site.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST create `src/components/Header.astro` as a props-free component carrying a stable hook `id="site-header"` on its root `<header>` element.
- MUST implement the `backLinkFor(pathname)` derivation exactly per the TechSpec "Core Interfaces" section: `/` → no back-link, `/cv` → `← Overview` (`/`), every other path → `← Back to CV` (`/cv`), reading `Astro.url.pathname`.
- MUST render the identity (`cvData.name` + `cvData.title`) as a link to `/` and NOT as an `<h1>` (Hero owns the single page `<h1>`); reuse the existing mono/display type tokens.
- MUST render LinkedIn and GitHub as accessible icon links derived by filtering `cvData.links` to `label === "LinkedIn" | "GitHub"` (each with an accessible name; the Knowledge Base link MUST NOT appear).
- MUST be `position: sticky; top: 0` with a translucent surface (`bg-bg/80` + `backdrop-blur`) and a hairline bottom border, using semantic tokens only; MUST add no scroll-driven JavaScript.
- MUST compose the existing `<ThemeToggle />` into the header's row (its internal refactor and the layout wiring happen in task_02); the component MUST NOT be rendered into any page yet.
- MUST keep the build green: `astro check` and `astro build` pass with the new, currently-unused component.
</requirements>

## Subtasks
- [x] 1.1 Create `src/components/Header.astro` with the `<header id="site-header">` root and sticky/translucent/bordered styling.
- [x] 1.2 Implement `backLinkFor(Astro.url.pathname)` and render the back-link (or nothing on `/`) with the existing back-link type/hover/focus styling.
- [x] 1.3 Render the identity as a `/` home link (name + title), not an `<h1>`.
- [x] 1.4 Add accessible LinkedIn + GitHub icon links from filtered `cvData.links` (inline SVGs, accessible names).
- [x] 1.5 Compose `<ThemeToggle />` into the header row (placement only; its positioning/script change is task_02).
- [x] 1.6 Confirm `astro check`/`astro build` stay green with the component present but unused.

## Implementation Details
Create `src/components/Header.astro`. Put the `backLinkFor` pure function and the
`cvData.links` filter in the component frontmatter exactly as shown in the
TechSpec "Core Interfaces" and "Data Models" sections — do not invent alternate
shapes. Mirror the existing back-link styling verbatim from the current page
nav blocks (`link-underline font-mono text-xs uppercase tracking-wider
text-muted ...`). For icon SVGs, follow the inline-SVG pattern already used in
`ThemeToggle.astro` (no icon library, no new dependency). The identity type can
reuse `font-display`/`font-mono` tokens at a compact scale (smaller than Hero).
This task only adds the file; `Base.astro` and page edits are out of scope here.

### Relevant Files
- `src/data/cv.ts` — `cvData.name`, `cvData.title`, and `links[]` (`{label,url}`) with LinkedIn/GitHub/Knowledge Base entries (lines ~171–179, ~633–640); the filter source.
- `src/components/ThemeToggle.astro` — existing inline-SVG + button pattern to mirror for icons; the component composed into the header.
- `src/components/Hero.astro` — owns the page `<h1>`; informs why header identity must not be an `<h1>` and what compact scale to contrast against.
- `src/pages/cv.astro` (and impact/work) — source of the exact back-link styling classes to reuse.
- `src/styles/global.css` — semantic tokens (`--bg/--fg/--muted/--accent/--border`), `.link-underline`, and `:focus-visible` safety net the header relies on.

### Dependent Files
- `src/layouts/Base.astro` — will render `<Header />` and drop the standalone toggle in task_02.
- `src/styles/global.css` — will gain the `#site-header` print-hide and `scroll-padding-top` in task_02.

### Related ADRs
- [ADR-001: Persistent identity sticky header with contextual back-link](../adrs/adr-001.md) — what the header carries and the contextual back-link model.
- [ADR-002: Always-visible, pure-CSS sticky behavior](../adrs/adr-002.md) — `position: sticky`, no scroll JS.
- [ADR-003: Single shared Header with pathname-derived back-link](../adrs/adr-003.md) — `backLinkFor`, props-free, `id="site-header"`, identity not an `<h1>`.

## Deliverables
- `src/components/Header.astro` implementing identity home-link, derived back-link, LinkedIn/GitHub icon links, composed `<ThemeToggle />`, and sticky/translucent styling with `id="site-header"`.
- Render-assertion evidence over a built page (or a temporary mount) showing the back-link logic and link filtering **(REQUIRED)**.
- `astro check` + `astro build` green with the new component **(REQUIRED)**.

## Tests
- Unit tests (render assertions over built HTML / temporary mount):
  - [x] Header rendered at `/cv` emits `← Overview` with `href="/"`; at `/impact` and `/work/<slug>` emits `← Back to CV` with `href="/cv"`; at `/` emits no back-link element. (Catch-all → `← Back to CV`/`href="/cv"` verified over built HTML of a throwaway `/hdrtest` mount; `/`→null and `/cv`→Overview verified via verbatim `backLinkFor` branch test, since mounting those real routes would alter live pages.)
  - [x] Header contains links to `linkedin.com/in/joncarlsen` and `github.com/carlsendk`, and does NOT contain the Knowledge Base URL (`carlsendk.github.io`). (Built HTML: both URLs present, KB count 0.)
  - [x] Header identity is a link to `/` and is NOT an `<h1>` (no `<h1>` introduced by the component). (Built HTML: `<a href="/" class="group …">`, `<h1>` count 0.)
  - [x] Each icon link exposes an accessible name ("LinkedIn"/"GitHub") (e.g. `aria-label` or visually-hidden text present). (Built HTML: `aria-label="LinkedIn"` and `aria-label="GitHub"`.)
- Integration tests:
  - [x] `npm run check` → 0 errors / 0 warnings with the new component. (`Result (30 files): 0 errors, 0 warnings, 16 pre-existing zod hints`; run with gitignored local-only `docs/` moved aside — it OOM-crashes check and does not exist in CI.)
  - [x] `npm run build` → exits 0; live pages are byte-unchanged (component is unused this task). (`27 page(s) built … Complete!`, exit 0; Header absent from `dist` as unreachable; `git status` shows only the new component file.)
- Test coverage target: >=80% (back-link branches and link filter exercised)
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- `src/components/Header.astro` exists, is sticky/translucent with `id="site-header"`, and renders identity + derived back-link + LinkedIn/GitHub icons + composed toggle.
- No `<h1>` added; no scroll JS added; no live-site change yet.
- `astro check` and `astro build` are green.
