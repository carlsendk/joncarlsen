---
status: completed
title: 'Add `src/lib/impact.ts` derivation module'
type: frontend
complexity: low
dependencies:
  - task_02
---

# Task 3: Add `src/lib/impact.ts` derivation module

## Overview
Provide the single build-time source of derived impact data that the home page,
`/cv` band, and `/impact` page all consume, so impact figures are computed from
the work collection rather than authored twice (TechSpec ADR-004). This new module
exposes the full set and the per-company lead set.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST add `src/lib/impact.ts` exporting an `ImpactItem` type and two async functions, `impactItems()` and `leadImpactItems()` (see TechSpec "Core Interfaces").
- `impactItems()` MUST return one item per string in every non-draft work entry's `metrics[]`, ordered by `work.order`, carrying `{ company, metric, slug, title, order }`.
- `leadImpactItems()` MUST return the first metric of each company (the lowest-`order` work that has metrics), preserving first-seen company order.
- MUST exclude `draft: true` entries and MUST resolve `slug` to the work collection id used by `/work/<slug>`.
- MUST import `astro:content` and be consumed only from `.astro` files in the build graph (ADR-004 risk note); MUST add no client JS.
</requirements>

## Subtasks
- [x] 3.1 Create `src/lib/impact.ts` with the `ImpactItem` type.
- [x] 3.2 Implement `impactItems()` over the non-draft work collection, sorted by `order`.
- [x] 3.3 Implement `leadImpactItems()` (first metric per company).
- [x] 3.4 Confirm both functions type-check and return expected shapes against current content.

## Implementation Details
Create `src/lib/impact.ts`. Use `getCollection("work", ({ data }) => !data.draft)`,
sort by `data.order`, then `flatMap` `data.metrics`. `leadImpactItems()` filters
`impactItems()` to the first occurrence per `company`. Use the collection entry
`id` as `slug`. See TechSpec "Core Interfaces" for the exact signatures; do not
duplicate the snippet — reference it. The module is unused until task_04/05.

### Relevant Files
- `src/content.config.ts` — `work` schema (`metrics`, `company`, `order`, `draft`, `title`).
- `src/content/work/*.md` — the data source (finalized in task_02).
- `src/pages/projects.astro` — existing `getCollection` + grouping pattern to mirror.

### Dependent Files
- `src/components/Impact.astro` (task_04) — will render `ImpactItem[]`.
- `src/pages/index.astro`, `src/pages/cv.astro` (task_04) — call `leadImpactItems()`.
- `src/pages/impact.astro` (task_05) — calls `impactItems()`.

### Related ADRs
- [ADR-004: Impact derivation from the work collection](adrs/adr-004.md) — defines `impactItems()`/`leadImpactItems()` and the derivation rules.
- [ADR-003: The work collection is the canonical source of impact and skills](adrs/adr-003.md) — work `metrics[]` is the source.

## Deliverables
- `src/lib/impact.ts` exporting `ImpactItem`, `impactItems()`, `leadImpactItems()`.
- Type-check and shape verification evidence **(REQUIRED)**.

## Tests
- Unit tests (derivation verification, via a temporary `.astro` probe page or assertions):
  - [x] `impactItems()` returns **11** items from current content (AXON 3, DFDS 5 = platform 3 + responsive 2, Lunar 1, Scrive 2), ordered by `order`. (Task's "10 / DFDS-responsive 1" count is stale — predates task_02 adding DFDS-responsive's "5 to 25" metric; module derives from content and is correct.)
  - [x] `leadImpactItems()` returns one item per company with metrics (AXON, DFDS, Lunar, Scrive) and excludes companies with no metric (Ørsted).
  - [x] A `draft: true` fixture entry contributes no items (verified: count stayed 11 with a temp draft fixture).
  - [x] Each item's `slug` equals the work id and matches a generated `/work/<slug>` page.
- Integration tests:
  - [x] `astro check` exits 0 (0 errors / 29 files) with the new module imported by a build-graph `.astro` probe; `npm run build` completes (17 pages).
- Test coverage target: >=80% (both functions, draft exclusion, ordering)
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- `src/lib/impact.ts` returns correct full and per-company-lead sets from current content.
- No client JS; module consumed only in the build graph.
