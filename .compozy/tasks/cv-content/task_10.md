---
status: pending
title: Author the second case study, the DFDS transformation
type: frontend
complexity: low
dependencies:
  - task_07
---

# Task 10: Author the second case study, the DFDS transformation

## Overview
Author the second real case study, the DFDS 3-to-20 / 500-plus-microservices
cloud-native transformation, as a markdown file in the `work` collection. This
exercises the growable deep-dive capability with a second entry and gives the
listing more than one item (PRD Core Feature 6).

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST add one markdown file under `src/content/work/` for the DFDS transformation, conforming to the task_02 schema (title, summary, role, period, metrics, order).
- Content MUST come from `docs/Content/_base/master-CV.md` (DFDS sections) and read in the owner's voice (no em dashes; none of the listed AI tells).
- MUST use only real figures (3 to 20 people, 500+ microservices, ~200 engineers); MUST NOT invent numbers.
- The new page MUST appear in the case-study listing and generate at its own `/work/<slug>` with no code changes (capability already built in task_07).
- MUST contain no contact details (ADR-002).
</requirements>

## Subtasks
- [ ] 10.1 Draft the DFDS case study narrative (context, actions, measurable outcomes).
- [ ] 10.2 Add schema-valid frontmatter (title/summary/role/period/metrics/order).
- [ ] 10.3 Verify it generates a page and joins the listing automatically.
- [ ] 10.4 Confirm voice rules and real-figures-only.

## Implementation Details
Add `src/content/work/dfds-platform-transformation.md` (or similar slug). No code
changes are needed; task_07 already renders the collection. Reference the TechSpec
ADR-003 and the DFDS sections of the master CV.

### Relevant Files
- `docs/Content/_base/master-CV.md` — DFDS content source.
- `src/content/work/` — collection directory (task_02).
- `src/pages/work/[slug].astro`, `src/components/CaseStudyCard.astro` — render the new entry (task_07).

### Dependent Files
- None (additive content; renders through existing route and listing).

### Related ADRs
- [ADR-001: Hub-and-spoke information architecture](../adrs/adr-001.md) — growable case studies.
- [ADR-003: Content layer](../adrs/adr-003.md) — markdown-only addition.

## Deliverables
- One real DFDS case study markdown file rendering at its own `/work/<slug>`.
- It appears in the `/cv` and frontpage listings automatically **(REQUIRED)**.

## Tests
- Unit tests:
  - [ ] `astro build` emits the DFDS page at its slug and includes it in the listing.
  - [ ] Frontmatter passes the `work` schema (build succeeds).
  - [ ] Content uses only real figures and no em dashes / AI tells.
  - [ ] No `@`-email/phone in the file.
- Integration tests:
  - [ ] `linkinator` resolves the listing link to the new page and its back-link.
- Test coverage target: >=80% (the new entry exercised end to end).
- All tests must pass.

## Success Criteria
- All tests passing
- Test coverage >=80%
- A second real case study is live, added by markdown only, proving the growable capability.
