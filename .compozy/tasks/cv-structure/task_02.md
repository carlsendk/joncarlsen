---
status: completed
title: Section anchors and lead-ins, batch 1 (Summary, Credentials, Impact, Expertise, Timeline, CaseStudies, Approach)
type: frontend
complexity: medium
dependencies:
  - task_01
---

# Task 2: Section anchors and lead-ins, batch 1 (Summary, Credentials, Impact, Expertise, Timeline, CaseStudies, Approach)

## Overview
Give the seven top-of-page sections their anchor target and optional lead-in line,
so the in-page nav can link to them and readers get a one-line orientation under
each heading. This is a uniform, low-risk edit repeated across seven components;
it adds an `id` to each `<section>` and renders the `leadIn` prop when present.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- For each of the seven components, MUST add `id="<slug>"` to the existing
  `<section ... class="reveal cv-section">` element using the section's slug
  (`summary`, `credentials`, `impact`, `expertise`, `experience`, `work`,
  `approach`) so it becomes an anchor target. Keep the existing
  `aria-labelledby` and classes unchanged.
- Each component MUST accept an optional `leadIn?: string` prop and, when present,
  render it as `<p class="cv-lead">{leadIn}</p>` immediately after the `<h2>`.
- When `leadIn` is absent, the component MUST render no lead-in element (no empty
  `<p>`).
- MUST NOT change heading text, existing classes, the `*-heading` id on the
  `<h2>`, or any content; this is additive markup only.
- MUST preserve each component's existing empty-state guard (e.g. Credentials,
  Approach render conditionally) — the `id`/lead-in live inside the guarded
  `<section>`.
- For `Timeline.astro`, ONLY add the `id` + `leadIn` here; the long-tail collapse
  is task 05 (do not touch role rendering).
</requirements>

## Subtasks
- [x] 2.1 Summary: add `id="summary"` + `leadIn` rendering.
- [x] 2.2 Credentials: add `id="credentials"` + `leadIn` (inside the existing
  `shown.length > 0` guard).
- [x] 2.3 Impact: add `id="impact"` + `leadIn`.
- [x] 2.4 Expertise: add `id="expertise"` + `leadIn`.
- [x] 2.5 Timeline: add `id="experience"` + `leadIn` only (no collapse work).
- [x] 2.6 CaseStudies: add `id="work"` + `leadIn`.
- [x] 2.7 Approach: add `id="approach"` + `leadIn` (inside its existing guard).

## Implementation Details
All seven components share the same markup shape — `<section
aria-labelledby="<x>-heading" class="reveal cv-section">` with `<h2
id="<x>-heading" class="cv-eyebrow">` (id on the h2 today). Add the section `id`
on the `<section>` and the `.cv-lead` paragraph after the `<h2>`. The `leadIn`
value is supplied by `cv.astro` in task 04; this task only makes the components
able to accept and render it. See the TechSpec "Component Overview" and ADR-004 for
the prop/anchor pattern. The slug-to-component mapping is in the TechSpec Impact
Analysis table.

### Relevant Files
- `src/components/Summary.astro` — `id="summary"`, leadIn.
- `src/components/Credentials.astro` — `id="credentials"`, leadIn (guarded).
- `src/components/Impact.astro` — `id="impact"`, leadIn.
- `src/components/Expertise.astro` — `id="expertise"`, leadIn.
- `src/components/Timeline.astro` — `id="experience"`, leadIn only.
- `src/components/CaseStudies.astro` — `id="work"`, leadIn.
- `src/components/Approach.astro` — `id="approach"`, leadIn (guarded).

### Dependent Files
- `src/pages/cv.astro` — passes `leadIn` props and relies on the anchors (task 04).
- `src/components/CvNav.astro` — links target these `id`s (task 06).
- `src/data/cv.ts` — supplies `sectionLeadIns` and `.cv-lead` (task 01).

### Related ADRs
- [ADR-004: Per-section lead-ins from a central sectionLeadIns map](../adrs/adr-004.md) — prop + section-id pattern.
- [ADR-002: Right-margin sticky rail nav](../adrs/adr-002.md) — anchors consumed by the nav.

## Deliverables
- Seven components each with a section `id` and optional `leadIn` rendering.
- Unit tests with 80%+ coverage of the anchor + lead-in markup **(REQUIRED)**.
- Integration test that the built `/cv` HTML exposes the seven anchor ids
  **(REQUIRED)**.

## Tests
- Unit tests:
  - [x] Each of the seven components contains `id="<slug>"` on its `<section>`
    with the correct slug.
  - [x] Each component renders `<p class="cv-lead">` when a `leadIn` prop is passed
    and renders none when it is omitted.
  - [x] The `<h2>` `*-heading` id and existing classes are unchanged (regression
    guard via text match).
  - [x] Guarded components (Credentials, Approach) keep their empty-state guard.
- Integration tests:
  - [x] Built `/cv` HTML contains anchor ids `summary`, `credentials`, `impact`,
    `expertise`, `experience`, `work`, `approach`.
  - [x] `lint`/`check`/`build` stay green.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- The seven sections are anchor-addressable by slug and render a lead-in when
  given one, with no other visual change.
