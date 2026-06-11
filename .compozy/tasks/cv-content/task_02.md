---
status: completed
title: Define the work Astro content collection schema in src/content.config.ts
type: frontend
complexity: low
dependencies: []
---

# Task 2: Define the work Astro content collection schema in src/content.config.ts

## Overview
Introduce Astro content collections to the project by defining the `work`
collection and its typed frontmatter schema. This is the contract every
case-study markdown file must satisfy and the foundation for the `/work/<slug>`
deep-dive pages (ADR-001, ADR-003).

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST create `src/content.config.ts` defining a `work` collection using `defineCollection` with a Zod schema matching the fields in the TechSpec "Core Interfaces" section (`title`, `summary`, `role`, `period`, `metrics`, `order`, `draft`).
- MUST place case-study markdown under `src/content/work/`, with the page slug deriving from the filename.
- Invalid frontmatter MUST fail the build (schema enforced), not pass silently.
- MUST NOT require any new runtime dependency (Astro content collections are built in).
- This task creates the schema only; it does not create the route or seed real content (those are task_07).
</requirements>

## Subtasks
- [x] 2.1 Create `src/content.config.ts` with the `work` collection and Zod schema.
- [x] 2.2 Create the `src/content/work/` directory the collection reads from.
- [x] 2.3 Verify a minimal valid sample builds and an invalid one fails the schema, then remove the sample.

## Implementation Details
Create `src/content.config.ts` exactly as outlined in the TechSpec
"Core Interfaces" (the `work` Zod schema). No other files change in this task.
Astro discovers `src/content.config.ts` and `src/content/<collection>/`
automatically; `getCollection('work')` becomes available to pages in task_07.

### Relevant Files
- `src/content.config.ts` — new collection config (to create).
- `src/content/work/` — new content directory (to create).

### Dependent Files
- `src/pages/work/[slug].astro` — will consume the collection (task_07).
- `src/pages/cv.astro`, `src/pages/index.astro` — will list collection entries (task_07).

### Related ADRs
- [ADR-001: Hub-and-spoke information architecture](../adrs/adr-001.md) — case studies as first-class pages.
- [ADR-003: Content layer](../adrs/adr-003.md) — markdown collection for deep-dives alongside the typed data file.

## Deliverables
- `src/content.config.ts` with the `work` collection Zod schema.
- The `src/content/work/` directory present.
- A demonstration that invalid frontmatter fails the build **(REQUIRED)**.

## Tests
- Unit tests:
  - [ ] `astro check` exits 0 with the new collection config present.
  - [ ] A sample file missing a required field (e.g. `title`) causes `astro build` to fail with a schema error.
  - [ ] A sample file with valid frontmatter builds without error.
- Integration tests:
  - [ ] `getCollection('work')` resolves at build time (exercised once task_07 adds the route; here, verify via the valid sample then remove it).
- Test coverage target: >=80% (schema fields exercised by the valid/invalid samples).
- All tests must pass.

## Success Criteria
- All tests passing
- Test coverage >=80%
- The `work` collection schema exists and enforces frontmatter at build time.

## Implementation Notes (as-built)
- Created `src/content.config.ts` defining the `work` collection. Used the Astro 6 Content Layer `loader: glob({ pattern: "**/*.md", base: "./src/content/work" })` instead of the techspec's legacy `type: "content"` (same schema fields; `loader` is the current, non-deprecated API). Entry id/slug derives from the filename.
- Zod schema: `title`, `summary`, `role`, `period` (required strings), `metrics` (string[] default []), `order` (number default 0), `draft` (boolean default false).
- Created `src/content/work/` with a `.gitkeep` (git does not track empty dirs); task_07 adds the first real case study and the route.
- Verified: `astro check` 0/0; a valid sample built clean; an invalid sample (missing `title`) failed the build with `InvalidContentEntryDataError ... title: Required`; samples removed. Final `astro build` exits 0 with one benign `[glob-loader] No files found` warning (empty collection until task_07).
