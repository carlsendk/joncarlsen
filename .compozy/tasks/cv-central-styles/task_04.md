---
status: completed
title: Convert card, impact and link components plus index pages
type: refactor
complexity: medium
dependencies:
  - task_01
---

# Task 4: Convert card, impact and link components plus index pages

## Overview
Convert the card/impact/link components and the two index pages to role classes,
fixing the impact-heading weight drift and unifying pill/card/metric styling. One
of four independent conversion batches; includes the /impact and /work index
pages because they reuse these same roles.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST replace recurring utility strings in CaseStudies, CaseStudyCard, Impact, Links and the impact.astro and work/index.astro pages with role classes (cv-section, cv-eyebrow, cv-card, cv-metric, cv-meta, cv-pill, cv-pill-solid, cv-link, cv-badge).
- MUST resolve the impact-item heading drift (missing font-medium / tracking variant) to the canonical role.
- MUST keep per-instance colour utilities (e.g. cv-metric uses text-accent) in markup.
- MUST produce computed styles identical to baseline for these surfaces, except enumerated drift corrections.
- MUST preserve all link target attributes, focus-visible behaviour, and hover states.
</requirements>

## Subtasks
- [x] 4.1 Capture the pre-change computed-style baseline for these components and pages.
- [x] 4.2 Replace card, metric, pill, link, section, eyebrow utilities with role classes.
- [x] 4.3 Apply the canonical impact-heading role to remove the weight/tracking drift.
- [x] 4.4 Rebuild and compare computed styles across /cv, /impact, /work.

## Implementation Details
Edit the four components and two pages to use role classes from task 01. See
TechSpec "Impact Analysis" for the affected surfaces.

### Relevant Files
- `src/components/CaseStudies.astro` — cv-section, cv-eyebrow, cv-link.
- `src/components/CaseStudyCard.astro` — cv-card, cv-entry-title, cv-meta, cv-badge.
- `src/components/Impact.astro` — cv-section, cv-eyebrow, cv-metric, cv-meta, cv-link.
- `src/components/Links.astro` — cv-section, cv-eyebrow, cv-pill, cv-pill-solid.
- `src/pages/impact.astro` — page intro (cv-body), company headings, cv-metric, cv-meta, cv-link.
- `src/pages/work/index.astro` — page intro (cv-body), company headings, cv-link.

### Dependent Files
- `src/styles/global.css` — provides the role classes (from task 01); not edited here.

### Related ADRs
- [ADR-002: @apply component classes](../adrs/adr-002.md) — conversion target.

## Deliverables
- Four components and two pages converted; impact-heading drift resolved.
- Before/after computed-style evidence on /cv, /impact, /work showing parity (minus drift fixes).
- Unit tests with 80%+ coverage **(REQUIRED)**.
- Integration tests for computed-style parity **(REQUIRED)**.

## Tests
- Unit tests:
  - [x] Build succeeds with these surfaces using role classes.
  - [x] No leftover duplicated card/metric/pill/section utility strings remain (grep check).
- Integration tests:
  - [x] Computed styles for card, metric, pill, link, eyebrow on /cv, /impact, /work match baseline except documented drift fixes.
  - [x] Pill and card hover/focus-visible states behave unchanged.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- These surfaces render pixel-identically to baseline apart from agreed drift fixes.
- The impact-item heading uses the canonical role (no weight/tracking drift).
