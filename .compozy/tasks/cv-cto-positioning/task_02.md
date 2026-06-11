---
status: completed
title: Apply the isReady render guard to Timeline and Impact
type: frontend
complexity: low
dependencies:
  - task_01
---

# Task 2: Apply the isReady render guard to Timeline and Impact

## Overview
Make the existing array-rendering sections drop any draft `[TODO]` item so staged
figures never reach the live site (ADR-003). This wires the guard from task_01
into the components that render lists of authored strings.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST filter role `bullets` in `src/components/Timeline.astro` through `isReady`, so a bullet containing the sentinel does not render.
- MUST filter `impact` highlights in `src/components/Impact.astro` through `isReady`, dropping any highlight whose metric or summary contains the sentinel.
- MUST preserve all existing rendering behaviour for ready items (order, markup, variants).
- MUST NOT alter the call sites; the components keep the same props.
- MUST introduce no client JS and no contact details.
</requirements>

## Subtasks
- [x] 2.1 Filter `bullets` through `isReady` in Timeline (both variants).
- [x] 2.2 Filter highlights through `isReady` in Impact.
- [x] 2.3 Confirm ready items render unchanged and TODO items are absent.

## Implementation Details
Modify `src/components/Timeline.astro` and `src/components/Impact.astro`. Import
`isReady` from `src/data/cv.ts` (task_01). See the TechSpec "System Architecture"
(array-rendering components) and ADR-003.

### Relevant Files
- `src/components/Timeline.astro` — renders role `bullets`.
- `src/components/Impact.astro` — renders `impact` highlights.
- `src/data/cv.ts` — provides `isReady` (task_01).

### Dependent Files
- `src/pages/cv.astro`, `src/pages/index.astro` — render these components (no edit needed).

### Related ADRs
- [ADR-003: Draft-gated placeholders via a sentinel and a render guard](adrs/adr-003.md) — guard applied here.

## Deliverables
- Timeline and Impact filter array items through `isReady`.
- Render verification evidence **(REQUIRED)**.

## Tests
- Unit tests (render verification):
  - [ ] A role with a `[TODO]` bullet renders its other bullets but not the TODO one.
  - [ ] An `impact` highlight containing the sentinel does not appear in the output.
  - [ ] Ready bullets and highlights render unchanged (count and order preserved).
- Integration tests:
  - [ ] `npx astro check` and `npx astro build` exit 0.
  - [ ] With a temporary `[TODO]` bullet in `cv.ts`, the built `/cv` HTML contains no `[TODO`.
- Test coverage target: >=80% (ready and not-ready items both exercised)
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Draft `[TODO]` items never render in Timeline or Impact; ready items unchanged.
- Build green; no client JS; no contact details.
