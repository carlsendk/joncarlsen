---
status: completed
title: 'Migrate former `cvData.impact` figures onto work `metrics[]`'
type: frontend
complexity: low
dependencies: []
---

# Task 2: Migrate former `cvData.impact` figures onto work `metrics[]`

## Overview
Make the `work` collection the authoritative home for every impact figure before
the curated `cvData.impact` list is removed (task_04), so no number is lost.
This is a content-only migration: each of the five existing highlights must exist
as a string in the matching work entry's `metrics[]` (TechSpec ADR-003, ADR-002).

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST map each of the five `cvData.impact` figures (e.g. "50,000/s", "3 → 20") to the work entry whose company/topic it describes, and ensure an equivalent string exists in that entry's `metrics[]`.
- MUST add the figure to the correct `src/content/work/<id>.md` frontmatter only where it is not already present (most already exist, e.g. "50,000 datapoints/s", "3 to 20 person department").
- MUST keep each metric phrased as a self-contained, business-outcome figure (1–3 per entry) per the content guideline in ADR-002.
- MUST NOT yet remove `cvData.impact` (that happens in task_04); this task only guarantees the work entries hold every figure.
- MUST produce a before/after mapping showing each former highlight resolved to a work entry's `metrics[]`.
</requirements>

## Subtasks
- [x] 2.1 List the five current `cvData.impact` figures and their intended company/work.
- [x] 2.2 Diff each against the target work entry's existing `metrics[]`.
- [x] 2.3 Add any missing figure to the correct work entry's frontmatter.
- [x] 2.4 Record the before/after mapping as migration evidence.
- [x] 2.5 Verify the build still succeeds with metrics present.

## Migration Evidence (before/after)

`cvData.impact` holds 7 entries (6 real figures + 1 `[TODO]` draft), not the "five"
the Overview loosely states. All 6 real figures resolved (5 already present, 1 added):

| `cvData.impact` metric | Company | Work entry | Before | After |
|---|---|---|---|---|
| `50,000/s` | AXON | `axon-ai-platform.md` | present | unchanged — `"50,000 datapoints/s per device"` |
| `3 → 20` | DFDS Dev & Platform | `dfds-platform.md` | present | unchanged — `"3 to 20 person department"` |
| `5 → 25` | DFDS Customer Experience | `dfds-responsive-web-platform.md` | **missing** | **added** — `"5 to 25 person Customer Experience department"` |
| `500+` | DFDS microservices | `dfds-platform.md` | present | unchanged — `"500+ microservices on Kubernetes"` |
| `~200` | DFDS engineers | `dfds-platform.md` | present | unchanged — `"~200 engineers cloud-native"` |
| `ISO 27001` | Scrive | `scrive-kubernetes-iso27001.md` | present | unchanged — `"ISO 27001 and ISAE 3000 certified"` |
| `[TODO: budget owned]` | — | — | draft sentinel | **not migrated** — not a real figure; work pills have no `isReady` guard; task_04 drops it with the list |

Resolved: 6/6 real figures. No work entry exceeds 3 metrics
(`dfds-responsive-web-platform.md`: 1 → 2). `cvData.impact` left intact (task_04 owns removal).

Build verification: `npm run build` exit 0 (17 pages); `npx astro check` 0 errors;
the new pill renders 1× in `dist/work/dfds-responsive-web-platform/index.html`.

## Implementation Details
Edit frontmatter under `src/content/work/*.md` only. Read `cvData.impact` in
`src/data/cv.ts` for the source figures; do not edit `cv.ts` in this task.
Target entries by `company`: AXON → `axon-ai-platform.md`, DFDS →
`dfds-platform.md`, Scrive → `scrive-kubernetes-iso27001.md`, etc. The `work`
schema already permits `metrics[]` (no schema change). See TechSpec "Data Models"
and ADR-003 "Implementation Notes".

### Relevant Files
- `src/data/cv.ts` — read-only source of the five `impact` figures.
- `src/content/work/*.md` — frontmatter `metrics[]` to verify/augment.
- `src/content.config.ts` — confirms `metrics[]` schema (no change).

### Dependent Files
- `src/lib/impact.ts` (task_03) — will read these `metrics[]` as the impact source.
- `src/data/cv.ts` (task_04) — `cvData.impact` removed only after this migration.

### Related ADRs
- [ADR-003: The work collection is the canonical source of impact and skills](adrs/adr-003.md) — work entries own every figure.
- [ADR-002: The Impact page is auto-aggregated from work](adrs/adr-002.md) — retire the curated list; 1–3 strong metrics per entry.

## Deliverables
- Every former `cvData.impact` figure present in the correct work entry's `metrics[]`.
- A written before/after mapping (5 figures → work entries) **(REQUIRED)**.
- Build verification evidence **(REQUIRED)**.

## Tests
- Unit tests (content verification):
  - [ ] Each of the five `cvData.impact` figures has a semantically equivalent string in exactly one work entry's `metrics[]` (mapping table asserts 5/5 resolved).
  - [ ] No work entry exceeds three metrics after migration (content guideline).
  - [ ] Figures previously only in `cvData.impact` (if any, e.g. an Ørsted figure) are added to the matching entry, not dropped.
- Integration tests:
  - [ ] `npm run check && npm run build` exits 0 with the updated frontmatter.
  - [ ] Each augmented `/work/<slug>` page renders the new metric pill in its header.
- Test coverage target: >=80% (all five figures traced)
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- All five former highlights live on work entries; before/after mapping shows 5/5 resolved.
- `cvData.impact` still present (removal deferred to task_04); build green.
