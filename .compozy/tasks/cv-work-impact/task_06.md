---
status: completed
title: 'Hard-rename `/projects` → `/work` and update the index link'
type: frontend
complexity: low
dependencies: []
---

# Task 6: Hard-rename `/projects` → `/work` and update the index link

## Overview
Adopt "Work" as the umbrella by moving the projects index from `/projects` to
`/work` (the detail route `/work/<slug>` already exists) with no redirect, and
update the only internal reference so nothing 404s (TechSpec ADR-005). Self-
contained and independent of the impact changes.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST move `src/pages/projects.astro` to `src/pages/work/index.astro`, preserving its company-grouping logic so `/work` renders the index.
- MUST update the back-link inside the moved page to keep pointing at `/cv`, and keep the `/work/<slug>` detail route working unchanged.
- MUST update `src/components/CaseStudies.astro` to link to `/work` and relabel the call-to-action (e.g. "See all work, grouped by company →").
- MUST NOT add a Netlify redirect; the old `/projects` URL is intentionally retired (ADR-005), and there MUST be no remaining internal reference to `/projects`.
- MUST add no client JS and keep the page's existing layout/section pattern intact.
</requirements>

## Subtasks
- [x] 6.1 Move `projects.astro` to `work/index.astro` (logic unchanged).
- [x] 6.2 Update `CaseStudies.astro` link target and label to `/work`.
- [x] 6.3 Grep the codebase for any other `/projects` reference and update it.
- [x] 6.4 Verify `/work` renders and `/projects` no longer exists.

## Implementation Details
Relocate `src/pages/projects.astro` → `src/pages/work/index.astro`; Astro serves
it at `/work` alongside the existing `src/pages/work/[slug].astro`. Edit the
`href="/projects"` and label in `src/components/CaseStudies.astro`. No
`netlify.toml` change. See TechSpec "System Architecture" and ADR-005
"Implementation Notes".

### Relevant Files
- `src/pages/projects.astro` — moved to `src/pages/work/index.astro`.
- `src/pages/work/[slug].astro` — existing detail route; coexists with the new index.
- `src/components/CaseStudies.astro` — holds the `/projects` link/label to update.
- `netlify.toml` — confirm no redirect is added (ADR-005).

### Dependent Files
- None beyond `CaseStudies.astro`; the rename is otherwise isolated.

### Related ADRs
- [ADR-005: Hard rename `/projects` → `/work` with no redirect](adrs/adr-005.md) — move the index; no redirect; `linkinator` guards links.
- [ADR-001: Work + Impact naming](adrs/adr-001.md) — "Work" is the umbrella.

## Deliverables
- `src/pages/work/index.astro` serving the company-grouped index at `/work`.
- `CaseStudies.astro` linking to `/work` with updated label.
- No remaining `/projects` reference; verification evidence **(REQUIRED)**.

## Tests
- Unit tests (route/link verification):
  - [x] Built site emits `/work/index.html` and does NOT emit `/projects`.
  - [x] `/work` lists every non-draft work entry grouped by company (same output as the old `/projects`).
  - [x] Grep of `src/` and `dist/` shows zero remaining `/projects` references.
  - [x] `CaseStudies.astro` renders a link to `/work` with the updated label.
- Integration tests:
  - [x] `npm run check && npm run build` exits 0 and emits `/work`. (Type-check run via the documented `astro check` scoped-tsconfig workaround — `npm run check` verbatim OOMs in this tree per shared memory, an env limitation, not a code fault; `npm run build` exit 0, emits `/work`.)
  - [x] `linkinator` over `dist` resolves `/work` and the CaseStudies link (200); no broken `/projects` link remains.
- Test coverage target: >=80% (route move, link update, no stale refs)
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- `/work` serves the company-grouped index; `/projects` is gone with no redirect.
- No internal `/projects` reference remains; no client JS.
