---
status: completed
title: Convert case-study detail layout and remaining pages
type: refactor
complexity: medium
dependencies:
  - task_01
---

# Task 5: Convert case-study detail layout and remaining pages

## Overview
Convert the case-study detail layout and the remaining page-level files to role
classes, and bind the long-form article body to the single canonical cv-body role
(16px) per ADR-002/the TechSpec decision. Final conversion batch.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST convert work/[slug].astro to role classes, including binding the prose-cv article body to the canonical cv-body size (16px), keeping its structural concerns (heading spacing, link styling) intact.
- MUST convert the page shells src/pages/cv.astro, src/pages/index.astro, and src/layouts/Base.astro to role classes where they carry recurring roles (nav links, page intros, display title).
- MUST review ThemeToggle.astro and leave its one-off control styling inline if no role recurs.
- MUST keep per-instance colour utilities and all link target attributes in markup.
- MUST produce computed styles identical to baseline for these surfaces, except the enumerated drift corrections (article body size change to 16px is an accepted, intended change).
</requirements>

## Subtasks
- [x] 5.1 Capture the pre-change computed-style baseline for a case-study page, /cv, and the home page.
- [x] 5.2 Convert work/[slug].astro and bind the article body to cv-body (16px), preserving prose structural rules.
- [x] 5.3 Convert cv.astro, index.astro, Base.astro role usages (nav, intros, display title).
- [x] 5.4 Confirm ThemeToggle needs no role or convert if a role recurs.
- [x] 5.5 Rebuild and compare computed styles; confirm the article still reads well at 16px.

## Implementation Details
Edit the detail layout and page shells to use role classes from task 01. See
TechSpec "Technical Considerations" for the shared cv-body decision.

### Relevant Files
- `src/pages/work/[slug].astro` — case-study title (display), meta, badges, article body (prose-cv → cv-body), back link.
- `src/pages/cv.astro` — page composition / nav link.
- `src/pages/index.astro` — landing composition, primary link/pill.
- `src/layouts/Base.astro` — shared shell; display title / link defaults if any.
- `src/components/ThemeToggle.astro` — review; likely one-off control, leave inline.

### Dependent Files
- `src/styles/global.css` — provides the role classes (from task 01); not edited here.

### Related ADRs
- [ADR-002: @apply component classes](../adrs/adr-002.md) — conversion target.
- [ADR-001: one cohesive pass](../adrs/adr-001.md) — whole-site coverage including case studies.

## Deliverables
- Detail layout and remaining page shells converted; article body on canonical cv-body.
- Before/after computed-style evidence on a case-study page, /cv, and home.
- Unit tests with 80%+ coverage **(REQUIRED)**.
- Integration tests for computed-style parity and article readability **(REQUIRED)**.

## Tests
- Unit tests:
  - [ ] Build succeeds with these surfaces using role classes.
  - [ ] No leftover duplicated section/eyebrow/body utility strings remain in these files (grep check).
- Integration tests:
  - [ ] Computed styles on a case-study page, /cv, home match baseline except documented changes (article body now 16px).
  - [ ] The case-study article body renders at the canonical cv-body size and its headings/links still styled.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- All page-level surfaces use role classes; the article body uses the single cv-body role.
- No duplicated role utility strings remain across the converted files.
