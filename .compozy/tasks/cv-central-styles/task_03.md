---
status: completed
title: Convert entry and list components to role classes
type: refactor
complexity: medium
dependencies:
  - task_01
---

# Task 3: Convert entry and list components to role classes

## Overview
Convert the entry/list components (those with entry titles, dates, and detail
lists) to the role classes from task 01, fixing drift such as the meta-line
tracking and the sub-detail tier as each adopts a role. One of four independent
conversion batches.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST replace recurring utility strings in Timeline, Education, VoluntaryLeadership, Publications, Certifications, PersonalDetails with the matching role classes (cv-section, cv-eyebrow, cv-entry-title, cv-meta, cv-body, cv-detail, cv-link).
- MUST map the Education activities list to cv-detail (the 14px sub-tier) and dates/periods to cv-meta (canonical tracking).
- MUST keep per-instance colour utilities in markup.
- MUST produce computed styles identical to baseline for these components, except enumerated drift corrections.
- MUST preserve list semantics and the PersonalDetails dt/dd baseline alignment.
</requirements>

## Subtasks
- [x] 3.1 Capture the pre-change computed-style baseline for these six components.
- [x] 3.2 Replace entry-title, meta, detail, eyebrow, section utilities with role classes.
- [x] 3.3 Reconcile meta tracking (canonical cv-meta) where these files diverged.
- [x] 3.4 Rebuild and compare computed styles against the baseline.

## Implementation Details
Edit the six components to use role classes from task 01. See TechSpec "Data
Models" for the canonical scale per role.

### Relevant Files
- `src/components/Timeline.astro` — entry title, dates, scope, bullets, links.
- `src/components/Education.astro` — entry title, institution (cv-body), dates (cv-meta), activities (cv-detail).
- `src/components/VoluntaryLeadership.astro` — entry title (cv-entry-title), detail (cv-body).
- `src/components/Publications.astro` — cv-section, cv-eyebrow, cv-body, cv-link.
- `src/components/Certifications.astro` — cv-section, cv-eyebrow, cv-body.
- `src/components/PersonalDetails.astro` — cv-section, cv-eyebrow, cv-meta (dt), cv-body (dd).

### Dependent Files
- `src/styles/global.css` — provides the role classes (from task 01); not edited here.

### Related ADRs
- [ADR-002: @apply component classes](../adrs/adr-002.md) — conversion target.

## Deliverables
- Six components converted; Education activities on cv-detail; meta tracking unified.
- Before/after computed-style evidence showing parity (minus drift fixes).
- Unit tests with 80%+ coverage **(REQUIRED)**.
- Integration tests for computed-style parity **(REQUIRED)**.

## Tests
- Unit tests:
  - [x] Build succeeds with the six components using role classes.
  - [x] No leftover duplicated entry-title/meta/section utility strings remain (grep check).
- Integration tests:
  - [x] Computed styles for entry title, meta, body, detail in each file match baseline except documented drift fixes.
  - [x] PersonalDetails dt/dd remain baseline-aligned after conversion.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- The six components render pixel-identically to baseline apart from agreed drift fixes.
- Education activities use the single cv-detail tier; meta lines share one tracking.
