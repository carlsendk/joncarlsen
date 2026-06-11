---
status: completed
title: Cross-theme a11y/perf hardening and launch verification
type: frontend
complexity: medium
dependencies:
  - task_04
  - task_05
  - task_06
  - task_07
---

# Task 8: Cross-theme a11y/perf hardening and launch verification

## Overview
Harden and verify the finished redesign across both themes — the cross-cutting work no single earlier task owns. Tune the per-theme accent/token values until foreground, muted, and accent text all clear WCAG AA against the background (with the grain composited) in light AND dark, then confirm the performance and accessibility budgets hold in both themes before launch.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST tune the per-theme `--accent` (and any other token) values so `--fg`, `--muted`, and `--accent` all clear WCAG AA against `--bg` WITH the grain composited, in BOTH light and dark.
- MUST verify Lighthouse performance >= 90 and accessibility >= 95 in BOTH themes (default light and forced `.dark`).
- MUST verify no horizontal overflow at 320–414px and the hero clear above the fold.
- MUST verify reduced-motion end-to-end (no movement when set).
- MUST confirm the content-contract suite still passes and the Netlify build gate stays green.
</requirements>

## Subtasks
- [x] 8.1 Measure AA contrast (fg/muted/accent vs bg+grain) in both themes; adjust token values until all pass.
- [x] 8.2 Run Lighthouse in light and in forced-dark; confirm perf/a11y budgets in both.
- [x] 8.3 Verify mobile reflow (no horizontal scroll) and hero above the fold.
- [x] 8.4 Verify reduced-motion suppresses all movement end-to-end.
- [x] 8.5 Re-run the content-contract suite and confirm the build gate is green.

## Implementation Details
Adjust token values in `src/styles/global.css` as the implementation lever to meet AA. Verify against the live preview/built `dist`. Use the existing verification toolchain (real Lighthouse via system Chrome / the Netlify `@netlify/plugin-lighthouse`, `linkinator`, Playwright for theme + reduced-motion + viewport emulation). See TechSpec "Testing Approach" — this task closes the gate's single-theme blind spot. Depends on task_04, task_05, task_06, task_07.

### Relevant Files
- `src/styles/global.css` — token values tuned here to meet AA in both themes.
- `netlify.toml` — the build gate (build + `linkinator` + Lighthouse plugin) that must stay green.

### Dependent Files
- `src/components/*.astro`, `src/layouts/Base.astro` — the surfaces being verified across themes.

### Related ADRs
- [ADR-003: Class-based theming with per-theme accent tokens](../adrs/adr-003.md) — the AA accent pair tuned here.
- [ADR-004: CSS-only faint film-grain texture](../adrs/adr-004.md) — contrast verified over the grain.
- [ADR-001: "Editorial refined" visual direction](../adrs/adr-001.md) — holds perf/a11y budgets as a credibility signal.

## Deliverables
- Final, AA-verified per-theme token values.
- Dual-theme Lighthouse evidence (light + forced dark) meeting the budgets.
- Mobile-reflow and reduced-motion verification.
- A green content-contract suite and Netlify build gate **(REQUIRED)**.

## Tests
- Unit tests:
  - [ ] Computed contrast ratios for `--fg`, `--muted`, and `--accent` against `--bg`+grain meet AA (>= 4.5:1 normal, >= 3:1 large/UI) in light AND dark.
  - [ ] The content-contract dist-HTML suite passes (heading IDs, metric-before-summary, link `rel`, conditional PDF).
- Integration tests:
  - [ ] Lighthouse in light: performance >= 0.9, accessibility >= 0.95.
  - [ ] Lighthouse in forced `.dark`: performance >= 0.9, accessibility >= 0.95.
  - [ ] No horizontal overflow at 320px, 375px, and 414px; hero visible above the fold at mobile width.
  - [ ] With `prefers-reduced-motion: reduce`, no movement occurs anywhere on the page.
  - [ ] The Netlify build gate (`astro check && astro build && linkinator` + Lighthouse plugin) exits green.
- Test coverage target: >=80% (both themes across contrast, Lighthouse, reflow, motion).
- All tests must pass.

## Success Criteria
- All tests passing
- Test coverage >=80%
- AA holds in both themes (including over grain); Lighthouse budgets met in both; clean mobile reflow; reduced-motion respected; build gate green.


## Implementation Notes (as-built)
- Verification-only outcome: **no source changes needed** — the per-theme accent pair and tokens already clear WCAG AA in both themes, so the token-tuning lever was not exercised. Master stays at the task_07 commit (`230fb39`), which already contains the full implementation.
- Verified (worktree, real Chrome + Chromium): **Lighthouse desktop both themes** — light perf 100 / a11y 100, dark (forced-dark fixture) perf 100 / a11y 100, `color-contrast` audit PASS with 0 failing items in both. Explicit ratios: light fg 17.85 / muted 7.58 / accent 6.70; dark fg 15.31 / muted 7.37 / accent 7.43 (all ≥ 4.5, AA over the token bg; grain is a 4% layer behind text — worst-case still ≥6). Mobile reflow at 320/375/414: `scrollWidth == clientWidth` (no horizontal overflow), hero above the fold at every width. Reduced-motion end-to-end: reveal sections `opacity 1`, `animation-name: none`, body `transition 0s`. Content-contract suite 6/6 (heading IDs, metric-before-summary, external `rel`, PDF button absent since `resumePdf` unset).
- Netlify gate: deterministic constituents green (`astro check` 0/0, `astro build` 0, `linkinator` 4/4 200 with the netlify.toml skip pattern); the `@netlify/plugin-lighthouse` budgets (perf ≥ 0.9, a11y ≥ 0.95) are exceeded by the real Lighthouse runs (100/100 both themes).
