---
status: completed
title: Timeline long-tail collapse — keep recent roles, collapse the rest behind one bulk button
type: frontend
complexity: medium
dependencies:
  - task_01
  - task_02
---

# Task 5: Timeline long-tail collapse — keep recent roles, collapse the rest behind one bulk button

## Overview
Reduce the fatigue of the long experience timeline by keeping the most recent
roles visible and collapsing the earlier ones behind a single bulk expander, while
keeping every role rendered in the DOM so print, no-JS, and search engines still
get the complete history. The collapse is a progressive enhancement: the page
ships expanded and a small bundled script collapses the tail on load and wires the
toggle.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST render ALL roles in the server output (no `.slice()` / limit that drops
  roles); collapse is visual only. The full CV continues to show every role.
- MUST keep the first `collapseConfig.recentRoles` (4) roles always visible and
  group the remaining roles into one collapsible region with a single bulk
  control labelled with the hidden count (e.g. "Show earlier roles (N)").
- The control MUST be a real `<button>` with `aria-expanded` reflecting state, and
  MUST be keyboard operable. No per-role toggles.
- The default server-rendered state MUST be expanded; a bundled, deferred IIFE
  `<script>` (matching the ThemeToggle idiom) MUST collapse the tail on load and
  toggle a collapse class + `aria-expanded` on click.
- MUST add a `@media print` rule that neutralizes the collapse class so the
  printed CV shows all earlier roles, mirroring the existing `.reveal` cancel.
- Expanded-on-click content MUST render at full opacity (MUST NOT be left stuck at
  the `.reveal` `opacity:0` state).
- The collapsed tail MUST be below the fold so the on-load collapse does not count
  against the Lighthouse CLS/perf budget.

</requirements>

## Subtasks
- [x] 5.1 Split the `shown` roles in `Timeline.astro` into recent
  (`collapseConfig.recentRoles`) and earlier, rendering both groups (all roles in
  the DOM).
- [x] 5.2 Wrap the earlier group in a collapsible region with a single
  `<button aria-expanded>` bulk control showing the hidden count.
- [x] 5.3 Add the bundled collapse `<script>` (collapse on load + toggle). Built as
  a deferred `<script type=module>` importing `initCollapse` from a tiny shared
  module `src/scripts/collapse.ts` (techspec-sanctioned) so the toggle is unit-
  testable without a browser; still bundled+deferred per the ThemeToggle posture.
- [x] 5.4 Add the collapse class and its `@media print` neutralization to
  `global.css`; ensure expanded content resolves to full opacity (display-based
  toggle, not opacity — browser-verified opacity:1 on expand).
- [x] 5.5 Confirm `variant="condensed"` (home page) behavior is unchanged — collapse
  applies to `variant="full"` only.
- [x] 5.6 Add unit + integration tests for completeness, default-expanded, toggle,
  and print.

## Implementation Details
Edit `src/components/Timeline.astro` (split `shown` at the role loop, lines ~30–72)
and `src/styles/global.css` (collapse class + `@media print` block near line 264).
Consume `collapseConfig.recentRoles` from `cv.ts` (task 01). The bundled `<script>`
follows the ThemeToggle pattern (IIFE, `getElementById`/`querySelector`,
`classList`, `aria-*`); see TechSpec "Implementation Design" and ADR-003 for the
class-toggle-default-expanded mechanism and the print-forcing rationale. Do not use
`<details>` for this content (it cannot be reliably forced open in print — ADR-003).
The `id="experience"` + lead-in were added in task 02; do not redo them.

### Relevant Files
- `src/components/Timeline.astro` — split recent/earlier roles, add the collapsible
  region + bundled toggle script.
- `src/styles/global.css` — collapse class + `@media print` neutralization;
  full-opacity-on-expand handling.
- `src/data/cv.ts` — `collapseConfig.recentRoles` source (task 01).

### Dependent Files
- `src/pages/index.astro` — uses Timeline `variant="condensed"`; must stay
  unchanged (verify no regression).
- `src/pages/cv.astro` — renders Timeline `variant="full"`; the collapse appears
  here.

### Related ADRs
- [ADR-003: Long-tail disclosure via always-rendered DOM + class toggle](../adrs/adr-003.md) — the exact mechanism, print-forcing, and the no-`<details>`-for-content rule.
- [ADR-001: Restructure /cv … disclosing only the long tail](../adrs/adr-001.md) — collapse limited to the long tail.

## Deliverables
- Timeline rendering all roles with the earlier tail collapsed behind one bulk
  toggle on `variant="full"`; print/no-JS show all.
- Collapse class + print neutralization in `global.css`.
- Unit tests with 80%+ coverage of the split/markup **(REQUIRED)**.
- Integration tests for toggle, completeness, and print **(REQUIRED)**.

## Tests
All in `tests/cv-structure-05.test.mjs` (15 tests, green) unless noted.
- Unit tests:
  - [x] Built Timeline (full) renders a number of role entries equal to
    `cvData.roles.length` (no roles dropped).
  - [x] The first `recentRoles` (4) roles are outside the collapsible region; the
    remaining roles are inside it.
  - [x] The bulk control is a `<button>` with `aria-expanded` and a label
    including the hidden count.
  - [x] `variant="condensed"` output is unchanged (no collapse region). Also
    updated the task-02 forward-guard in `tests/cv-structure-02.test.mjs`.
- Integration tests:
  - [x] With JS enabled, clicking the control toggles `aria-expanded` and reveals
    the earlier roles at full opacity (not `opacity:0`). Automated: behavioural
    `initCollapse` test against a DOM stub. Also browser-verified (opacity 1).
  - [x] With JS disabled, all roles are visible (default-expanded SSR) — built-HTML
    asserts `aria-expanded="true"` SSR + the button ships `hidden`.
  - [x] Print preview shows all earlier roles (collapse class neutralized by the
    print rule) — CSS-source assertion + browser print-media verification.
  - [~] Lighthouse perf ≥ 0.90 with no CLS regression attributable to the collapse.
    Enforced by the existing CI Lighthouse gate (`netlify.toml` / `netlify-gate`),
    not re-run locally. CLS mitigation (tail collapses below the fold) verified in
    the browser; no local Lighthouse score claimed.
- Test coverage target: >=80% (split/markup + toggle logic comprehensively covered)
- All tests must pass (suite: 222 pass / 4 pre-existing unrelated baseline fails)

## Success Criteria
- All tests passing
- Test coverage >=80%
- On `/cv`, recent roles show immediately and earlier roles collapse behind one
  button; no role is ever dropped; print and no-JS render the full history;
  Lighthouse budgets hold.
