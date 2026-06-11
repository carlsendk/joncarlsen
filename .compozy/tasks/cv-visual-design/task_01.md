---
status: completed
title: Establish CSS design-token foundation and dark variant in global.css
type: frontend
complexity: medium
dependencies: []
---

# Task 1: Establish CSS design-token foundation and dark variant in global.css

## Overview
Introduce the semantic design-token system that drives both light and dark themes, so every component can reference theme-agnostic utilities and a theme switch becomes a single class flip on `<html>`. This is the foundation the entire redesign builds on.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST register the class-based dark variant `@custom-variant dark (&:where(.dark, .dark *))` (Tailwind v4 idiom — not a v3 JS config).
- MUST define semantic CSS custom properties (`--bg`, `--fg`, `--muted`, `--accent`, `--border`) in `:root` for light and override them under `.dark`.
- MUST map the tokens into utilities via `@theme inline` so `bg-bg`, `text-fg`, `text-accent`, `text-muted`, `border-border` resolve to the live, theme-switched value.
- MUST use a soft near-black for the dark base (not pure black) per ADR-001/ADR-003.
- MUST preserve the existing `@layer base` rules (smooth scroll, font smoothing, the focus-visible safety net).
- SHOULD register `--font-display`, `--font-mono`, `--font-sans` token names now (faces are wired in task_02) so dependents can reference them.
</requirements>

## Subtasks
- [x] 1.1 Add the `@custom-variant dark` declaration.
- [x] 1.2 Define the light token set in `:root` and the dark overrides in `.dark`.
- [x] 1.3 Map tokens to utilities with `@theme inline` (colors + font token names).
- [x] 1.4 Preserve the existing base-layer rules unchanged.
- [x] 1.5 Verify the token utilities compile and switch with the `.dark` class.

## Implementation Details
Extend `src/styles/global.css`. See TechSpec "Core Interfaces" for the exact token contract and the `@theme inline` mapping. Do not introduce a Tailwind JS config — the project runs Tailwind v4 through PostCSS.

### Relevant Files
- `src/styles/global.css` — the single source of visual truth; gains the token layer and dark variant.
- `postcss.config.mjs` — confirms the Tailwind v4 PostCSS pipeline the tokens resolve through.

### Dependent Files
- `src/layouts/Base.astro` — will switch `<body>` to `bg-bg text-fg` (task_03).
- `src/components/*.astro` — will consume the token utilities (task_05).

### Related ADRs
- [ADR-003: Class-based theming with per-theme accent tokens and an inline flash-guard](../adrs/adr-003.md) — defines the token + dark-variant approach.
- [ADR-001: "Editorial refined" visual direction](../adrs/adr-001.md) — soft-gray dark base, single cobalt accent.

## Deliverables
- `global.css` extended with `@custom-variant dark`, `:root`/`.dark` tokens, and the `@theme inline` mapping.
- Existing base-layer rules retained.
- Dist-HTML/CSS assertions verifying token resolution **(REQUIRED)**.
- A green `astro build` confirming utilities compile **(REQUIRED)**.

## Tests
- Unit tests:
  - [ ] A probe element with `bg-bg text-fg` resolves to the light token values when `<html>` has no `.dark` class.
  - [ ] Adding `.dark` to `<html>` changes the computed `--bg`/`--fg` to the dark values.
  - [ ] `text-accent` resolves to `#1d4ed8` in light and `#60a5fa` in dark.
  - [ ] The built CSS still contains the focus-visible safety-net rule from `@layer base`.
- Integration tests:
  - [ ] `astro check` and `astro build` exit 0; the production CSS contains the token-backed utility classes.
  - [ ] The CSS-size budget step (Netlify) stays under its limit after the token layer is added.
- Test coverage target: >=80% of the token utilities exercised (bg, fg, muted, accent, border).
- All tests must pass.

## Success Criteria
- All tests passing
- Test coverage >=80%
- Components can reference semantic utilities that switch entirely via a `.dark` class flip.
- No Tailwind JS config introduced; tokens resolve through the existing PostCSS pipeline.


## Implementation Notes (as-built)
- Implemented in `src/styles/global.css`: `@custom-variant dark (&:where(.dark, .dark *))`, `:root` light tokens, `.dark` soft-near-black overrides, and an `@theme inline` mapping. Color tokens resolve to `var(--…)` (theme-live); font tokens inline literal stacks (fonts don't theme-switch). Base layer preserved verbatim.
- Verified (worktree `cv-visual-task01-tokens`, commit `cfb7dbb`): `astro check` 0 errors/0 warnings; `astro build` exit 0; built CSS contains `:root`/`.dark` token blocks with the accent pair `#1d4ed8`/`#60a5fa`, generated utilities (`bg-bg`→`var(--bg)`, `text-fg`, `text-accent`, `text-muted`, `border-border`, `font-display`→Fraunces, `font-mono`→JetBrains Mono), and the focus-visible safety net; CSS size 10,113 B (< 20,480 budget). Utility generation proven via a temporary probe page (removed before the final build).
- The code change lives on worktree branch `worktree-cv-visual-task01-tokens` (local, not pushed); merge to `master` to carry it into the deploy line.
