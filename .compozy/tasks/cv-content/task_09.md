---
status: pending
title: Add the About narrative and Talks and Writing sections
type: frontend
complexity: medium
dependencies:
  - task_05
  - task_06
---

# Task 9: Add the About narrative and Talks and Writing sections

## Overview
Add the Phase 2 narrative layer: a short About / leadership-approach section in the
owner's voice, and a Talks & Writing section linking the tech-leadership knowledge
base and notable talks. These add a human, differentiating layer to the site
(PRD Core Features 5 and 7).

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST create `About.astro` rendering the `cvData.about` narrative, and `TalksWriting.astro` rendering `cvData.talks` plus the knowledge-base/profile links.
- About content MUST come from `docs/Content/_base/leadership-narrative.md`, condensed, in the owner's voice (no em dashes; none of the listed AI tells).
- MUST place About per the PRD (between hero and experience on the frontpage, and/or on `/cv`) and Talks & Writing on `/cv` (and frontpage if it fits the scan).
- Outbound links MUST use descriptive text and `rel="noopener noreferrer"` for external targets; MUST NOT add contact details (ADR-002).
- MUST reuse design tokens; MUST NOT hard-code colors or add client JS.
</requirements>

## Subtasks
- [ ] 9.1 Build `About.astro` from the condensed leadership narrative.
- [ ] 9.2 Build `TalksWriting.astro` (knowledge base + notable talks).
- [ ] 9.3 Place About and Talks & Writing on the appropriate page(s).
- [ ] 9.4 Confirm voice rules, tokens, and external-link rel attributes.

## Implementation Details
Create `src/components/About.astro` and `src/components/TalksWriting.astro`; wire
them into `src/pages/cv.astro` and/or `src/pages/index.astro`. Source the narrative
from `leadership-narrative.md` and talks from `master-CV.md` (Publications & Honours
/ the knowledge-base link). Match existing section markup and tokens.

### Relevant Files
- `docs/Content/_base/leadership-narrative.md` — About source.
- `docs/Content/_base/master-CV.md` — talks/knowledge-base links.
- `src/components/Timeline.astro` — section markup/token reference.

### Dependent Files
- `src/pages/cv.astro`, `src/pages/index.astro` — compose the new sections.

### Related ADRs
- [ADR-002: Single public leadership identity](../adrs/adr-002.md) — narrative reinforces one identity; no contact details.

## Deliverables
- `About.astro` and `TalksWriting.astro` rendering real, voice-compliant content.
- Sections placed and linked correctly **(REQUIRED)**.

## Tests
- Unit tests:
  - [ ] About renders the narrative with a labelled heading; no em dashes / AI tells present.
  - [ ] Talks & Writing renders the KB link and talks; external links carry `rel="noopener noreferrer"`.
  - [ ] No hard-coded color classes and no client `<script>` in the new components.
  - [ ] No `@`-email/phone rendered.
- Integration tests:
  - [ ] `linkinator` resolves the new outbound links; `astro build` exits 0.
  - [ ] Lighthouse a11y holds on the affected page(s) in both themes.
- Test coverage target: >=80% (both components exercised).
- All tests must pass.

## Success Criteria
- All tests passing
- Test coverage >=80%
- The site carries a human narrative and a thought-leadership section, on-brand and accessible.
