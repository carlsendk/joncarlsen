---
status: completed
title: Render the scope line in the hero/summary
type: frontend
complexity: low
dependencies:
  - task_01
---

# Task 4: Render the scope line in the hero/summary

## Overview
Front-load executive scope: render the hard `scope` line (org size, transformation
reach, remit owned) in the hero/summary area so a recruiter reads CTO-level scope
in the first seconds (PRD "CTO-altitude CV spine").

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST render `cvData.scope` in the hero/summary area, in `src/components/Hero.astro` or `src/components/Summary.astro`, as a scannable executive scope line.
- MUST keep the single `<h1>` in `Hero.astro` (no additional h1); the scope line is supporting text, not a heading.
- MUST style with tokens only, remain legible and AA-compliant in both themes, and read cleanly on mobile.
- MUST add no client JS and introduce no contact details.
- SHOULD keep the scope line concise enough to scan quickly (one line on desktop where possible).
</requirements>

## Subtasks
- [x] 4.1 Add a `scope` prop to the chosen component and render it.
- [x] 4.2 Style the scope line to read as supporting executive context.
- [x] 4.3 Confirm a single h1 and AA contrast in both themes.

## Implementation Details
Modify `src/components/Hero.astro` (preferred, to front-load on both `/` and `/cv`)
or `src/components/Summary.astro`. Pass `cvData.scope` from the page (final wiring
in task_05). See the TechSpec "System Architecture" (scope line).

### Relevant Files
- `src/components/Hero.astro` — owns the identity header and single h1.
- `src/components/Summary.astro` — alternative location on `/cv`.
- `src/data/cv.ts` — provides `scope` (task_01).

### Dependent Files
- `src/pages/cv.astro`, `src/pages/index.astro` (task_05) — pass `scope`.

### Related ADRs
- [ADR-001: Re-pitch the canonical CV to CTO altitude](adrs/adr-001.md) — the scope line is a core CTO signal.

## Deliverables
- The `scope` line rendered in the hero/summary area.
- Single-h1 and contrast verification evidence **(REQUIRED)**.

## Tests
- Unit tests (render verification):
  - [x] The built output shows `cvData.scope` text in the hero/summary area. (rendered via Hero in `scope-harness` light+dark; grep `dist` = 1 each)
  - [x] The page still has exactly one `<h1>`. (harness pages, `/`, and `/cv` each h1=1; scope rendered as spans, not a heading)
- Integration tests:
  - [x] `npx astro check` and `npx astro build` exit 0. (check: 0 errors/0 warnings; build exit 0)
  - [x] Real Lighthouse holds accessibility in both themes; the scope line meets AA contrast. (Lighthouse accessibility=1.0 + color-contrast pass, light+dark; computed ratios fg/bg 17.85/15.31:1, label 7.58/7.37:1)
- Test coverage target: >=80% (render and single-h1 invariants exercised)
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- The scope line is front-loaded and scannable, AA-compliant, single h1 preserved.
- No client JS; no contact details.
