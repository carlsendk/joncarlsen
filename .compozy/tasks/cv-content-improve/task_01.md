---
status: completed
title: 'Extend the `work` collection schema and migrate the AXON entry'
type: backend
complexity: medium
dependencies: []
---

# Task 1: Extend the `work` collection schema and migrate the AXON entry

## Overview
Turn the `work` content collection into the tagged project store: add `company`,
`featured`, `themes`, and `skills` to the Zod schema so every project carries the
metadata the public site, the `/projects` index, and later targeted variants
select on (ADR-001, ADR-003). Update the one existing entry in the same change so
the build stays green.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST add to the `work` schema in `src/content.config.ts`: `company` (string, required), `featured` (boolean, default false), `themes` (array of string, default []), `skills` (array of string, default []), preserving all existing fields and their defaults.
- MUST keep `themes` and `skills` free-form strings with NO enforced enum (ADR-004), and document the recommended starter vocabulary as a comment near the fields.
- MUST update `src/content/work/axon-ai-platform.md` frontmatter to add `company: "AXON Networks"`, `featured: true`, and real `themes`/`skills` tags, so the required `company` field does not break the build.
- MUST NOT change the `/work/[slug]` route behaviour; every non-draft entry continues to render its own page (`featured` controls surfacing only, ADR-003).
- MUST introduce no contact details (ADR-002).
</requirements>

## Subtasks
- [x] 1.1 Add the four new fields to the `work` Zod schema with correct types and defaults.
- [x] 1.2 Add a comment documenting the recommended theme vocabulary (free-form, not enforced).
- [x] 1.3 Update the AXON markdown frontmatter with `company`, `featured: true`, and tags.
- [x] 1.4 Verify the build fails when `company` is removed, then passes when restored.

## Implementation Details
Modify `src/content.config.ts` (the `work` collection's `z.object`) and
`src/content/work/axon-ai-platform.md` (frontmatter only; body is deepened in
task_06). Reference the TechSpec "Core Interfaces" (extended `work` schema) and
"Data Models" sections. Keep `company` required so the `/projects` grouping in
task_04 can rely on it.

### Relevant Files
- `src/content.config.ts` — the `work` collection schema to extend.
- `src/content/work/axon-ai-platform.md` — the only existing entry; needs the new required field.

### Dependent Files
- `src/pages/projects.astro` (task_04) — consumes `company`.
- `src/components/CaseStudies.astro` (task_05) — consumes `featured`.
- `src/content/work/*.md` (task_07) — new entries must satisfy the extended schema.

### Related ADRs
- [ADR-003: Hybrid content model](adrs/adr-003.md) — projects in the `work` collection; every project gets a page; `featured` surfaces.
- [ADR-004: Free-form theme and skill tags](adrs/adr-004.md) — string tags, no enum.

## Deliverables
- Extended `work` schema with `company`, `featured`, `themes`, `skills`.
- Migrated `axon-ai-platform.md` frontmatter (company, featured, tags).
- Recommended-vocabulary comment near the tag fields.
- Schema verification evidence **(REQUIRED)**.

## Tests
- Unit tests (type/schema verification):
  - [x] `npx astro check` reports 0 errors and 0 warnings. (Result: 0 errors, 0 warnings, 16 hints — hints are pre-existing `ts(6385) 'z' deprecated`. Run with gitignored local `docs/` relocated; tsconfig `include: ["**/*"]` otherwise crawls/crashes on it.)
  - [x] Removing `company` from `axon-ai-platform.md` makes `npx astro build` fail (`InvalidContentEntryDataError ... **company**: Required`); restoring it passes (exit 0).
  - [x] `featured`, `themes`, `skills` omitted from a fresh entry default to false/[]/[] without error. (Throwaway entry with only title/summary/role/period/company built exit 0.)
- Integration tests:
  - [x] `npx astro build` exits 0 and still emits `/work/axon-ai-platform`.
  - [x] Contact-leak grep over `src/` (`@icloud.com|+45|mailto:|tel:`) returns zero hits.
- Test coverage target: >=80% (schema fields exercised by the existing entry plus the negative check)
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- The `work` schema carries `company`/`featured`/`themes`/`skills` with correct defaults.
- The AXON entry validates and still renders; the build is green.
- No enum is enforced on tags; recommended vocabulary is documented in-file.
