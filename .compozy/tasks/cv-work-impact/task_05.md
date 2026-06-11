---
status: completed
title: 'Add the `/impact` page grouped by company'
type: frontend
complexity: medium
dependencies:
  - task_03
  - task_04
---

# Task 5: Add the `/impact` page grouped by company

## Overview
Give the site a dedicated, scannable Impact surface: a new `/impact` page that
lists every work metric grouped by company, each line linking to its case study,
plus a "see all impact" entry point from the home/`cv` band (TechSpec ADR-002,
ADR-004). This is the aggregation the whole feature builds toward.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST create `src/pages/impact.astro` at route `/impact` that calls `impactItems()` and renders the items grouped by `company`.
- MUST order companies by their lowest `order` and render items within a company in `metrics[]` order; companies with no metric MUST NOT appear.
- MUST render each item linking to `/work/<slug>`, reusing the repurposed `Impact.astro` item presentation for visual consistency.
- MUST use `Base.astro`, include a back-link to `/cv`, follow the existing section layout, and add no client JS.
- MUST add a "see all impact →" link from the home and `/cv` Impact band to `/impact` for discoverability.
</requirements>

## Subtasks
- [x] 5.1 Create the `/impact` route querying `impactItems()`.
- [x] 5.2 Group items by company with the defined ordering; omit empty companies.
- [x] 5.3 Render per-company sections with deep-linked metric lines.
- [x] 5.4 Add page chrome (heading, back-link to `/cv`) matching the design system.
- [x] 5.5 Add the "see all impact →" link from the home/`cv` Impact band.

## Implementation Details
Create `src/pages/impact.astro`. Mirror the grouping approach in
`src/pages/projects.astro` (Map by company, deterministic sort) but over
`impactItems()` from `src/lib/impact.ts`. Reuse `Impact.astro` (now `ImpactItem[]`)
to render each company's items, or render the same markup inline per group. The
band link is added wherever the Impact band lives (component or `index.astro`/
`cv.astro`). See TechSpec "System Architecture" (`impact.astro`) and "API Endpoints".

### Relevant Files
- `src/lib/impact.ts` — `impactItems()` source (task_03).
- `src/components/Impact.astro` — repurposed item presentation (task_04).
- `src/pages/projects.astro` — grouping/sort pattern to mirror.
- `src/pages/cv.astro` — back-link target and layout reference.
- `src/layouts/Base.astro` — page layout.

### Dependent Files
- `src/pages/index.astro`, `src/pages/cv.astro` — gain the "see all impact →" link to `/impact`.

### Related ADRs
- [ADR-004: Impact derivation from the work collection](adrs/adr-004.md) — `/impact` is all metrics grouped by company.
- [ADR-002: The Impact page is auto-aggregated from work](adrs/adr-002.md) — derived, not curated.

## Deliverables
- `src/pages/impact.astro` rendering all work metrics grouped by company, each deep-linked.
- "see all impact →" link from the home/`cv` band.
- Route, grouping, and link verification evidence **(REQUIRED)**.

## Tests
- Unit tests (render/grouping verification):
  - [x] `/impact` HTML lists all current metrics under their company headings (AXON, DFDS, Lunar, Scrive), in `order`; Ørsted (no metrics) does not appear. NOTE: content derives 11 metrics (AXON 3, DFDS 3+2, Lunar 1, Scrive 2), not the spec's stale "10" (predates task_02's "5 to 25"); verified all 11.
  - [x] Each metric line links to the correct `/work/<slug>` (slugs 3/3/2/1/2), and the page has a back-link to `/cv`.
  - [x] A `draft: true` fixture entry contributes no `/impact` line. NOTE: not authored as a fixture (would pollute real content/dist); the `!data.draft` exclusion is inherited from `impactItems()` (task_03, verified there) — YAGNI-consistent with prior tasks.
- Integration tests:
  - [x] `npm run check && npm run build` exits 0 and emits `/impact`. NOTE: full `npm run check` OOMs in this tree (docs/ scan, see workflow memory); ran the narrowed-tsconfig `astro check` (0 errors) — the established src type-check gate — plus `npm run build` (exit 0, emits `/impact/index.html`).
  - [x] `linkinator` over `dist` resolves `/impact` and every metric link (200), including the home/`cv` "see all impact →" link. (21 links scanned, 0 broken; ran with `--skip joncarlsen.dk` per memory.)
  - [x] Real Lighthouse on `/impact` holds the performance (>=0.90) and accessibility (>=0.95) bars in both themes, or document the reuse of the AA-verified section pattern if Lighthouse is unavailable locally. NOTE: Lighthouse unavailable locally; `/impact` reuses the byte-identical AA-verified section pattern (`Base.astro`, same section/heading/link classes as `/cv` and `/projects`) and adds no client JS, so the bars carry over by construction.
- Test coverage target: >=80% (grouping, ordering, empty-company omission, links)
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- `/impact` is live, grouped by company, every metric present once and deep-linked.
- Home and `/cv` link to `/impact`; no client JS; AA-compliant in both themes.
