---
status: completed
title: Convert prose and label components to role classes
type: refactor
complexity: medium
dependencies:
  - task_01
---

# Task 2: Convert prose and label components to role classes

## Overview
Replace the duplicated utility strings in the prose/label components with the
role classes from task 01, fixing each component's drift to the canonical value
as it adopts a role. This is one of four mutually independent conversion batches,
scoped to ≤6 files to stay reviewable.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST replace recurring utility strings in Hero, Summary, Approach, Credentials, Expertise, Interests with the matching role classes (cv-section, cv-eyebrow, cv-body, etc.).
- MUST keep per-instance colour utilities (text-fg / text-muted) in markup alongside the role class.
- MUST leave genuine one-off styling inline (do not force a role where none recurs).
- MUST produce computed styles identical to the pre-change baseline for these components, except the enumerated drift corrections.
- MUST NOT alter content, semantics, or accessibility attributes.
</requirements>

## Subtasks
- [x] 2.1 Capture the pre-change computed-style baseline for a representative element of each role in these six components.
- [x] 2.2 Replace section-shell, eyebrow, body, and any link utilities with role classes in each file.
- [x] 2.3 Keep colour/one-off modifiers in markup.
- [x] 2.4 Rebuild and compare computed styles against the baseline.

## Implementation Details
Edit the six components to use the role classes defined in task 01. See TechSpec
"System Architecture" for the role-to-element mapping. No new classes are created
here.

### Relevant Files
- `src/components/Hero.astro` — value prop, scope, title; cv-body, cv-eyebrow/meta.
- `src/components/Summary.astro` — cv-section, cv-eyebrow, cv-body.
- `src/components/Approach.astro` — cv-section, cv-eyebrow, cv-body, cv-meta, cv-link.
- `src/components/Credentials.astro` — cv-section, cv-eyebrow, cv-body (reference body).
- `src/components/Expertise.astro` — cv-section, cv-eyebrow, cv-badge/chip.
- `src/components/Interests.astro` — cv-section, cv-eyebrow, cv-body.

### Dependent Files
- `src/styles/global.css` — provides the role classes (from task 01); not edited here.

### Related ADRs
- [ADR-002: @apply component classes](../adrs/adr-002.md) — conversion target.

## Deliverables
- Six components converted to role classes with colour kept in markup.
- Before/after computed-style evidence showing parity (minus drift fixes).
- Unit tests with 80%+ coverage **(REQUIRED)** — build/compile assertions for these files.
- Integration tests for computed-style parity **(REQUIRED)**.

## Tests
- Unit tests:
  - [x] Build succeeds with the six components using role classes.
  - [x] No leftover duplicated section/eyebrow/body utility string remains in these files (grep check).
- Integration tests:
  - [x] Computed font-family/size/weight/line-height/spacing for each role element in these six components matches the baseline, except the documented drift corrections.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- The six components render pixel-identically to baseline apart from agreed drift fixes.
- No duplicated role utility strings remain in these files.
