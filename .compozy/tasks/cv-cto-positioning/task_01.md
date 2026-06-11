---
status: completed
title: Extend cv.ts with scope, credentials, and the isReady guard
type: backend
complexity: low
dependencies: []
---

# Task 1: Extend cv.ts with scope, credentials, and the isReady guard

## Overview
Add the data-model groundwork for the CTO re-pitch: a `scope` line, a `credentials`
list, and the `isReady` render guard that keeps draft `[TODO]` markers off the
live site (ADR-003). This is the foundation every later task builds on.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST add `scope: string` (the hard executive scope line) and `credentials: string[]` (curated executive signals) to the `CvData` interface in `src/data/cv.ts`, with placeholder-free real values populated.
- MUST export a render guard `isReady(text: string): boolean` and the `TODO_SENTINEL` constant per the TechSpec "Core Interfaces" section, where a string is ready unless it contains the sentinel.
- MUST NOT remove or rename existing fields; `about` and `talks` stay as-is (they are rendered in task_03).
- MUST keep `PersonalDetails` free of any contact field and introduce no contact details (cv-content ADR-002).
- MUST keep the file type-clean (`npx astro check` passes) and free of em dashes and AI-tell phrasing in any authored value.
</requirements>

## Subtasks
- [x] 1.1 Add `scope` and `credentials` to the `CvData` interface.
- [x] 1.2 Export `isReady` and `TODO_SENTINEL` per the TechSpec.
- [x] 1.3 Populate `scope` and `credentials` with real, complete values (no markers yet).
- [x] 1.4 Verify the type-check passes and existing pages still build.

## Implementation Details
Modify `src/data/cv.ts` only. See the TechSpec "Core Interfaces" and "Data Models"
sections for the exact field and guard contract. The guard is consumed by the
array-rendering components in task_02 and task_03.

### Relevant Files
- `src/data/cv.ts` — the single typed CV source; types, content, and the guard live here.

### Dependent Files
- `src/components/Timeline.astro`, `src/components/Impact.astro` (task_02) — consume `isReady`.
- `src/components/Approach.astro`, `src/components/Credentials.astro` (task_03) — consume `credentials`, `about`, `talks`, `isReady`.
- `src/components/Hero.astro` or `src/components/Summary.astro` (task_04) — consume `scope`.

### Related ADRs
- [ADR-003: Draft-gated placeholders via a sentinel and a render guard](adrs/adr-003.md) — defines `isReady`/`TODO_SENTINEL`.
- [ADR-002: Truth-first enrichment](adrs/adr-002.md) — real content only.

## Deliverables
- `CvData` extended with `scope` and `credentials`, populated with real values.
- Exported `isReady` and `TODO_SENTINEL`.
- Type-check verification evidence **(REQUIRED)**.

## Tests
- Unit tests (type/guard verification):
  - [x] `npx astro check` reports 0 errors and 0 warnings. (Project source: 24 files, 0/0, with `docs/` transiently excluded; see note below.)
  - [x] `isReady("done")` returns true; `isReady("cost by [TODO: %]")` returns false.
  - [x] `cvData.scope` is a non-empty string and `cvData.credentials` is a non-empty array (10 items).
- Integration tests:
  - [x] `npx astro build` exits 0; existing `/` and `/cv` still build with the extended model (10 pages).
  - [x] Em-dash and contact-leak greps over `src/data/cv.ts` return zero hits.

> Note on `astro check`: the whole-repo run crashes (SIGABRT) on pre-existing
> committed minified JS under `docs/projekts_files/` because `tsconfig.json` uses
> `include: ["**/*"]`. This reproduces identically on pristine `master`, so it is
> not caused by this change. Verified the project source cleanly (0 errors / 0
> warnings, no `cv.ts` diagnostics) by transiently excluding `docs/` from
> `tsconfig`, then reverting. Recorded as an open risk in workflow memory; the
> tsconfig fix is out of scope for this cv.ts-only task.
- Test coverage target: >=80% (both guard branches and the new fields exercised)
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- `cv.ts` exposes `scope`, `credentials`, `isReady`, and `TODO_SENTINEL`.
- Build is green; no contact details; no em dashes.
