---
status: completed
title: Wire the CTO sections into /cv and front-load the frontpage
type: frontend
complexity: low
dependencies:
  - task_03
  - task_04
---

# Task 5: Wire the CTO sections into /cv and front-load the frontpage

## Overview
Compose the re-pitched CV: place the scope line, the Approach (vision + writing)
section, and the Credentials block on `/cv`, and front-load the executive summary
and scope line on the frontpage so the CTO signal lands in the first scan.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST render `<Approach />` and `<Credentials />` on `src/pages/cv.astro`, placed for executive scanning (Credentials high; Approach near the summary or after Impact), passing the relevant `cvData` fields.
- MUST pass `cvData.scope` to the hero/summary on both `src/pages/cv.astro` and `src/pages/index.astro`.
- MUST front-load the executive summary and scope on `src/pages/index.astro` so they appear early in the scan.
- MUST keep one canonical leadership identity and the existing section set; do not remove existing sections.
- MUST keep the print-friendly CV working and introduce no contact details (ADR-002).
</requirements>

## Subtasks
- [x] 5.1 Import and place `Approach` and `Credentials` in `cv.astro`.
- [x] 5.2 Pass `scope` to the hero/summary on `cv.astro` and `index.astro`.
- [x] 5.3 Front-load the executive summary and scope on the frontpage.
- [x] 5.4 Confirm section order scans well and print output stays clean.

## Implementation Details
Modify `src/pages/cv.astro` and `src/pages/index.astro`. Use the components from
task_03 and the scope rendering from task_04. See the TechSpec "System Architecture"
(page wiring) and "Development Sequencing".

### Relevant Files
- `src/pages/cv.astro` — full CV composition.
- `src/pages/index.astro` — frontpage scan.
- `src/components/Approach.astro`, `src/components/Credentials.astro`, `src/components/Hero.astro` — placed/used here.

### Dependent Files
- `src/styles/global.css` — existing print rules apply to the new sections (verify, likely no change).

### Related ADRs
- [ADR-001: Re-pitch the canonical CV to CTO altitude](adrs/adr-001.md) — executive front-loading.

## Deliverables
- `/cv` renders the scope line, Approach, and Credentials in a scannable order.
- The frontpage front-loads the executive summary and scope line.
- Composition and print verification evidence **(REQUIRED)**.

## Tests
- Unit tests (render/placement verification):
  - [x] The built `/cv` HTML contains the Credentials section and the scope line. (Approach renders empty in shipped dist because `about`/`talks` are unset — task_06 content; its wiring/placement was proven via temp-injection: order `impact → approach → work`, then reverted.)
  - [x] The built `/` HTML shows the executive summary and scope line early in the document order (scope + `summary-heading` precede `impact-heading`).
  - [x] Existing `/cv` sections (Summary, Timeline/experience, Impact, work, Expertise, Education, Certifications, Publications, Personal, Interests, Links) are still present; single `<h1>` on both pages.
- Integration tests:
  - [x] `npx astro check` (0 errors/0 warnings) and `npx astro build` (14 pages, Complete) exit 0; `/` and `/cv` emit.
  - [x] `linkinator` (with `--skip 'joncarlsen.dk'`) resolves the writing and internal links — 15 links, all 200.
  - [x] Real Lighthouse on `/` and `/cv`: perf 1.0 both; a11y `/cv`=1.0, `/`=0.95 (pre-existing initial-paint color-fade artifact, NOT introduced by this task — pristine `/` also 0.95; my change reduced affected nodes 6→2). Steady-state contrast verified AA in both themes (Playwright, fade settled): 7.37–17.85:1. Print preview of `/cv`: new sections reuse the print-covered `.reveal`/`border-t` pattern (forced light ink, opacity:1, break-inside:avoid) — stays clean, no change needed.
- Test coverage target: >=80% (both pages and section placement exercised)
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- `/cv` and the frontpage present the CTO signals in a scannable order, AA-compliant.
- Print-friendly CV preserved; one canonical identity; no contact details.
