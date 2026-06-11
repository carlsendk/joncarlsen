---
status: completed
title: Define role-class layer in global.css and collapse drift to canonical values
type: refactor
complexity: medium
dependencies: []
---

# Task 1: Define role-class layer in global.css and collapse drift to canonical values

## Overview
Create the single source of truth for styling: a `@layer components` block in
`src/styles/global.css` with one named class per recurring UI role, each built
with `@apply` over the exact utilities in use today. This task establishes the
vocabulary every later conversion task consumes and fixes the canonical value of
each role so drift collapses to one definition.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST define role classes in a single `@layer components` block inside `src/styles/global.css` (the file that imports Tailwind), so `@apply` resolves without `@reference`.
- MUST cover the role vocabulary named in the TechSpec "System Architecture": cv-section, cv-eyebrow, cv-entry-title, cv-body, cv-meta, cv-link, cv-pill, cv-pill-solid, cv-card, cv-badge, cv-metric, cv-detail.
- MUST set each role to its canonical value per the cv-visual-design type-scale amendment (one body size 16px, one eyebrow tracking, one meta tracking, consistent heading weights).
- MUST keep per-instance colour (text-fg / text-muted) OUT of the role classes so one role serves both foreground and muted contexts.
- MUST NOT create a role for a pattern that does not genuinely recur (no one-off classes).
- MUST produce compiled CSS that introduces no new visual output by itself (classes defined but not yet applied).
</requirements>

## Subtasks
- [x] 1.1 Catalogue each recurring role and its single canonical utility string from the current components.
- [x] 1.2 Resolve the known drift to one value per role (eyebrow tracking-[0.2em]+font-medium; meta tracking-wider; body text-base; entry-title weight).
- [x] 1.3 Add the `@layer components` block with all role classes via `@apply`.
- [x] 1.4 Decide and document which existing occurrences map to cv-eyebrow vs cv-meta (e.g. Hero title line, impact-item heading). — mapping recorded in memory/task_01.md (subtask 1.4 section).
- [x] 1.5 Build and confirm each role class appears in the compiled CSS.

## Implementation Details
Add the role classes to `src/styles/global.css` after the existing `@layer base`
block. Use `@apply` over the current utility strings (see TechSpec "Core
Interfaces" for the contract shape). Colour utilities stay in markup. No component
is edited in this task — conversion happens in tasks 02–05.

### Relevant Files
- `src/styles/global.css` — the central stylesheet; gains the `@layer components` role block.

### Dependent Files
- `src/components/*.astro`, `src/pages/**`, `src/layouts/Base.astro` — will consume these classes in later tasks (not edited here).

### Related ADRs
- [ADR-001: Centralise styling in one cohesive pass](../adrs/adr-001.md) — establishes the named-class vocabulary as source of truth.
- [ADR-002: @apply component classes in global.css](../adrs/adr-002.md) — fixes the mechanism this task implements.

## Deliverables
- A `@layer components` block in `global.css` defining all roles in the vocabulary with canonical values.
- A short in-file comment per role noting its canonical value and intended use.
- Documented eyebrow-vs-meta occurrence mapping (in the task notes or a code comment).
- Unit tests with 80%+ coverage **(REQUIRED)** — see Tests (build/compile assertions stand in for unit tests on this CSS-only task).
- Integration tests for role-class compilation **(REQUIRED)**.

## Tests
- Unit tests:
  - [x] Build succeeds (`npm run build`) with the new `@layer components` block present. — exit 0, 27 pages.
  - [x] Each role class name appears in the compiled `dist` CSS. — all 12 grep-confirmed in dist/_astro/*.css.
  - [x] No `@apply` references an unknown utility (build would otherwise fail). — build green; reveal/link-underline intentionally left in markup, not @applied.
- Integration tests:
  - [x] Spot-check computed values of the canonical roles match the type-scale amendment (e.g. cv-body resolves to 16px Hanken; cv-eyebrow to 12px mono tracking-[0.2em]). — verified from compiled CSS (cv-eyebrow 12px mono .2em muted; cv-body leading-relaxed inheriting 16px text-base; cv-metric text-2xl accent). tests/style-spec.test.mjs cross-checks now green.
- Test coverage target: >=80% (all defined roles exercised by the compile/spot-check)
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Every role in the vocabulary is defined exactly once with its canonical value.
- Build is green; no visual change yet (classes defined, not applied).
