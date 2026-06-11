---
status: completed
title: CvNav right-margin rail + mobile dropdown + scroll-spy, rendered in cv.astro, with final whole-page verification
type: frontend
complexity: high
dependencies:
    - task_01
    - task_04
    - task_05
---

# Task 6: CvNav right-margin rail + mobile dropdown + scroll-spy, rendered in cv.astro, with final whole-page verification

## Overview
Add the in-page navigation that makes the long `/cv` navigable: a right-margin
sticky "On this page" rail on desktop, a collapsed dropdown on small screens, and
current-section highlighting as the reader scrolls. This is the keystone task; it
also carries the final whole-page verification because it is the last feature to
land and the Lighthouse/perf gate must account for both new scripts (this
scroll-spy and the task-05 collapse) together.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST add `src/components/CvNav.astro` rendering a `<nav aria-label="On this
  page">` whose links are built from `navGroups` (task 01), each targeting the
  group's `anchor` section id.
- Desktop (`lg+`): MUST present as a vertical rail pinned in the right margin
  (`position: sticky`), outside the `max-w-2xl` column, consuming no column width.
- Small screens: MUST present as an openable dropdown (native `<details>`/`<summary>`
  "Jump to…"), not the full rail and not hidden. (`<details>` is acceptable for the
  nav because it is print-hidden — ADR-002/003.)
- MUST add a bundled, deferred IIFE `<script>` using `IntersectionObserver` to set
  `aria-current` on the active group link as spanned sections enter the viewport;
  anchors MUST work without JavaScript (highlight is enhancement only).
- MUST render `<CvNav/>` from `src/pages/cv.astro` only (route-scoped; not in the
  global `Base` layout).
- MUST NOT require changing `scroll-padding-top` (the rail does not stack under the
  sticky header); MUST verify anchor landings clear `#site-header` in both themes.
- The nav MUST be hidden in print (it is a `<nav>`, already covered by the existing
  print rule — confirm).

</requirements>

## Subtasks
- [ ] 6.1 Build `CvNav.astro` rendering the six `navGroups` links (rail markup +
  mobile `<details>` dropdown from the same data).
- [ ] 6.2 Add the right-margin rail + dropdown styles to `global.css` (sticky,
  margin-positioned, `lg+` rail / below-`lg` dropdown).
- [ ] 6.3 Add the `IntersectionObserver` scroll-spy bundled script setting
  `aria-current`.
- [ ] 6.4 Render `<CvNav/>` from `cv.astro`.
- [ ] 6.5 Verify anchor landings clear the sticky header in light and dark; the rail
  never overlaps the column; the dropdown opens/closes by keyboard.
- [ ] 6.6 Run the final whole-page gate (lint/check/build/linkinator/Lighthouse) and
  the no-JS/print checks; add the tests below.

## Implementation Details
Create `src/components/CvNav.astro` and render it from `src/pages/cv.astro` (after
the reorder from task 04). Consume `navGroups` from `cv.ts`. Use the bundled-IIFE
script idiom (ThemeToggle) for the `IntersectionObserver`. Add rail/dropdown rules
to `src/styles/global.css`; the rail is `position: sticky` in the right margin and
appears only where margin exists (`lg+`). The existing `@media print { nav { … } }`
already hides it. See the TechSpec "System Architecture" / "Integration Points" and
ADR-002 for the rail-vs-stacked-bar rationale and the no-`scroll-padding-top`-change
property. Group→section mapping and the six labels come from `navGroups`.

### Relevant Files
- `src/components/CvNav.astro` — new in-page nav component + scroll-spy script.
- `src/styles/global.css` — rail/dropdown styles; confirm print `nav` hide and
  `scroll-padding-top: 4.5rem` still clears the header.
- `src/pages/cv.astro` — render `<CvNav/>` (route-scoped).
- `src/data/cv.ts` — `navGroups` source (task 01).

### Dependent Files
- `src/components/Header.astro` / `src/layouts/Base.astro` — the sticky header the
  nav must coordinate with (no edits expected; verify stacking/offset).
- All 14 section components — provide the anchor ids the nav targets (tasks 02/03).

### Related ADRs
- [ADR-002: In-page navigation as a right-margin sticky rail with PE scroll-spy](../adrs/adr-002.md) — the nav shape, mobile dropdown, and offset property.
- [ADR-003: Disclosure mechanism / progressive-enhancement posture](../adrs/adr-003.md) — `<details>` acceptable for nav, JS-surface posture and Lighthouse gate.
- [ADR-001: Restructure /cv … adding in-page navigation](../adrs/adr-001.md) — the navigability pillar.

## Deliverables
- `CvNav.astro` (rail + mobile dropdown + scroll-spy) rendered on `/cv`.
- Rail/dropdown styles in `global.css`.
- Unit tests with 80%+ coverage of the nav markup/links **(REQUIRED)**.
- Integration tests for anchor landing, scroll-spy, responsive form, no-JS, print,
  and the Lighthouse gate **(REQUIRED)**.

## Tests
- Unit tests:
  - [ ] `CvNav` renders exactly six links whose `href` targets match every
    `navGroups[].anchor`; no dead anchors (each target id exists in built `/cv`).
  - [ ] Each link/anchor target id is present in the built `/cv` HTML.
  - [ ] The component renders both the rail and the `<details>` dropdown markup
    from the same `navGroups` data.
- Integration tests:
  - [ ] Navigating to each group anchor scrolls the target heading clear of
    `#site-header` in both light and dark themes (scroll-padding sufficient).
  - [ ] Scroll-spy sets `aria-current="true"` on the link whose spanned sections
    are in view and clears it on others.
  - [ ] At `lg+` the rail shows in the right margin without overlapping the column;
    below `lg` only the dropdown shows; with JS off, anchor links still navigate.
  - [ ] Print output hides the nav and shows all content (with task-05 collapse
    neutralized).
  - [ ] `lint`/`check`/`build`/`linkinator` pass; Lighthouse performance ≥ 0.90 and
    accessibility ≥ 0.95 with both new scripts present.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- A reader can jump to any of the six groups and always sees the current one
  highlighted; the rail costs no column space and needs no scroll-offset change;
  no-JS and print remain complete; the Lighthouse budgets hold — completing the
  PRD's navigability and full-overview goals.
