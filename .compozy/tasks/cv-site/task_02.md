---
status: completed
title: Define CvData content model and seed cv.ts
type: frontend
complexity: low
dependencies:
  - task_01
---

# Task 2: Define CvData content model and seed cv.ts

## Overview
Define the single typed content model that is the site's only data source and
seed it with placeholder content. Every component renders a slice of this type,
so a correct, well-typed `cv.ts` is what lets the owner update the site by
editing one file.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST define the `CvData`, `Role`, `Highlight`, and `ProfileLink` types exactly as specified in the TechSpec "Core Interfaces" section.
- MUST export a single content object typed as `CvData` from `src/data/cv.ts`.
- MUST treat `resumePdf` as optional so omitting it hides the download.
- MUST seed placeholder content for every field (name, title, value prop, roles, impact highlights, links) sufficient to render and build; real values are owner-provided later.
- MUST NOT include any email address, phone number, or other direct contact detail in the content (per ADR-002).
</requirements>

## Subtasks
- [x] 2.1 Declare the content interfaces in `src/data/cv.ts`.
- [x] 2.2 Export one `CvData`-typed content object.
- [x] 2.3 Seed placeholder values for all required fields (≥2 roles, ≥2 impact highlights, GitHub + LinkedIn links).
- [x] 2.4 Mark where the owner must replace placeholders with real content.
- [x] 2.5 Confirm `astro check` type-validates the content object.

## Implementation Details
Add `src/data/cv.ts` only. Use the type definitions from the TechSpec "Core
Interfaces"/"Data Models" sections (do not redefine them differently here). The
file has no presentation logic — it is pure data plus type declarations.

### Relevant Files
- `src/data/cv.ts` — the content model and the exported content object (created here).

### Dependent Files
- `src/components/Hero.astro` — consumes `name`, `title`, `valueProp` (task 03).
- `src/components/Timeline.astro` — consumes `roles[]` (task 03).
- `src/components/Impact.astro` — consumes `impact[]` (task 03).
- `src/components/Links.astro` — consumes `links[]` and `resumePdf` (task 03).
- `src/pages/index.astro` — imports the content object (task 03).

### Related ADRs
- [ADR-003: Astro with a single content-data file](../adrs/adr-003.md) — mandates the typed `cv.ts` model.
- [ADR-002: No contact details](../adrs/adr-002.md) — content must not embed contact info.

### Implementation Notes (as-built)
- Interfaces match the TechSpec "Core Interfaces" exactly; the content object is seeded with clearly-marked `TODO(owner)` placeholders (2 roles, 2 impact highlights, GitHub + LinkedIn). `resumePdf` is omitted until a real `public/resume.pdf` exists.
- **Scaffold correction (carried from task_01):** task_01 pinned `typescript@^6`, which violates `@astrojs/check`'s `peer typescript@"^5"` — `npm ci` failed (lockfile not reproducible). Re-pinned `typescript@^5` and regenerated `package-lock.json`; `npm ci` now exits 0. The corrected `package.json` + `package-lock.json` are re-delivered with this task. `astro check`/`astro build` remain green.

## Deliverables
- `src/data/cv.ts` exporting a `CvData`-typed object with placeholder content.
- All four content interfaces defined and exported.
- Type-check verification **(REQUIRED)** — `astro check` passes against the content object.
- A negative type test demonstrating the contract **(REQUIRED)**.

## Tests
- Unit tests (type-contract gates):
  - [x] The seeded content object type-checks: `astro check` exits 0.
  - [x] Removing a required field (e.g. `name`) from the object causes `astro check` to fail — verified: `ts(2741) Property 'name' is missing ... in type 'CvData'`.
  - [x] An object omitting optional `resumePdf` type-checks successfully (the seed omits it; check passes).
  - [x] `roles`, `impact`, and `links` each accept an array of their declared shape and reject a mismatched shape — verified: dropping `company` from a Role fails with `ts(2741) Property 'company' is missing ... in type 'Role'`.
  - [x] No `mailto:`/`tel:` string or raw email/phone appears in the content (grep assertion for ADR-002).
- Integration tests:
  - [x] The content object can be imported and all fields accessed with no type errors (verified via a temporary type-probe importing `cvData` and touching every field; probe removed after).
- Test coverage target: >=80% (every field of the model is exercised by the type-contract checks above).
- All tests must pass.

## Success Criteria
- All tests passing
- Test coverage >=80% (all model fields exercised by type checks)
- `src/data/cv.ts` exports a valid `CvData` object that the build consumes.
- No contact details present in the content.
- Placeholder markers clearly indicate where the owner supplies real values.
