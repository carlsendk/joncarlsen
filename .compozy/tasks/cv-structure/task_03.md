---
status: completed
title: Section anchors and lead-ins, batch 2 (Education, Certifications, Publications, VoluntaryLeadership, PersonalDetails, Interests, Links)
type: frontend
complexity: medium
dependencies:
  - task_01
---

# Task 3: Section anchors and lead-ins, batch 2 (Education, Certifications, Publications, VoluntaryLeadership, PersonalDetails, Interests, Links)

## Overview
Apply the same anchor + lead-in treatment to the seven lower-band sections, so the
in-page nav can reach them and each carries a one-line orientation. This mirrors
task 02 exactly on a different set of components and is independent of it (both
depend only on task 01's data and style).

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- For each of the seven components, MUST add `id="<slug>"` to the existing
  `<section ... class="reveal cv-section">` using the section's slug (`education`,
  `certifications`, `publications`, `voluntary`, `personal`, `interests`,
  `links`), preserving the existing `aria-labelledby` and classes.
- Each component MUST accept an optional `leadIn?: string` prop and render
  `<p class="cv-lead">{leadIn}</p>` after the `<h2>` only when the prop is present.
- MUST NOT change heading text, existing classes, the `*-heading` h2 id, or any
  content.
- MUST preserve each component's existing empty-state guard where one exists
  (Publications, VoluntaryLeadership, Interests render conditionally).
</requirements>

## Subtasks
- [x] 3.1 Education: add `id="education"` + `leadIn`.
- [x] 3.2 Certifications: add `id="certifications"` + `leadIn`.
- [x] 3.3 Publications: add `id="publications"` + `leadIn` (inside its guard).
- [x] 3.4 VoluntaryLeadership: add `id="voluntary"` + `leadIn` (inside its guard).
- [x] 3.5 PersonalDetails: add `id="personal"` + `leadIn`.
- [x] 3.6 Interests: add `id="interests"` + `leadIn` (inside its guard).
- [x] 3.7 Links: add `id="links"` + `leadIn` (note Links also has bottom padding;
  leave layout classes untouched).

## Implementation Details
Identical pattern to task 02 on the lower-band components. Add the section `id`
and the `.cv-lead` paragraph after each `<h2>`. The `leadIn` value arrives from
`cv.astro` in task 04. See the TechSpec "Component Overview" and ADR-004 for the
pattern; the slug-to-component mapping is in the TechSpec Impact Analysis table.

### Relevant Files
- `src/components/Education.astro` — `id="education"`, leadIn.
- `src/components/Certifications.astro` — `id="certifications"`, leadIn.
- `src/components/Publications.astro` — `id="publications"`, leadIn (guarded).
- `src/components/VoluntaryLeadership.astro` — `id="voluntary"`, leadIn (guarded).
- `src/components/PersonalDetails.astro` — `id="personal"`, leadIn.
- `src/components/Interests.astro` — `id="interests"`, leadIn (guarded).
- `src/components/Links.astro` — `id="links"`, leadIn (keep `pb-*` layout class).

### Dependent Files
- `src/pages/cv.astro` — passes `leadIn` props (task 04).
- `src/components/CvNav.astro` — links target these `id`s (task 06).
- `src/data/cv.ts` / `src/styles/global.css` — supply `sectionLeadIns` / `.cv-lead`.

### Related ADRs
- [ADR-004: Per-section lead-ins from a central sectionLeadIns map](../adrs/adr-004.md) — prop + section-id pattern.
- [ADR-002: Right-margin sticky rail nav](../adrs/adr-002.md) — anchors consumed by the nav.

## Deliverables
- Seven lower-band components each with a section `id` and optional `leadIn`.
- Unit tests with 80%+ coverage of the anchor + lead-in markup **(REQUIRED)**.
- Integration test that the built `/cv` HTML exposes the seven anchor ids
  **(REQUIRED)**.

## Tests
- Unit tests:
  - [x] Each component contains `id="<slug>"` on its `<section>` with the correct
    slug.
  - [x] Each renders `<p class="cv-lead">` only when a `leadIn` prop is passed.
  - [x] The `<h2>` `*-heading` id and existing classes are unchanged; Links keeps
    its bottom-padding class.
  - [x] Guarded components keep their empty-state guard.
- Integration tests:
  - [x] Built `/cv` HTML contains anchor ids `education`, `certifications`,
    `publications`, `voluntary`, `personal`, `interests`, `links`.
  - [x] `lint`/`check`/`build` stay green.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- The seven lower-band sections are anchor-addressable by slug and render a
  lead-in when given one, with no other visual change.
