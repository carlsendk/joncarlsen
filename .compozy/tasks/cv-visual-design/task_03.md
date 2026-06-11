---
status: completed
title: Add theme-flash guard and token-based body in Base.astro
type: frontend
complexity: low
dependencies:
  - task_01
  - task_02
---

# Task 3: Add theme-flash guard and token-based body in Base.astro

## Overview
Apply the theme system at the document level: a tiny blocking inline script sets the correct theme before first paint (no flash), and the `<body>` switches from hard-coded colors to semantic token utilities. This wires the foundation tokens into the actual page shell.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST add an `is:inline` blocking script in `<head>` that, before first paint, reads `localStorage.theme` (falling back to `prefers-color-scheme`) and sets the `.dark` class on `<html>`.
- MUST switch `<body>` from `bg-white text-slate-900` to the semantic token utilities (`bg-bg text-fg`).
- MUST preserve the existing meta, Open Graph, and canonical tags.
- MUST keep the inline script tiny and dependency-free; it and the toggle handler (task_04) are the ONLY client JS on the page (ADR-003).
- MUST NOT introduce any framework island or bundled runtime.
</requirements>

## Subtasks
- [x] 3.1 Add the `is:inline` theme-flash-guard script to `<head>`.
- [x] 3.2 Replace the hard-coded body classes with `bg-bg text-fg`.
- [x] 3.3 Confirm the task_02 font preloads remain in `<head>`.
- [x] 3.4 Verify the correct theme paints with no flash across the storage/preference cases.
- [x] 3.5 Confirm no additional client JS is shipped.

## Implementation Details
Modify `src/layouts/Base.astro`. See TechSpec "Core Interfaces" for the exact inline-guard snippet. Depends on task_01 (tokens) and task_02 (preloads already in head). Use Astro's `is:inline` so the script is not deferred or bundled.

### Relevant Files
- `src/layouts/Base.astro` — head script and body token classes.
- `src/styles/global.css` — provides the `.dark` overrides the script triggers.

### Dependent Files
- `src/components/ThemeToggle.astro` — relies on the `.dark`-class + `localStorage.theme` contract (task_04).

### Related ADRs
- [ADR-003: Class-based theming with per-theme accent tokens and an inline flash-guard](../adrs/adr-003.md) — the flash-guard + only-JS constraint.

## Deliverables
- `Base.astro` with the inline theme-flash guard and token-based body.
- Preserved meta/OG/canonical tags.
- No-flash verification across storage and system-preference states **(REQUIRED)**.
- Confirmation the JS surface is limited to the inline guard **(REQUIRED)**.

## Tests
- Unit tests:
  - [ ] With `localStorage.theme = "dark"`, `<html>` has the `.dark` class before first paint (no white flash).
  - [ ] With no stored value and `prefers-color-scheme: dark`, the page loads dark.
  - [ ] With no stored value and `prefers-color-scheme: light`, the page loads light.
  - [ ] The body's computed background equals the active `--bg` token value.
- Integration tests:
  - [ ] The built page ships no bundled JS beyond the inline guard (build output contains no client component runtime).
  - [ ] `astro check` and `astro build` exit 0; meta/OG/canonical tags remain present.
- Test coverage target: >=80% (all three initial-theme branches exercised).
- All tests must pass.

## Success Criteria
- All tests passing
- Test coverage >=80%
- The page paints in the correct theme with no flash; the body uses tokens.
- Client JS remains limited to the inline guard (plus the toggle in task_04).


## Implementation Notes (as-built)
- Added a blocking `is:inline` script early in `Base.astro` `<head>` (after the viewport meta): reads `localStorage.theme`, falls back to `matchMedia('(prefers-color-scheme: dark)')`, and toggles `.dark` on `<html>` before first paint (wrapped in try/catch for private-mode `localStorage`). Switched `<body>` to `bg-bg text-fg antialiased`. Meta/OG/canonical and the task_02 font preload preserved.
- Verified (worktree, real Chromium via Playwright, 4 fresh contexts): prefers-dark→`html.dark`+bg `rgb(15,17,21)`+accent `#60a5fa`; prefers-light→light+white+`#1d4ed8`; **saved choice overrides OS preference both directions**. Static: inline guard present in HTML, `.bg-bg`/`.text-fg` generated, no `_astro` JS bundle and no `<script src>` (client JS limited to the guard). `astro check` 0/0, `astro build` 0.
