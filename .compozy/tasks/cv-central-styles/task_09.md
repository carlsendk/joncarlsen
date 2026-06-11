---
status: completed
title: Write the style spec
type: docs
complexity: low
dependencies:
    - task_01
---

# Task 9: Write the style spec

## Overview
Publish the human-readable single source of truth: a concise style spec
documenting the canonical type scale, the role-class vocabulary, and the
token-usage rules, so future work follows the system rather than reverse-
engineering it from markup.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST document the canonical type scale (display title, entry title, impact metric, eyebrow, meta, body, sub-detail) with the exact sizes/weights/tracking.
- MUST list the role-class vocabulary and state which element each role is for and its canonical value.
- MUST state the token-usage rules (colour via semantic tokens only; fonts via the three faces) and that font sizes must come from the canonical scale.
- MUST reference the enforcing guard (ESLint custom rule) so readers know drift is checked.
- MUST stay consistent with the values defined in task 01 and the cv-visual-design type-scale amendment.
</requirements>

## Subtasks
- [x] 9.1 Write the canonical type scale table.
- [x] 9.2 Document the role-class vocabulary and intended use per role.
- [x] 9.3 State token-usage and font-size rules and reference the guard.
- [ ] 9.4 Cross-check the spec against the shipped global.css roles. BLOCKED — task_01's `@layer components` block is unshipped, so there are no shipped roles to cross-check against; the harness (`tests/style-spec.test.mjs`) is authored and its 2 cross-check tests stay red until task_01 lands (proven green against a simulated post-task_01 stylesheet via `SPEC_TEST_CSS`).

## Implementation Details
Add a markdown spec under `docs/`. Reference, do not duplicate, the TechSpec.
Keep values in sync with the `@layer components` block from task 01.

### Relevant Files
- (new) `docs/style-spec.md` — the written canonical style spec.

### Dependent Files
- `src/styles/global.css` — the spec must match the role definitions there.

### Related ADRs
- [ADR-001: one cohesive pass](../adrs/adr-001.md) — requires a written spec.
- [ADR-002: @apply role classes](../adrs/adr-002.md) — the vocabulary documented here.

## Deliverables
- A `docs/style-spec.md` covering the scale, role vocabulary, and token rules.
- Unit tests with 80%+ coverage **(REQUIRED)** — consistency checks (see Tests).
- Integration tests for spec/code consistency **(REQUIRED)**.

## Tests
- Unit tests:
  - [ ] Every role in `global.css` `@layer components` is documented in the spec.
  - [ ] Every canonical size in the spec matches a value used by a role class.
- Integration tests:
  - [ ] No size or role appears in the spec that is absent from the shipped global.css (manual or scripted cross-check).
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- The spec accurately and completely describes the shipped role system and scale.
