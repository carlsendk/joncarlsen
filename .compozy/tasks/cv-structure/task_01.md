---
status: completed
title: Add sectionLeadIns, navGroups, CollapseConfig to cv.ts and the .cv-lead base style to global.css
type: frontend
complexity: medium
dependencies: []
---

# Task 1: Add sectionLeadIns, navGroups, CollapseConfig to cv.ts and the .cv-lead base style to global.css

## Overview
Introduce the build-time data the restructure depends on — the per-section
lead-in copy, the curated nav groups, and the long-tail collapse tuning — in the
single content source, plus the shared `.cv-lead` style. This task ships data and
one CSS rule only; it changes no rendered output yet, so the page is unchanged
until later tasks consume these.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST add the `SectionSlug`, `SectionLeadIns`, `NavGroup`, and `CollapseConfig`
  shapes and their values to `src/data/cv.ts`, matching the TechSpec "Core
  Interfaces" section (do not redefine them differently here).
- Section slugs MUST align with the existing `*-heading` id prefixes already in
  the components (`summary`, `credentials`, `impact`, `expertise`, `experience`,
  `work`, `approach`, `education`, `certifications`, `publications`, `voluntary`,
  `personal`, `interests`, `links`).
- `navGroups` MUST contain the six approved groups, each with `label`, `anchor`,
  and `spans`, and every `anchor`/`spans` value MUST be a valid `SectionSlug`.
- `CollapseConfig` MUST default to `recentRoles: 4` and `listThreshold: 8`
  (tunable, but these are the approved starting values).
- `sectionLeadIns` MUST be a partial map (optional per slug) so a section without
  an entry renders no lead-in.
- MUST add a `.cv-lead` component class to `src/styles/global.css` following the
  `cv-*` naming convention (so the custom ESLint `canonical-scale` and
  better-tailwindcss rules accept it) and the canonical font-size scale.
- MUST NOT modify any existing `cvData` content field or any component render.
</requirements>

## Subtasks
- [x] 1.1 Add the `SectionSlug`, `SectionLeadIns`, `NavGroup`, `CollapseConfig`
  type definitions to `cv.ts` per the TechSpec Core Interfaces.
- [x] 1.2 Add the `sectionLeadIns` value (one short lead-in per section; omit any
  that would merely restate the heading).
- [x] 1.3 Add the `navGroups` value (six groups: Summary, Proof, Experience, Work,
  Background, Beyond) with correct `anchor`/`spans` slugs.
- [x] 1.4 Add the `collapseConfig` value (`recentRoles: 4`, `listThreshold: 8`).
- [x] 1.5 Add the `.cv-lead` class to `global.css` in the components layer near
  `.cv-eyebrow`/`.cv-body`.
- [x] 1.6 Add a unit test asserting the data is internally consistent (every
  `navGroups` slug is a known section slug; `sectionLeadIns` has no unknown keys).

## Implementation Details
Add the new exports to `src/data/cv.ts`. The file holds the `CvData` interface at
the top and `export const cvData` at the bottom (named exports, TypeScript). Add
the new types alongside `CvData` and export the three new values as sibling
`const`s after `cvData` (e.g. `export const sectionLeadIns`, `export const
navGroups`, `export const collapseConfig`). See the TechSpec "Core Interfaces" and
"Data Models" sections for the exact shapes and proposed values — do not restate
them here.

Add `.cv-lead` to `src/styles/global.css` in the `@layer components` block near
the other `cv-*` role classes (`.cv-section` ~line 127, `.cv-eyebrow` ~line 132).
Keep it visually subordinate to the heading (muted, body-scale), consistent with
the established system.

### Relevant Files
- `src/data/cv.ts` — single content source; new types + values go here (`CvData`
  interface near top, `cvData` const at bottom, named exports).
- `src/styles/global.css` — `@layer components` `cv-*` role classes; add `.cv-lead`.

### Dependent Files
- `src/components/*.astro` (14 sections) — consume `sectionLeadIns`/`.cv-lead` in
  tasks 02/03; not edited here.
- `src/components/CvNav.astro` — consumes `navGroups` in task 06; not created here.
- `src/components/Timeline.astro` — consumes `collapseConfig` in task 05.

### Related ADRs
- [ADR-004: Per-section lead-ins from a central sectionLeadIns map](../adrs/adr-004.md) — defines the central-map decision and slug list.
- [ADR-002: In-page navigation as a right-margin sticky rail](../adrs/adr-002.md) — `navGroups` shape feeds the nav.
- [ADR-003: Long-tail disclosure via class toggle](../adrs/adr-003.md) — `CollapseConfig` tuning.

## Deliverables
- `sectionLeadIns`, `navGroups`, `collapseConfig` plus their types exported from
  `src/data/cv.ts`.
- `.cv-lead` class in `src/styles/global.css`.
- Unit tests with 80%+ coverage of the new data's internal consistency **(REQUIRED)**.
- Integration check that `astro check` and `npm run build` stay green with the
  additive data **(REQUIRED)**.

## Tests
- Unit tests:
  - [x] `navGroups` consistency: every `anchor` and every `spans` entry is one of
    the 14 known `SectionSlug` values; no duplicates across `spans`.
  - [x] `sectionLeadIns` keys are all known slugs (no typo keys); each value is a
    non-empty string.
  - [x] `collapseConfig` equals `{ recentRoles: 4, listThreshold: 8 }`.
  - [x] `global.css` defines `.cv-lead` exactly once in the components layer.
- Integration tests:
  - [x] `npm run check` passes (types resolve) and `npm run build` succeeds with
    the new exports present and unused by any render (no visual change).
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- `cv.ts` exports `sectionLeadIns`, `navGroups`, `collapseConfig` with correct
  types and approved values; `.cv-lead` exists in `global.css`.
- `/cv` renders byte-identically to before (data added, nothing consumed yet);
  `lint`/`check`/`build` green.
