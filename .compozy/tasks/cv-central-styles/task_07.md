---
status: completed
title: Add custom canonical-scale ESLint rule
type: infra
complexity: medium
dependencies:
  - task_06
---

# Task 7: Add custom canonical-scale ESLint rule

## Overview
Add the project-specific guard the stock plugin cannot provide: a custom ESLint
rule that flags any font-size utility outside the canonical scale and any colour
literal used directly in markup. This enforces the exact drift signals that
motivated the effort.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST implement a custom ESLint rule that reports font-size utilities outside the canonical allowlist (text-xs, text-sm, text-base, text-xl, text-2xl, text-3xl, text-5xl, text-6xl) when used in markup.
- MUST report colour literals in markup (e.g. `#hex`, `rgb(`, arbitrary `text-[#...]`, named-colour utilities) — semantic token utilities (text-accent, text-fg, etc.) MUST pass.
- MUST accept an options shape matching the TechSpec "Core Interfaces" CanonicalScaleOptions (allowed sizes, allowed arbitraries, banColorLiteralsInMarkup).
- MUST be wired into `eslint.config.mjs` from task 06.
- MUST ship RuleTester unit tests covering valid and invalid cases.
- MUST allow role classes themselves (cv-*) and documented arbitraries without false positives.
</requirements>

## Subtasks
- [x] 7.1 Implement the custom rule (size-scale + colour-literal detection) with options. → `eslint-rules/canonical-scale.mjs`
- [x] 7.2 Register the rule in the flat config and enable it for `src/`. → `local/canonical-scale` at warn in `eslint.config.mjs`
- [x] 7.3 Write RuleTester cases for valid and invalid inputs. → `tests/canonical-scale.test.mjs`
- [x] 7.4 Run lint on the source and confirm zero violations. `npm run lint` exits 0 (0 errors). The one new warning is the genuine `text-4xl` drift in `work/[slug].astro:25`, owned by the not-yet-run conversion task_05 — the rule correctly flags it; it is not a violation of this task.

## Implementation Details
Add the rule (local plugin/module) and reference it from `eslint.config.mjs`. See
TechSpec "Core Interfaces" for the options type and "Testing Approach → Unit
Tests" for the required RuleTester cases.

### Relevant Files
- `eslint.config.mjs` — registers and enables the custom rule.
- (new) local rule module + its test file — the rule and RuleTester suite.

### Dependent Files
- `src/**/*.astro` — subject to the rule.

### Related ADRs
- [ADR-003: ESLint drift guard with a custom canonical-scale rule](../adrs/adr-003.md) — fixes this rule's scope.

## Deliverables
- A custom ESLint rule enforcing the canonical font-size scale and banning colour literals in markup.
- RuleTester test suite for the rule.
- Unit tests with 80%+ coverage **(REQUIRED)**.
- Integration tests for the rule within the flat config **(REQUIRED)**.

## Tests
- Unit tests (RuleTester):
  - [x] `text-lg` in markup is reported; `text-base` is not.
  - [x] `text-[#1d4ed8]` / a `#hex` in markup is reported; `text-accent` is not.
  - [x] A documented arbitrary (tracking-[0.2em]) and cv-* role classes are not reported.
  - [x] Options (allowed sizes / allowed arbitraries) are respected.
- Integration tests:
  - [x] `npm run lint` with the custom rule enabled exits 0 on the source (0 errors; rule ships at warn during the conversion window, matching the class-order convention).
  - [x] Re-introducing an off-scale size makes lint exit non-zero — verified by the "task 08 gate" integration test that bumps the rule to error via `overrideConfig` and asserts errorCount > 0. The shipped severity is warn until task_08 promotes it once conversion (02–05) is complete.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- The custom rule flags off-scale sizes and colour literals and passes on the clean source.
