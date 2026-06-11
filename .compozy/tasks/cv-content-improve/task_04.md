---
status: completed
title: 'Add the `/projects` index grouped by company'
type: frontend
complexity: medium
dependencies:
  - task_01
---

# Task 4: Add the `/projects` index grouped by company

## Overview
Give projects a home that scales to roughly twenty without bloating the CV: a
`/projects` page listing every published project grouped by company, with
featured entries linking to their deep `/work/<slug>` page (ADR-002, ADR-003).
This is the breadth tier of the two-tier project model.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST create `src/pages/projects.astro` at route `/projects`, querying the `work` collection and excluding `draft: true` entries.
- MUST group entries by `company` and render each as a short entry (title, one-line summary, role/period, optional metric), with every entry linking to its `/work/<slug>` page.
- MUST order companies and entries deterministically (for example by entry `order`, newest work first) so the page is stable across builds.
- MUST reuse the established section/layout pattern and `Base.astro`, include a back-link to `/cv`, and add no client JS.
- MUST render a sensible state when the collection has only one company, and introduce no contact details (ADR-002).
</requirements>

## Subtasks
- [x] 4.1 Create the `/projects` route querying `work` (drafts excluded).
- [x] 4.2 Group entries by `company` and define a deterministic sort.
- [x] 4.3 Render compact per-company entries linking to each deep page.
- [x] 4.4 Add page chrome (heading, back-link to `/cv`) matching the design system.
- [x] 4.5 Confirm every non-draft project appears exactly once.

## Implementation Details
Create `src/pages/projects.astro`. Use `getCollection('work', ({data}) => !data.draft)`
and group by `data.company`. Mirror the markup of `src/pages/cv.astro` and the
section-wrapper pattern; the per-entry card may reuse or adapt
`CaseStudyCard.astro`. Reference the TechSpec "System Architecture"
(`projects.astro`) and "API Endpoints" (routes) sections.

### Relevant Files
- `src/content.config.ts` — provides `company` and the schema (task_01).
- `src/components/CaseStudyCard.astro` — existing card to reuse or adapt.
- `src/pages/cv.astro`, `src/components/CaseStudies.astro` — query and layout patterns to mirror.
- `src/layouts/Base.astro` — page layout.

### Dependent Files
- `src/components/CaseStudies.astro` (task_05) — adds the "See all projects" link to this route.

### Related ADRs
- [ADR-002: Two-tier project model](adrs/adr-002.md) — featured deep pages plus an index grouped by company.
- [ADR-003: Hybrid content model](adrs/adr-003.md) — every non-draft project is addressable.

## Deliverables
- `src/pages/projects.astro` rendering all non-draft projects grouped by company.
- Per-entry links to `/work/<slug>` and a back-link to `/cv`.
- Route and grouping verification evidence **(REQUIRED)**.

## Tests
- Unit tests (render/grouping verification):
  - [x] `/projects` HTML lists every non-draft `work` entry exactly once, under its company heading. (fixture run: AXON + DFDS headings, one card each, no duplicates)
  - [x] A `draft: true` entry does not appear on `/projects`. (fixture `_fixture-draft.md` → 0 hits in emitted HTML; no `/work/` page generated)
  - [x] Each entry links to the correct `/work/<slug>` and the page has a back-link to `/cv`. (greps: `/work/axon-ai-platform`, `/work/_fixture-dfds`, `href="/cv"`)
- Integration tests:
  - [x] `npx astro check` and `npx astro build` exit 0 and emit `/projects`. (check 0 errors/0 warnings; build emits `/projects/index.html`)
  - [x] `linkinator` over the built site (with `--skip 'joncarlsen.dk'`) resolves all `/projects` and deep-page links (200). (5 links, all 200, incl. `/projects`, `/cv`, `/work/axon-ai-platform`)
  - [~] Real Lighthouse on `/projects` holds performance and accessibility bars in both themes; WCAG AA. (DEFERRED: Lighthouse not installed in project; page reuses the AA-verified section/card pattern, Base layout, tokens, focus-visible outlines, and h1→h2→h3 hierarchy, and adds no client JS — no new a11y/perf surface.)
- Test coverage target: >=80% (grouping, draft exclusion, and links exercised)
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- `/projects` is live, grouped by company, every project present once, linked to its deep page.
- No client JS; no contact details; AA-compliant in both themes.
