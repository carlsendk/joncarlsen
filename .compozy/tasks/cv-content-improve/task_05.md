---
status: completed
title: 'Surface featured projects and a "See all projects" link'
type: frontend
complexity: low
dependencies:
  - task_01
  - task_04
---

# Task 5: Surface featured projects and a "See all projects" link

## Overview
Keep the frontpage and full CV scannable as projects grow: show only featured
projects in the "Selected Work" listing and add a clear "See all projects" link
to the `/projects` index (ADR-002, ADR-003).

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST update `src/components/CaseStudies.astro` to filter the `work` query to `featured === true` (still excluding drafts) before sorting by `order`.
- MUST append a descriptive "See all projects" link to `/projects` within or directly after the Selected Work section.
- MUST preserve the existing empty-state guard: render nothing when there are no featured entries.
- MUST keep the component usable unchanged by both `src/pages/index.astro` and `src/pages/cv.astro` (no prop changes required at call sites).
- MUST use descriptive link text, tokens only, no client JS, and no contact details (ADR-002).
</requirements>

## Subtasks
- [x] 5.1 Filter the `CaseStudies` query to featured, non-draft entries.
- [x] 5.2 Add the "See all projects" link to `/projects` with descriptive text.
- [x] 5.3 Confirm both the frontpage and `/cv` show only featured work plus the link.
- [x] 5.4 Confirm the empty-featured state renders nothing.

## Implementation Details
Modify `src/components/CaseStudies.astro` only. Reference the TechSpec
"System Architecture" (CaseStudies modification). The `featured` field comes from
task_01; the `/projects` route from task_04.

### Relevant Files
- `src/components/CaseStudies.astro` — the listing to filter and extend.
- `src/pages/index.astro`, `src/pages/cv.astro` — call sites that must keep working unchanged.
- `src/pages/projects.astro` — link target (task_04).

### Dependent Files
- `src/pages/index.astro`, `src/pages/cv.astro` — behaviour changes (fewer cards, new link) without code edits.

### Related ADRs
- [ADR-002: Two-tier project model](adrs/adr-002.md) — featured surfaced; the rest on the index.
- [ADR-003: Hybrid content model](adrs/adr-003.md) — `featured` controls surfacing only.

## Deliverables
- `CaseStudies.astro` filtered to featured entries plus a "See all projects" link.
- Frontpage and `/cv` show only featured work and link to `/projects`.
- Filter/link verification evidence **(REQUIRED)**.

## Tests
- Unit tests (render/filter verification):
  - [ ] With a non-featured non-draft entry present, `CaseStudies` omits it on both `/` and `/cv`.
  - [ ] A featured entry appears in the listing; a "See all projects" link to `/projects` is present.
  - [ ] When no entry is featured, the section renders nothing.
- Integration tests:
  - [ ] `npx astro check` and `npx astro build` exit 0.
  - [ ] On the built `/` and `/cv`, the only `work` cards shown are featured ones, and the `/projects` link resolves (linkinator, `--skip 'joncarlsen.dk'`).
- Test coverage target: >=80% (featured, non-featured, and empty states exercised)
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Frontpage and `/cv` show only featured projects plus a working "See all projects" link.
- Empty-featured state renders nothing; call sites unchanged; no contact details.
