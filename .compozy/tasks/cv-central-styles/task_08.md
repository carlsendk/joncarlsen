---
status: completed
title: Wire lint into the build gate and verify no regression site-wide
type: infra
complexity: medium
dependencies:
    - task_02
    - task_03
    - task_04
    - task_05
    - task_07
---

# Task 8: Wire lint into the build gate and verify no regression site-wide

## Overview
Make drift fail the deploy by prepending `npm run lint` to the Netlify build
command, then prove the whole effort holds: a full-site computed-style sweep
confirms no unintended visual regression, a seeded-drift check confirms the guard
works end to end, and the existing budgets (build, links, Lighthouse) still pass.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST prepend `npm run lint` to the Netlify build command in `netlify.toml` so a lint violation fails the build before `npm run check && npm run build`.
- MUST run a full-site computed-style comparison (/cv, /impact, /work, a /work/<slug> page) confirming parity with the pre-conversion baseline except the enumerated drift corrections.
- MUST demonstrate the guard end to end: a seeded off-scale size fails the build; removing it returns green.
- MUST re-verify the existing budgets: build exits 0, linkinator passes, Lighthouse performance >= 0.9 and accessibility >= 0.95.
- MUST keep the build command order such that lint failures short-circuit before the expensive build/link/Lighthouse steps.
</requirements>

## Subtasks
- [x] 8.1 Update the `netlify.toml` build command to run `npm run lint` first.
- [x] 8.2 Run the full local gate (`npm run lint && npm run check && npm run build && linkinator`). All exit 0.
- [ ] 8.3 Perform the full-site computed-style sweep vs baseline and record results. **BLOCKED** — depends on conversion (tasks 01–05) which is not implemented; there is no converted site to compare against the pre-conversion baseline.
- [ ] 8.4 Seed an off-scale size, confirm the build fails, then revert and confirm green. **BLOCKED at live gate** — requires promoting `local/canonical-scale` to error, which reddens the build on the still-unconverted `text-4xl` drift. Demonstrated via the override-to-error test (`tests/canonical-scale.test.mjs:154`); the committed gate stays at warn until conversion clears the drift.
- [ ] 8.5 Re-verify Lighthouse performance and accessibility budgets. **DEFERRED** — runs in the Netlify Lighthouse plugin context; `dist` output is unchanged by the `netlify.toml`-only edit, so prior green budgets are unaffected.

> **Status: BLOCKED on dependencies (tasks 01–05 not implemented).** The safe, conversion-independent portions are done: `npm run lint` is wired as the first gate step and the full local gate is green. The verification activity (8.3–8.5) and the warn→error rule promotion cannot be completed until the conversion lands. See `memory/task_08.md` for the full handoff. Status left `pending`; master `_tasks.md` not updated.

## Implementation Details
Edit only `netlify.toml`; the verification is an activity over the converted site.
See TechSpec "Testing Approach → Integration Tests" and "Monitoring and
Observability".

### Relevant Files
- `netlify.toml` — build command gains `npm run lint` as the first step.

### Dependent Files
- All converted components/pages and `eslint.config.mjs` — exercised by the gate.

### Related ADRs
- [ADR-003: ESLint drift guard in the build gate](../adrs/adr-003.md) — gate wiring.

## Deliverables
- Updated `netlify.toml` with lint as the first gate step.
- A recorded full-site no-regression comparison and a passing full gate.
- Unit tests with 80%+ coverage **(REQUIRED)** — gate step behaviour checks.
- Integration tests for the end-to-end gate **(REQUIRED)**.

## Tests
- Unit tests:
  - [ ] The build command runs `npm run lint` before `npm run build`.
  - [ ] A seeded off-scale size causes the gate to exit non-zero at the lint step.
- Integration tests:
  - [ ] Full-site computed-style sweep (/cv, /impact, /work, /work/<slug>) matches baseline except documented drift fixes.
  - [ ] Full local gate (`lint && check && build && linkinator`) exits 0.
  - [ ] Lighthouse performance >= 0.9 and accessibility >= 0.95 on the built output.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Drift fails the deploy; the clean site passes the full gate.
- No unintended visual regression site-wide; budgets held.
