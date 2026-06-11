---
status: completed
title: Recast the spine to CTO altitude and populate the new content
type: docs
complexity: medium
dependencies:
  - task_01
  - task_02
  - task_03
  - task_04
  - task_05
---

# Task 6: Recast the spine to CTO altitude and populate the new content

## Overview
The content pass: rewrite the hero `valueProp` and `summary` to executive,
business-outcome altitude, author the `scope` line, `credentials`, leadership
`about` narrative, and `talks` writing references from the owner's real material,
and seed draft `[TODO]` markers where high-value figures are missing (ADR-002,
ADR-003). Real figures only; nothing invented.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST recast `valueProp` and `summary` in `src/data/cv.ts` to lead with technology-executive positioning and business outcomes, not technical activity.
- MUST author `scope` (a hard scope line covering org size, transformation reach, and remit owned) and `credentials` (eSignatur CTO remit, Lunar investor pitch deck, Heeplink advisory board, Scalers CTO/CPO network, business degree, AXON AI mandate) from real material.
- MUST populate `about` (leadership vision: purpose/mastery/autonomy, roadmap-from-strategy, maturity-stages, AI direction) and `talks` (published tech-leadership writing) from the owner's documents.
- MUST recast role `bullets` and `impact` toward ownership and business-outcome language, surfacing real signals (5 to 25, 3 to 20, 200+ Vitruvian-backed, DFDS Horizon) without inventing numbers.
- MUST seed `[TODO: ...]` markers for high-value missing figures (for example Scrive SLA/cost, budget owned, board cadence) so they are gated by `isReady` and never render.
- MUST follow the voice rules (no em dashes; no AI tells; concrete facts over adjectives) and introduce no contact details.
</requirements>

## Subtasks
- [x] 6.1 Recast `valueProp` and `summary` to CTO altitude.
- [x] 6.2 Author `scope` and `credentials` from real material.
- [x] 6.3 Populate `about` (vision) and `talks` (writing).
- [x] 6.4 Recast role bullets and impact to ownership/outcome language.
- [x] 6.5 Seed `[TODO]` markers for missing figures.
- [x] 6.6 Run the voice review on every changed block.

## Implementation Details
Modify `src/data/cv.ts` (copy and the new fields; types exist from task_01). Source
material: `docs/Content/Jon Carlsen - CTO CV.pdf`, `docs/Content/_base/leadership-narrative.md`,
`docs/Content/_base/about-me.md`, `docs/Content/_base/master-CV.md` (gitignored,
main checkout). See the TechSpec "System Architecture" and the PRD voice rules.

### Relevant Files
- `src/data/cv.ts` — all spine copy and the new fields.
- `docs/Content/_base/*.md`, `docs/Content/Jon Carlsen - CTO CV.pdf` — source material.

### Dependent Files
- `src/pages/index.astro`, `src/pages/cv.astro`, `src/components/*` — render the recast content (no code change).

### Related ADRs
- [ADR-001: Re-pitch the canonical CV to CTO altitude](adrs/adr-001.md) — the content recast.
- [ADR-002: Truth-first enrichment](adrs/adr-002.md) — real content; gaps as markers.
- [ADR-003: Draft-gated placeholders](adrs/adr-003.md) — `[TODO]` seeding.

## Deliverables
- Recast `valueProp`, `summary`, role bullets, and impact at CTO altitude.
- Populated `scope`, `credentials`, `about`, `talks` from real material.
- Seeded `[TODO]` markers for missing figures.
- Voice and gate verification evidence **(REQUIRED)**.

## Tests
- Unit tests (content/voice/gate verification):
  - [x] Em-dash grep over `src/data/cv.ts` returns zero; AI-tell grep (`furthermore|moreover`) returns zero.
  - [x] Contact-leak grep over `src/data/cv.ts` returns zero.
  - [x] `scope`, `credentials`, `about`, `talks` are populated with real values; any `[TODO]` is inside an array item (not a single-string spine field).
- Integration tests:
  - [x] `npx astro check` and `npx astro build` exit 0; `/` and `/cv` render the recast content.
  - [x] Built-output gate: grep `dist/**/*.html` for `[TODO`, `lorem`, `placeholder` returns zero, despite markers existing in `cv.ts`.
  - [x] Real Lighthouse on `/cv` holds the accessibility bar in both themes (no regression from copy changes).
- Test coverage target: >=80% (all recast blocks and seeded markers exercised)
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- The spine reads at CTO altitude in business-outcome language; new fields populated from real material.
- `[TODO]` markers never reach `dist/`; no invented figures; no contact details; no em dashes.
