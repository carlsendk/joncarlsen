---
status: completed
title: Remove the redundant per-page inline back-link navs
type: refactor
complexity: low
dependencies:
  - task_02
---

# Task 3: Remove the redundant per-page inline back-link navs

## Overview
With the header now supplying a contextual back-link on every page (task_02), the
inline back-link `<nav>` blocks in the four secondary pages are duplicates.
Remove them so each page shows exactly one back affordance — the header's. This
completes the feature and eliminates the brief double-back-link cosmetic state.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST remove the inline back-link `<nav>` block from `src/pages/cv.astro` (`← Overview` → `/`), `src/pages/impact.astro`, `src/pages/work/index.astro`, and `src/pages/work/[slug].astro` (each `← Back to CV` → `/cv`).
- MUST leave each page's remaining structure (Hero, content sections, `<Base>` props) unchanged; only the back-link `<nav>` is deleted.
- MUST NOT touch `src/pages/index.astro` (it has no inline back-link nav).
- After removal, each affected route MUST present exactly one back-link — the header's — with the correct target preserved (`/cv` → `/`; deeper pages → `/cv`).
- MUST keep the build green: `astro check`, `astro build`, and `linkinator` pass with no dead or missing links.
</requirements>

## Subtasks
- [x] 3.1 Delete the back-link `<nav>` block in `src/pages/cv.astro`.
- [x] 3.2 Delete the back-link `<nav>` block in `src/pages/impact.astro`.
- [x] 3.3 Delete the back-link `<nav>` block in `src/pages/work/index.astro`.
- [x] 3.4 Delete the back-link `<nav>` block in `src/pages/work/[slug].astro`.
- [x] 3.5 Confirm each route shows a single (header) back-link with the right target and the build is green.

## Implementation Details
Each target page has an identical-shaped inline nav immediately after the
`<Base ...>` opening: `cv.astro` lines ~35–42 (`href="/"`, `← Overview`),
`impact.astro` lines ~46–53, `work/index.astro` lines ~44–51, and
`work/[slug].astro` lines ~23–30 (each `href="/cv"`, `← Back to CV`). Remove the
whole `<nav class="mx-auto max-w-2xl px-6 pt-6"> … </nav>` block in each; change
nothing else. The header (task_02) already provides the equivalent contextual
link, so the targets are preserved. See TechSpec "Impact Analysis" rows for these
four pages.

### Relevant Files
- `src/pages/cv.astro` — inline `← Overview` nav (~lines 35–42) to delete.
- `src/pages/impact.astro` — inline `← Back to CV` nav (~lines 46–53) to delete.
- `src/pages/work/index.astro` — inline `← Back to CV` nav (~lines 44–51) to delete.
- `src/pages/work/[slug].astro` — inline `← Back to CV` nav (~lines 23–30) to delete.

### Dependent Files
- `src/components/Header.astro` — supplies the replacement back-link; relied upon, not modified.
- `src/pages/index.astro` — intentionally untouched (no inline nav).

### Related ADRs
- [ADR-001: Persistent identity sticky header with contextual back-link](../adrs/adr-001.md) — the header replaces per-page back-links.
- [ADR-003: Single shared Header with pathname-derived back-link](../adrs/adr-003.md) — back-link targets preserved by the header derivation.

## Deliverables
- Four pages with their inline back-link `<nav>` blocks removed.
- Verification evidence that each route has exactly one back-link (the header's) with the correct target **(REQUIRED)**.
- `astro check` + `astro build` + `linkinator` green.

## Tests
- Unit tests (render assertions over built HTML):
  - [ ] `cv.astro` HTML contains exactly one back-link to `/` (the header's) and no second `← Overview` nav block.
  - [ ] `impact.astro`, `work/index.astro`, and `work/<slug>.astro` each contain exactly one back-link to `/cv` (the header's), with the old inline nav gone.
  - [ ] `index.astro` is byte-unchanged versus before this task (no nav existed; none removed).
- Integration tests:
  - [ ] `npm run check` → 0 errors / 0 warnings; `npm run build` → exits 0; all five routes emitted.
  - [ ] `linkinator ./dist --recurse` (existing skip list) → all back-link targets (`/`, `/cv`) resolve 200; no dangling links from the removed navs.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Each secondary route shows a single back-link (the header's) with the correct target; `index.astro` untouched.
- No duplicate back-links remain anywhere; `astro check`, `astro build`, and `linkinator` are green.
