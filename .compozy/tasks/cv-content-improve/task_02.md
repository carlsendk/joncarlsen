---
status: completed
title: 'Add theme/skill tags and the Interest model to `cv.ts`'
type: frontend
complexity: medium
dependencies: []
---

# Task 2: Add theme/skill tags and the Interest model to `cv.ts`

## Overview
Make the typed CV spine part of the tagged source: add optional `themes`/`skills`
to roles and `themes` to highlights, introduce an `Interest` type and an
`interests` field, then populate tags for all current content and author the
interests data (ADR-001, ADR-003). This is the data-model groundwork that the
Interests section (task_03) and deepened copy (task_06) build on.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST add optional `themes?: string[]` and `skills?: string[]` to the `Role` interface and optional `themes?: string[]` to the `Highlight` interface in `src/data/cv.ts`.
- MUST add an `Interest` interface (at minimum `label: string` plus optional `themes?: string[]`) and an `interests: Interest[]` field on `CvData`.
- MUST populate `themes` (and `skills` where relevant) for every existing role and highlight using free-form tags consistent with the recommended vocabulary (ADR-004).
- MUST author the `interests` content from the owner's material (golf and Trackman, soccer, NFL and flag football, home automation and hobby coding, running, coaching and mentoring, family and outdoors), each entry growable and tagged.
- MUST keep `PersonalDetails` free of any contact field (ADR-002) and introduce no em dashes or AI-tell phrasing in any authored label.
</requirements>

## Subtasks
- [x] 2.1 Extend the `Role` and `Highlight` interfaces with optional tag fields.
- [x] 2.2 Add the `Interest` interface and the `interests` field to `CvData`.
- [x] 2.3 Tag every existing role and highlight with themes (and skills on roles).
- [x] 2.4 Author the interests entries with optional tags, in the owner's voice.
- [x] 2.5 Add a comment documenting the recommended theme vocabulary near the tag fields.

## Implementation Details
Modify `src/data/cv.ts` only (types plus the `cvData` object). Reference the
TechSpec "Core Interfaces" (new and extended types) and "Data Models". Tags are
optional and not rendered in the MVP UI; they are metadata for selection. The
interests data is consumed by the new section in task_03.

### Relevant Files
- `src/data/cv.ts` — the single typed CV source; types and content both live here.

### Dependent Files
- `src/components/Interests.astro` (task_03) — consumes `cvData.interests` and the `Interest` type.
- `src/pages/cv.astro` (task_03) — renders the Interests section.

### Related ADRs
- [ADR-001: Structured, tagged content source](adrs/adr-001.md) — every item carries selection metadata.
- [ADR-003: Hybrid content model](adrs/adr-003.md) — tags on the `cv.ts` spine; interests on `/cv`.
- [ADR-004: Free-form theme and skill tags](adrs/adr-004.md) — string tags, no enum.

## Deliverables
- Extended `Role`/`Highlight` types with optional tags.
- New `Interest` type and `interests` field, fully populated.
- Tags populated for every existing role and highlight.
- Type-check verification evidence **(REQUIRED)**.

## Tests
- Unit tests (type verification):
  - [ ] `npx astro check` reports 0 errors and 0 warnings with the new types in use.
  - [ ] Every `cvData.roles[]` entry has a non-empty `themes` array; every `impact[]` entry has `themes`.
  - [ ] `cvData.interests` contains the owner's interests, each with a `label`.
- Integration tests:
  - [ ] `npx astro build` exits 0 (the existing `/cv` and `/` still build with the extended model).
  - [ ] Em-dash grep over `src/data/cv.ts` returns zero hits.
  - [ ] Contact-leak grep over `src/data/cv.ts` returns zero hits.
- Test coverage target: >=80% (all new fields populated and consumed by the build)
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- `cv.ts` exposes tagged roles/highlights and a populated `interests` field.
- The site still type-checks and builds; no contact details; no em dashes.
