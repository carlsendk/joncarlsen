---
status: completed
title: Relocate the theme toggle and wire the header into the layout, with chrome CSS
type: refactor
complexity: medium
dependencies:
  - task_01
---

# Task 2: Relocate the theme toggle and wire the header into the layout, with chrome CSS

## Overview
Make the header live on every page in a single atomic change: drop the
`ThemeToggle`'s floating positioning and convert its click handler to a bundled
script, replace the standalone `<ThemeToggle />` in `Base.astro` with `<Header />`
as the first `<body>` child (keeping the inline flash guard), and add the chrome
CSS (`#site-header` print-hide + `scroll-padding-top`). Bundling these avoids any
intermediate state with a double or unpositioned toggle, or a print/anchor
regression.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST remove the `fixed top-3 right-3 z-50` positioning utilities from `ThemeToggle.astro` so it sits in the header's flex row, preserving its markup, SVGs, `aria-label`, and `aria-pressed` behavior.
- MUST convert the `ThemeToggle` click handler from `is:inline` to a standard Astro-processed (bundled) `<script>`; the toggle MUST still flip `.dark`, persist to `localStorage`, and sync `aria-pressed`.
- MUST keep the pre-paint flash guard in `Base.astro`'s `<head>` inline and unchanged (per ADR-004); the no-flash behavior MUST be preserved.
- MUST replace the standalone `<ThemeToggle />` in `Base.astro` with `<Header />` rendered as the first child of `<body>`, leaving exactly one theme toggle on the page (inside the header).
- MUST add `#site-header` to the print `display:none` chrome rule in `global.css` WITHOUT hiding the Hero `<header>` (hide by id, not by element), and MUST add `html { scroll-padding-top: … }` sized to the header so anchor targets are not obscured.
- MUST keep the build green and the live header functional on all five routes after this task (back-link, links, toggle all working).
</requirements>

## Subtasks
- [x] 2.1 Remove the fixed-position utilities from `ThemeToggle.astro`; keep markup, SVGs, and ARIA intact.
- [x] 2.2 Convert the toggle's `is:inline` handler to a bundled `<script>` preserving toggle/persist/`aria-pressed`.
- [x] 2.3 In `Base.astro`, render `<Header />` as the first `<body>` child and remove the standalone `<ThemeToggle />`; leave the inline `<head>` flash guard untouched.
- [x] 2.4 Add `#site-header` to the print `display:none` list in `global.css` (id-scoped, not `header`), and add `html { scroll-padding-top }`.
- [x] 2.5 Verify one working toggle in-header, no flash, and that print hides the header but keeps Hero.

## Implementation Details
Edit `src/components/ThemeToggle.astro`, `src/components/Header.astro` (only if
the composition needs the de-positioned toggle), `src/layouts/Base.astro`, and
`src/styles/global.css`. The standalone toggle currently renders at
`Base.astro:74` (before `<slot />`); swap it for `<Header />`. The flash guard is
the inline `<head>` script at `Base.astro` lines ~26–42 — leave it inline (ADR-004
records why). In `global.css`, the print rule currently hides `#theme-toggle, nav`
(line ~200); add `#site-header` there. Because `Hero.astro` also uses a
`<header>` element, the print-hide MUST target the id, never the element. Size
`scroll-padding-top` to the rendered header height. See TechSpec "System
Architecture", "Impact Analysis", and "Development Sequencing" (steps 3–5).

### Relevant Files
- `src/layouts/Base.astro` — renders the standalone `<ThemeToggle />` at line ~74 (to swap for `<Header />`); holds the inline flash guard at lines ~26–42 (keep).
- `src/components/ThemeToggle.astro` — `fixed top-3 right-3 z-50` classes to drop; `is:inline` handler to bundle (lines ~10–47).
- `src/components/Header.astro` — created in task_01; composes the toggle.
- `src/styles/global.css` — print chrome rule `#theme-toggle, nav { display:none }` (~line 200) to extend; `html` block for `scroll-padding-top`; existing `scroll-behavior: smooth`.

### Dependent Files
- `src/pages/cv.astro`, `src/pages/impact.astro`, `src/pages/work/index.astro`, `src/pages/work/[slug].astro` — after this task their inline back-link navs are duplicated by the header; task_03 removes them.
- `src/pages/index.astro` — gains the live header via `Base.astro` (no per-page edit).

### Related ADRs
- [ADR-004: Retain inline theme flash guard; bundle the click handler](../adrs/adr-004.md) — guard stays inline; handler becomes a bundled `<script>`; toggle composed into header.
- [ADR-002: Always-visible, pure-CSS sticky behavior](../adrs/adr-002.md) — no scroll JS introduced by the wiring.
- [ADR-003: Single shared Header in Base.astro](../adrs/adr-003.md) — `<Header />` placement and `#site-header` print hook.

## Deliverables
- `ThemeToggle.astro` de-positioned with a bundled handler; one toggle living in the header.
- `Base.astro` rendering `<Header />` first in `<body>`, standalone toggle removed, inline flash guard intact.
- `global.css` print-hiding `#site-header` (Hero preserved) and adding `scroll-padding-top`.
- Verification evidence: single toggle, no flash, print hides only the header **(REQUIRED)**.

## Tests
- Unit tests (render assertions over built HTML):
  - [ ] Every built route contains exactly one `#theme-toggle`, nested inside `#site-header`; zero `fixed`-positioned toggle remains.
  - [ ] `Base`'s `<head>` still contains the inline flash-guard script (string present); the toggle handler is emitted as a bundled module script, not `is:inline`.
  - [ ] Home (`/`) renders one `#site-header` and still exactly one `<h1>` (Hero's).
- Integration tests:
  - [ ] `npm run check` → 0 errors / 0 warnings; `npm run build` → exits 0; all five routes emitted.
  - [ ] `linkinator ./dist --recurse` (existing skip list) → header LinkedIn/GitHub and back-link targets resolve (200).
  - [ ] Manual: toggling theme from the in-header button flips and persists across reload with no flash; Lighthouse perf ≥ 0.90 and a11y ≥ 0.95 in both themes.
  - [ ] Print preview: `#site-header` hidden, Hero `<header>` visible, existing outbound-URL print behavior intact.
  - [ ] Keyboard: focusing a near-top in-page target is not obscured by the sticky bar (`scroll-padding-top` honored).
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- The header is live on all five routes with a single working, in-header theme toggle and no theme flash.
- Print hides `#site-header` but keeps Hero; anchors clear the sticky bar.
- `astro check`, `astro build`, and `linkinator` all green; Lighthouse budgets met in both themes.
