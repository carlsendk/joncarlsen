---
status: completed
title: Add condensed and full experience rendering to Timeline.astro
type: frontend
complexity: medium
dependencies:
  - task_01
---

# Task 3: Add condensed and full experience rendering to Timeline.astro

## Overview
Teach the existing experience component to render the single `roles` array two
ways from the same data: a condensed one-line-per-role view for the frontpage,
and a full view with achievement bullets for `/cv`. This avoids forking the data
(TechSpec "Single roles array, two renderings").

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST add a `variant: "condensed" | "full"` prop (and an optional `limit`) to `Timeline.astro`.
- The `condensed` variant MUST render company, title, dates, and the one-line scope only, honouring `limit` (top-N).
- The `full` variant MUST additionally render each role's achievement `bullets`.
- MUST read from the single `cvData.roles` array; MUST NOT introduce a second data array.
- MUST preserve the existing semantic structure and the `experience-heading` id and design-token styling already in the component.
</requirements>

## Subtasks
- [x] 3.1 Add the `variant` and optional `limit` props with a sensible default.
- [x] 3.2 Render the condensed view (scope line, top-N) when `variant="condensed"`.
- [x] 3.3 Render the full view with bullets when `variant="full"`.
- [x] 3.4 Keep heading id, list semantics, and token styling intact.

## Implementation Details
Modify `src/components/Timeline.astro`. Consume `Role.bullets` added in task_01.
Follow the existing markup/token patterns in the component; reference the TechSpec
"Single roles array, two renderings" rather than duplicating it. The frontpage
(task_06) will pass `variant="condensed"` with a `limit`; `/cv` (task_05) will pass
`variant="full"`.

### Relevant Files
- `src/components/Timeline.astro` — the component to extend.
- `src/data/cv.ts` — provides `roles` with `bullets` (task_01).

### Dependent Files
- `src/pages/cv.astro` — renders `variant="full"` (task_05).
- `src/pages/index.astro` — renders `variant="condensed"` with `limit` (task_06).

### Related ADRs
- [ADR-001: Hub-and-spoke information architecture](../adrs/adr-001.md) — condensed frontpage vs full CV.

## Deliverables
- `Timeline.astro` supporting `condensed` and `full` variants from one array.
- The condensed/full DOM differences verifiable in built HTML **(REQUIRED)**.

## Tests
- Unit tests:
  - [ ] `condensed` with `limit=N` renders exactly N roles and no bullet lists.
  - [ ] `full` renders all roles and each role's bullets as list items.
  - [ ] The `experience-heading` id is present in both variants.
  - [ ] No second roles array exists: the component reads only `cvData.roles` (props).
- Integration tests:
  - [ ] `astro build` exits 0; rendered `/` (condensed) and `/cv` (full) differ as expected once those pages exist.
- Test coverage target: >=80% (both variants exercised).
- All tests must pass.

## Success Criteria
- All tests passing
- Test coverage >=80%
- One data array drives both a condensed and a full experience rendering.

## Implementation Notes (as-built)
- Added `variant?: "condensed" | "full"` and optional `limit?: number` props to `src/components/Timeline.astro`, defaulting `variant` to `"condensed"` so the not-yet-updated `index.astro` keeps building (it passes no variant). `/cv` will pass `variant="full"` (task_05) and the restructured frontpage `variant="condensed" limit=N` (task_06).
- Condensed renders company, title, dates, and the one-line scope, sliced to the top-N when `limit` is set. Full additionally renders each role's `bullets` as a `list-disc` `<ul>`. `limit` is condensed-only; full always shows every role.
- One `roles` array (the prop); no second data array. Preserved the `experience-heading` id, the `<ol>/<li>` semantics, and the token/type classes; bullets use `text-muted`/`leading-relaxed` (no hard-coded colors).
- Verified via temporary probe pages: condensed `limit=3` rendered exactly 3 roles and 0 bullet lists; full rendered all 8 roles with 8 bullet lists; `experience-heading` present in both. `astro check` 0/0; `astro build` exit 0; probes removed; no stray routes.
