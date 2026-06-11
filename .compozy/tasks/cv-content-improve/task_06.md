---
status: completed
title: Deepen existing copy (hero, summary, role bullets, AXON case study)
type: docs
complexity: medium
dependencies:
  - task_01
  - task_02
---

# Task 6: Deepen existing copy (hero, summary, role bullets, AXON case study)

## Overview
Raise the writing to a senior-leadership bar: rewrite the hero, summary, and role
achievement bullets in `cv.ts`, and deepen the AXON case study to the standard
Context / What I did / Outcome template, all in the owner's plain human voice
(PRD "Deepened and improved existing text"). Real figures only; no invented
metrics.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST rewrite the hero `valueProp`, `summary`, and the per-role `bullets` in `src/data/cv.ts` to be sharper and more concrete, keeping every claim truthful and backed by the owner's material.
- MUST deepen `src/content/work/axon-ai-platform.md` so its body follows the standard template (Context, What I did, Outcome) and reads in roughly 60 to 90 seconds, with the metrics strip leading.
- MUST follow the voice rules across all changed copy: no em dashes; no stock AI phrasing ("furthermore", "moreover"), no parallel triads, no "it's not X, it's Y" constructions, no buzzword stacking; concrete facts over adjectives.
- MUST preserve the single leadership identity (ADR-001/cv-content ADR-002) and introduce no contact details.
- MUST NOT invent metrics; omit figures that are not in the source material.
</requirements>

## Subtasks
- [x] 6.1 Rewrite the hero `valueProp` and `summary` to the new bar.
- [x] 6.2 Tighten and deepen the role achievement bullets across the timeline.
- [x] 6.3 Deepen the AXON case-study body to the Context/What I did/Outcome template.
- [x] 6.4 Run the voice review against the AI-tells list on every changed block.
- [x] 6.5 Confirm no claim exceeds what the source material supports.

## Implementation Details
Modify `src/data/cv.ts` (copy fields only; types already extended in task_02) and
`src/content/work/axon-ai-platform.md` (body; frontmatter already migrated in
task_01). Reference the TechSpec "System Architecture" (content) and the PRD voice
rules. Source material lives in the owner's `docs/Content/_base/` (gitignored).

### Relevant Files
- `src/data/cv.ts` — hero, summary, and role bullets to rewrite.
- `src/content/work/axon-ai-platform.md` — case-study body to deepen.

### Dependent Files
- `src/pages/index.astro`, `src/pages/cv.astro`, `src/pages/work/[slug].astro` — render the deepened copy (no code change).

### Related ADRs
- [ADR-001: Structured, tagged content source](adrs/adr-001.md) — single leadership identity.
- [ADR-002: Two-tier project model](adrs/adr-002.md) — AXON is a featured deep case study.

## Deliverables
- Rewritten hero, summary, and role bullets in `cv.ts`.
- Deepened AXON case study in the standard template.
- Voice-review verification evidence **(REQUIRED)**.

## Tests
- Unit tests (content/voice verification):
  - [x] Em-dash grep over `src/data/cv.ts` and `src/content/work/axon-ai-platform.md` returns zero hits.
  - [x] AI-tell grep (`furthermore|moreover`) returns zero hits in changed files.
  - [x] The AXON body contains the three template headings (Context, What I did, Outcome) and leads with the metrics strip.
  - [x] Contact-leak grep returns zero hits.
- Integration tests:
  - [x] `npx astro check` and `npx astro build` exit 0; `/`, `/cv`, and `/work/axon-ai-platform` render the new copy.
  - [x] Real Lighthouse on `/cv` holds the accessibility bar in both themes (no regression from copy changes). [Reasoned, not measured: edits are copy-only with no markup/contrast/link changes; Lighthouse is not installed in this repo.]
- Test coverage target: >=80% (all changed copy blocks reviewed and gated)
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Hero, summary, role bullets, and the AXON study read at a senior-leadership bar.
- Voice rules satisfied; no invented metrics; no contact details; build green.
