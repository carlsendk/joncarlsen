---
status: completed
title: Reorder cv.astro to the PRD section order and wire leadIn props to every section
type: refactor
complexity: low
dependencies:
    - task_02
    - task_03
---

# Task 4: Reorder cv.astro to the PRD section order and wire leadIn props to every section

## Overview
Re-sequence the `<main>` render block of `cv.astro` to the approved order that
front-loads proof (Impact and Expertise above the Timeline; Approach below the
case studies), and pass each section its `leadIn` from `sectionLeadIns`. This is
the single-file integration point where the reorder and lead-ins become visible;
it depends on every section already accepting `leadIn` and exposing its anchor id.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST reorder the section components in `src/pages/cv.astro`'s `<main>` to exactly
  this order: Summary, Credentials, Impact, Expertise, Timeline, CaseStudies,
  Approach, Education, Certifications, Publications, VoluntaryLeadership,
  PersonalDetails, Interests, Links (Hero stays as the `<header>` above `<main>`).
- MUST preserve every existing prop each component already receives (e.g.
  `Timeline roles=... variant="full"`, `Impact items=...`, `Links links=...
  resumePdf=...`); only ADD a `leadIn` prop.
- Each section MUST receive `leadIn={sectionLeadIns.<slug>}` (or equivalent) so the
  central map drives the copy; sections omitted from the map pass `undefined` and
  render no lead-in.
- MUST NOT remove or rename any section, and MUST NOT alter component internals
  (those are tasks 02/03/05).
- MUST keep the page valid with no content loss — all 14 sections still present.

</requirements>

## Subtasks
- [ ] 4.1 Import `sectionLeadIns` (and any needed type) into `cv.astro`.
- [ ] 4.2 Re-sequence the `<main>` children to the approved order.
- [ ] 4.3 Add `leadIn={sectionLeadIns.<slug>}` to each section, preserving existing
  props.
- [ ] 4.4 Verify the move of Impact + Expertise above Timeline and Approach below
  CaseStudies reads correctly in both themes.
- [ ] 4.5 Add tests asserting the rendered section order and that no section was
  dropped.

## Implementation Details
Edit only `src/pages/cv.astro`. The current `<main>` order is Summary →
Credentials → Timeline → Impact → Approach → CaseStudies → Expertise → Education →
… ; re-sequence to put Impact and Expertise before Timeline and move Approach
after CaseStudies, per the TechSpec "Build Order" step 3 and PRD Core Feature 1.
Pull lead-in strings from the `sectionLeadIns` map added in task 01. Do not change
component files. See the TechSpec Impact Analysis row for `cv.astro`.

### Relevant Files
- `src/pages/cv.astro` — the only file edited; reorder + `leadIn` props.

### Dependent Files
- `src/components/*` (all 14 sections) — must already accept `leadIn` and expose
  their anchor id (tasks 02/03); consumed here.
- `src/data/cv.ts` — `sectionLeadIns` source (task 01).
- `src/components/CvNav.astro` — task 06 renders into this same file afterward.

### Related ADRs
- [ADR-001: Restructure /cv by front-loading proof](../adrs/adr-001.md) — the reorder is the core of this decision.
- [ADR-004: Per-section lead-ins from a central map](../adrs/adr-004.md) — props wired here.

## Deliverables
- `cv.astro` rendering the 14 sections in the approved order with `leadIn` props.
- Unit tests with 80%+ coverage of the order + prop wiring **(REQUIRED)**.
- Integration test of the built page order and completeness **(REQUIRED)**.

## Tests
- Unit tests:
  - [ ] `cv.astro` lists the section components in the exact approved order
    (source-order assertion).
  - [ ] Every section receives a `leadIn` prop and retains its prior props
    (e.g. Timeline still has `variant="full"`, Links still has `resumePdf`).
  - [ ] No section component was removed from `cv.astro`.
- Integration tests:
  - [ ] Built `/cv` HTML emits the 14 section anchor ids in order: summary,
    credentials, impact, expertise, experience, work, approach, education,
    certifications, publications, voluntary, personal, interests, links.
  - [ ] Impact and Expertise anchors appear before the experience anchor in the
    HTML; approach appears after work.
  - [ ] `lint`/`check`/`build` green; `linkinator` finds no broken links.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- The first screen presents identity → summary → proof (Impact) → competencies
  (Expertise) above the Timeline; all 14 sections remain present; lead-ins render
  from the central map.
