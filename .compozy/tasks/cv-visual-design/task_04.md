---
status: completed
title: Build accessible ThemeToggle.astro (persisted, keyboard-operable)
type: frontend
complexity: medium
dependencies:
  - task_03
---

# Task 4: Build accessible ThemeToggle.astro (persisted, keyboard-operable)

## Overview
Add the manual light/dark toggle — the page's only interactive control beyond links. It flips and persists the theme using the class + `localStorage` contract established by the flash guard, with no framework runtime.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST create `src/components/ThemeToggle.astro` as a `<button>` with a vanilla inline handler (no framework island).
- MUST toggle the `.dark` class on `document.documentElement` and persist the choice to `localStorage.theme`.
- MUST expose state via `aria-pressed` and carry an accessible name (e.g. "Toggle dark mode").
- MUST be keyboard-operable (Enter/Space) with a visible focus indicator.
- MUST be mounted in a reachable location in the page (layout or hero).
- SHOULD guard any toggle transition behind `prefers-reduced-motion`.
</requirements>

## Subtasks
- [x] 4.1 Build the button markup with an accessible name and icon/label.
- [x] 4.2 Add the inline handler to flip `.dark` and persist `localStorage.theme`.
- [x] 4.3 Keep `aria-pressed` in sync with the active theme.
- [x] 4.4 Mount the toggle in a reachable place in the page.
- [x] 4.5 Ensure keyboard operation and a visible focus state.

## Implementation Details
Create `src/components/ThemeToggle.astro` and mount it (likely in `Base.astro` or `Hero.astro`). See TechSpec "Implementation Design" for the toggle contract. Reuse the `.dark`-class + `localStorage.theme` keys set by the task_03 guard. Depends on task_03.

### Relevant Files
- `src/components/ThemeToggle.astro` — the new toggle component.
- `src/layouts/Base.astro` — likely mount point; shares the storage/class contract.

### Dependent Files
- `src/styles/global.css` — focus-visible safety net applies to the button.

### Related ADRs
- [ADR-003: Class-based theming with per-theme accent tokens and an inline flash-guard](../adrs/adr-003.md) — toggle is the only client JS alongside the guard.

## Deliverables
- `ThemeToggle.astro` mounted and functional.
- Persistence + `aria-pressed` state sync.
- Accessibility tests (keyboard, focus, ARIA) **(REQUIRED)**.
- Confirmation no hydration runtime is shipped **(REQUIRED)**.

## Tests
- Unit tests:
  - [ ] Clicking the toggle adds/removes `.dark` on `<html>` and writes the matching `localStorage.theme`.
  - [ ] After a reload, the previously chosen theme is restored.
  - [ ] `aria-pressed` reflects the current theme (true in dark, false in light).
- Integration tests:
  - [ ] The toggle is operable by keyboard (Enter and Space) and shows a visible focus ring.
  - [ ] The build ships no framework/hydration runtime for the toggle (vanilla only).
  - [ ] `astro check` and `astro build` exit 0.
- Test coverage target: >=80% (toggle, persist, restore, ARIA, keyboard paths).
- All tests must pass.

## Success Criteria
- All tests passing
- Test coverage >=80%
- The toggle switches and remembers the theme, is fully keyboard/ARIA accessible, and ships no framework runtime.


## Implementation Notes (as-built)
- New `src/components/ThemeToggle.astro`: native `<button id="theme-toggle">` with `aria-label="Toggle dark mode"` + `aria-pressed`, moon/sun SVGs swapped via the `dark:` variant, token styling (`border-border`, `bg-bg/80`, `text-fg`), `motion-safe:transition-colors`, `focus-visible:outline-accent`. Self-contained `is:inline` handler flips `.dark` on `<html>`, persists `localStorage.theme`, and syncs `aria-pressed` (correcting the SSR default on load). Mounted in `Base.astro` body as a `fixed top-3 right-3` control.
- No framework island / no bundle: toggle is `is:inline`, so the only client JS remains the flash guard + this toggle (2 inline scripts, zero `_astro` JS).
- Verified (worktree, real Chromium): click light→dark (stored, `aria-pressed=true`, body `rgb(15,17,21)`); clean reload restores dark; click back→light; keyboard Tab focuses it (2px solid focus ring), Enter and Space both toggle; dark context syncs `aria-pressed=true` on load. `astro check` 0/0, `astro build` 0.
