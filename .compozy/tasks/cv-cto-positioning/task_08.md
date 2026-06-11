---
status: completed
title: Create the content-gaps supply checklist
type: docs
complexity: low
dependencies:
  - task_06
---

# Task 8: Create the content-gaps supply checklist

## Overview
Produce the single, prioritised checklist of high-value information the owner still
needs to supply to reach full CTO-grade impact (PRD, ADR-002). Each entry ties to
where it strengthens the CV and to its draft `[TODO]` marker, so filling a figure
is a clear, tracked action.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST create `.compozy/tasks/cv-cto-positioning/content-gaps.md` as a single checklist of the high-value missing figures (for example budget owned, cloud-cost reduction, Scrive SLA before/after, board/investor cadence, hiring velocity, retention).
- MUST tie each checklist item to where it would strengthen the CV and to the matching `[TODO]` marker seeded in `cv.ts` (task_06), so every open marker has a checklist entry and vice versa.
- MUST be a planning artifact only, not part of the built site (it lives in the task folder, never under `src/` or `public/`).
- MUST follow the voice rules and contain no contact details.
- SHOULD prioritise the items by impact on CTO-level credibility.
</requirements>

## Subtasks
- [x] 8.1 Enumerate every `[TODO]` marker seeded in `cv.ts`.
- [x] 8.2 Write a checklist entry per gap: what to supply, where it lands, why it matters.
- [x] 8.3 Prioritise the list by CTO-credibility impact.
- [x] 8.4 Confirm one-to-one coverage between markers and checklist entries.

## Implementation Details
Create `.compozy/tasks/cv-cto-positioning/content-gaps.md`. Cross-reference the
`[TODO]` markers from task_06. See the PRD "Non-Goals" (no placeholder text on the
site) and ADR-002 / ADR-003.

### Relevant Files
- `src/data/cv.ts` — holds the `[TODO]` markers this checklist mirrors (task_06).
- `.compozy/tasks/cv-cto-positioning/_prd.md` — the gaps named in Open Questions.

### Dependent Files
- None in the site build; this is a planning artifact.

### Related ADRs
- [ADR-002: Truth-first enrichment with a supply-list and source placeholders](adrs/adr-002.md) — the supply-list.
- [ADR-003: Draft-gated placeholders](adrs/adr-003.md) — markers this list mirrors.

## Deliverables
- `content-gaps.md` checklist, prioritised, with one entry per open `[TODO]`.
- Marker/checklist coverage verification evidence **(REQUIRED)**.

## Tests
- Unit tests (content verification):
  - [x] Every `[TODO]` marker in `cv.ts` has a matching entry in `content-gaps.md`.
  - [x] Every checklist entry names what to supply, where it lands, and why it matters.
  - [x] Em-dash and contact-leak greps over `content-gaps.md` return zero hits.
- Integration tests:
  - [x] The file is under `.compozy/tasks/cv-cto-positioning/` and not referenced by any page; `npx astro build` does not include it in `dist/`.
- Test coverage target: >=80% (every marker covered by a checklist entry)
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- A prioritised supply checklist exists with one-to-one coverage of the `[TODO]` markers.
- It is a planning artifact only, never in the built site; no contact details.
