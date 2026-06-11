---
status: completed
title: Add ESLint toolchain with stock Tailwind plugin
type: infra
complexity: medium
dependencies:
  - task_01
---

# Task 6: Add ESLint toolchain with stock Tailwind plugin

## Overview
Introduce ESLint (flat config) with the Astro parser and a Tailwind class-linting
plugin to a previously lint-free repo, exposed as `npm run lint`. This provides
class-hygiene enforcement (validity, ordering, no contradictions, arbitrary-value
restriction) and is the base the custom canonical-scale rule (task 07) plugs into.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST add ESLint 9 flat config (`eslint.config.mjs`), the Astro parser/plugin, and a Tailwind v4-compatible class-linting plugin as devDependencies.
- MUST add an `npm run lint` script scoped to `src/`.
- MUST configure stock rules for class hygiene (valid classes, ordering, no contradicting classnames, arbitrary-value handling) with an allowlist for documented system arbitraries (e.g. tracking-[0.2em]).
- MUST pin versions compatible with Astro 6 and ESLint 9 flat config.
- MUST pass cleanly on the converted source (run after tasks 02–05 land, or against task_01 output plus current markup) without blocking legitimate existing classes.
- MUST NOT yet enforce the canonical font-size scale (that is task 07).
</requirements>

## Subtasks
- [x] 6.1 Select and pin compatible ESLint, Astro parser, and Tailwind plugin versions.
- [x] 6.2 Author `eslint.config.mjs` flat config scoped to `src/`.
- [x] 6.3 Configure stock Tailwind rules and the arbitrary-value allowlist.
- [x] 6.4 Add the `lint` script to package.json.
- [x] 6.5 Run lint on source and resolve any legitimate-class false positives via config.

## Implementation Details
Create `eslint.config.mjs` and update `package.json`. See TechSpec "Development
Sequencing" step 5 and ADR-003 implementation notes for package candidates.

### Relevant Files
- `eslint.config.mjs` — new flat config.
- `package.json` — new devDeps + `lint` script.

### Dependent Files
- `src/**/*.astro` — linted by the new config.
- `netlify.toml` — will invoke `npm run lint` in task 08 (not edited here).

### Related ADRs
- [ADR-003: ESLint drift guard in the build gate](../adrs/adr-003.md) — toolchain decision.

## Deliverables
- A working `eslint.config.mjs` and `npm run lint` that passes on the converted source.
- Pinned, compatible devDependency versions.
- Unit tests with 80%+ coverage **(REQUIRED)** — lint pass/fail behaviour checks.
- Integration tests for the lint script **(REQUIRED)**.

## Tests
- Unit tests:
  - [x] `npm run lint` exits 0 on the current/converted source.
  - [x] A deliberately invalid/contradicting class (e.g. an unknown utility) is reported by lint.
  - [x] A documented arbitrary (tracking-[0.2em]) is NOT reported.
- Integration tests:
  - [x] `npm run lint` runs over all `src/**/*.astro` without crashing on Astro syntax (parser works).
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- `npm run lint` is available, scoped to src, and green on the converted source.
- Stock class-hygiene rules are active with the arbitrary-value allowlist.
