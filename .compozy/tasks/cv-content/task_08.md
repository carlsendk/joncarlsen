---
status: completed
title: Add the print stylesheet for /cv
type: frontend
complexity: low
dependencies:
  - task_05
---

# Task 8: Add the print stylesheet for /cv

## Overview
Add an `@media print` stylesheet so a recruiter can save `/cv` as a clean PDF from
the browser, delivering the "downloadable CV" the PRD wants without any
PDF-generation feature (ADR-001).

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST add `@media print` rules (in `src/styles/global.css` or scoped to `/cv`) that: hide the theme toggle, the film-grain overlay, and any nav/footer chrome; force light ink-on-white regardless of theme; show all content expanded.
- MUST set sensible page-break behaviour so a role block does not split awkwardly across pages.
- SHOULD surface full URLs for outbound links in print (so a printed CV remains useful).
- MUST NOT affect the on-screen rendering of any page.
- MUST NOT introduce contact details in print (ADR-002).
</requirements>

## Subtasks
- [x] 8.1 Add `@media print` rules hiding toggle, grain, and nav chrome.
- [x] 8.2 Force light ink-on-white and expanded content for print.
- [x] 8.3 Add page-break rules to keep role blocks intact.
- [x] 8.4 Show full link URLs in print.
- [x] 8.5 Confirm screen rendering is unchanged.

## Implementation Details
Add the print rules to `src/styles/global.css` (alongside the existing grain and
motion blocks), targeting `/cv` structure. Reference the TechSpec "Technical
Considerations" print decision. Keep the on-screen token system untouched.

### Relevant Files
- `src/styles/global.css` — where grain/motion rules already live; add print rules here.
- `src/pages/cv.astro` — the page the print rules target (task_05).
- `src/components/ThemeToggle.astro` — element to hide in print.

### Dependent Files
- `src/pages/cv.astro` — visually affected under print emulation.

### Related ADRs
- [ADR-001: Hub-and-spoke information architecture](../adrs/adr-001.md) — print-friendly `/cv` replaces a PDF feature.

## Deliverables
- An `@media print` stylesheet producing a clean printable `/cv`.
- Print emulation evidence (toggle/grain hidden, light-on-white) **(REQUIRED)**.

## Tests
- Unit tests:
  - [ ] Under print emulation, the theme toggle and grain overlay are not rendered/visible on `/cv`.
  - [ ] Print rendering is light ink-on-white even when dark mode is active.
  - [ ] Outbound link URLs are visible in print output.
- Integration tests:
  - [ ] Playwright `emulateMedia({ media: 'print' })` on `/cv` confirms the above; screen rendering of `/` and `/cv` is unchanged.
  - [ ] `astro build` exits 0; Lighthouse on-screen scores unaffected.
- Test coverage target: >=80% (print rules exercised via emulation).
- All tests must pass.

## Success Criteria
- All tests passing
- Test coverage >=80%
- `/cv` prints as a clean, light, contact-detail-free CV without changing on-screen rendering.

## Implementation Notes (as-built)
- Added an `@media print` block to `src/styles/global.css` (global, but only affects printing; tuned for `/cv`). It forces light ink-on-white by overriding the theme tokens (`--bg`/`--fg`/`--muted`/`--accent`/`--border`) with `!important` for `:root, .dark`, hides `#theme-toggle`, `nav`, and the film grain (`body::before`), un-fades every `.reveal` section (opacity/transform/animation reset so nothing prints faded), keeps entries from splitting (`break-inside: avoid` on `main li`, `article header`; `break-after: avoid` on h1/h2/h3), and appends the full URL after each external link (`main a[href^="http"]::after`).
- `!important` was required on the token overrides: source order put the print rule after the screen `.dark` tokens, but same-specificity cascade did not reliably win in dark mode, so `!important` guarantees the flip.
- Verified (Playwright print emulation): `--bg` goes `#0f1115` (screen) → `#fff` (print); toggle/nav/grain hidden in print only; below-fold reveal section opacity 0 (screen) → 1 (print); external link surfaces `" (https://www.linkedin.com/in/joncarlsen/)"`. Screen rendering unchanged (single `@media print` block; screen tokens intact). `astro check` 0/0; `astro build` exit 0. No contact details introduced (ADR-002).
- Note: this print CSS resets `.reveal` opacity, so a printed/PDF copy is unaffected by the scroll-reveal Lighthouse artifact flagged in task_05.
