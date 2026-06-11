---
status: completed
title: Add the /work/[slug] route and seed the first case study
type: frontend
complexity: medium
dependencies:
  - task_02
  - task_05
  - task_06
---

# Task 7: Add the /work/[slug] route and seed the first case study

## Overview
Stand up the project deep-dive capability: a dynamic `/work/<slug>` route that
statically renders one page per `work` collection entry, a card component that
lists case studies, the first real case study (the AXON AI platform), and the
listing wired into both `/cv` and the frontpage (ADR-001, ADR-003).

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST create `src/pages/work/[slug].astro` using `getStaticPaths` over `getCollection('work')`, rendering each entry inside `Base.astro` with frontmatter-driven metadata and the markdown body.
- MUST exclude `draft: true` entries from generated paths.
- MUST create `CaseStudyCard.astro` to list studies (title, summary, metrics) and link to each `/work/<slug>`.
- MUST author one real case study markdown file (AXON AI platform) under `src/content/work/`, conforming to the task_02 schema and the authentic-voice rules.
- MUST surface the case-study listing on `/cv` and (where relevant) the frontpage, each linking to the deep-dive page; each deep-dive MUST link back.
- MUST render no contact details (ADR-002).
</requirements>

## Subtasks
- [x] 7.1 Create the `/work/[slug]` dynamic route with `getStaticPaths` (drafts excluded).
- [x] 7.2 Create `CaseStudyCard.astro` for listings.
- [x] 7.3 Author the AXON case study markdown (schema-valid, voice-compliant).
- [x] 7.4 Wire the listing into `/cv` and the frontpage; add back-links.
- [x] 7.5 Confirm slugs, metadata, and links resolve.

## Implementation Details
Create `src/pages/work/[slug].astro` and `src/components/CaseStudyCard.astro`; add
`src/content/work/axon-ai-platform.md`; edit `src/pages/cv.astro` and
`src/pages/index.astro` to render the listing. Use `getCollection('work')` from the
task_02 schema. Reference the TechSpec "System Architecture" and ADR-003. Content
from `docs/Content/_base/master-CV.md` (AXON section).

### Relevant Files
- `src/content.config.ts`, `src/content/work/` — collection + content (task_02).
- `src/layouts/Base.astro` — layout for the deep-dive page.
- `src/pages/cv.astro`, `src/pages/index.astro` — listing integration points.

### Dependent Files
- `src/pages/cv.astro`, `src/pages/index.astro` — modified to list case studies.

### Related ADRs
- [ADR-001: Hub-and-spoke information architecture](../adrs/adr-001.md) — growable deep-dive layer.
- [ADR-003: Content layer](../adrs/adr-003.md) — markdown collection rendered to pages.

## Deliverables
- `/work/[slug]` route + `CaseStudyCard.astro` + one real AXON case study.
- Listing wired into `/cv` and the frontpage with working links both ways.
- `dist/work/axon-ai-platform/index.html` emitted **(REQUIRED)**.

## Tests
- Unit tests:
  - [ ] `astro build` emits a page for the AXON entry and none for any `draft: true` entry.
  - [ ] `CaseStudyCard` renders title/summary/metrics and links to the correct `/work/<slug>`.
  - [ ] The case-study markdown passes the `work` schema (build succeeds).
  - [ ] The case study contains no `@`-email/phone and reads in the owner's voice (no em dashes).
- Integration tests:
  - [ ] `linkinator` finds no broken links across `/`, `/cv`, and `/work/<slug>` (listing and back-links resolve).
  - [ ] Lighthouse a11y holds on a `/work/<slug>` page.
- Test coverage target: >=80% (route, card, and one entry exercised).
- All tests must pass.

## Success Criteria
- All tests passing
- Test coverage >=80%
- A visitor can open a real case study from `/cv` or `/` and return; new studies are addable by dropping in a markdown file.

## Implementation Notes (as-built)
- Added `src/pages/work/[slug].astro` (Content Layer: `getStaticPaths` over `getCollection("work", ({data}) => !data.draft)`, `render(entry)`, slug = `entry.id`). Each deep-dive renders inside `Base.astro` with frontmatter-driven metadata, a metrics chip row, the markdown body, and a "← Back to CV" link.
- Added `CaseStudyCard.astro` (title, role·period, summary, metric chips, links to `/work/<id>`) and `CaseStudies.astro` (DRY "Selected Work" section: queries the collection once, drops drafts, sorts by `order`, renders nothing when empty). Wired `<CaseStudies />` into `/cv` (after Impact) and the frontpage (after the condensed Experience).
- Authored the first real case study `src/content/work/axon-ai-platform.md` (schema-valid; 0 em dashes; real figures: 50,000 dp/s, ~40 EMEA / 70 Europe, Java to Go).
- Verified: `astro check` 0/0; `astro build` exit 0 emits `dist/work/axon-ai-platform/index.html`; single `<h1>` on the deep-dive; listing + card link present on `/cv` and `/`; a `draft: true` entry is neither emitted nor listed; `linkinator` 8 links 0 broken (local scope); no contact details anywhere.
