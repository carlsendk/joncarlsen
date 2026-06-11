# Task Memory: task_08.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot
- Wire `npm run lint` into the netlify.toml build gate (first step), then verify no site-wide regression: full-site computed-style sweep vs pre-conversion baseline, seeded-drift end-to-end guard check, and existing budgets (build/links/Lighthouse) still pass.

## Important Decisions
- DID: prepend `npm run lint` to the netlify.toml build command (+ updated the gate comment). Correct independent of conversion state; keeps the gate green today (lint exits 0) and won't need redoing post-conversion. Satisfies subtasks 8.1, and 8.2 (full local gate lint&&check&&build&&linkinator all exit 0).
- DID: added tests/netlify-gate.test.mjs — static assertions that the build command runs `npm run lint` first (before check/build/linkinator) and is `&&`-chained. 3 new tests, all green.
- DID NOT promote `local/canonical-scale` or `enforce-consistent-class-order` warn→error. Promoting canonical-scale to error reddens the build on the still-present `text-4xl` (confirmed flagged by the rule). That clearing is conversion scope (01–05), not task_08.

## Learnings
- Ground truth 2026-06-10: NO cv-* classes in src (task_01 not implemented). Off-scale drift still present: `text-4xl` work/[slug].astro:25 (flagged by local/canonical-scale), `text-[0.625rem]` Header.astro:57 (flagged by no-restricted-classes arbitrary rule). Conversion tasks 01–05 NOT done.
- `npm run lint` exits 0 today (48 warnings, 0 errors). Custom `local/canonical-scale` is at WARN, so a seeded off-scale size (text-lg) only warns — does NOT fail the live build. `--max-warnings 0` exits 1.
- task_07 already shipped a forward-looking test "integration (task 08 gate): promoted to error, an off-scale size fails lint" (canonical-scale.test.mjs:154) using `overrideConfig` — proves the guard works end-to-end WITHOUT reddening the committed config. Covers requirement 3's unit-test intent at the current warn-level state.

## Files / Surfaces
- netlify.toml — build command now `npm run lint && npm run check && npm run build && linkinator`; comment updated.
- tests/netlify-gate.test.mjs — NEW, build-command ordering assertions.

## Errors / Corrections

## Ready for Next Run
- BLOCKED on conversion (01–05). Requirements NOT completable now:
  - 8.3 full-site computed-style sweep vs pre-conversion baseline "except enumerated drift corrections" — vacuous: no conversion happened, current state IS the baseline; the netlify.toml edit does not change dist output.
  - 8.4 live seeded-drift gate (off-scale size fails the COMMITTED build) — requires canonical-scale at error, which reddens on unconverted `text-4xl`. Demonstrated only via override-to-error test, not the live gate.
  - 8.5 Lighthouse perf>=0.9 / a11y>=0.95 — runs in Netlify plugin context; not run locally. dist unchanged by this edit so output is unchanged from prior green deploys.
- Scope note (report, don't silently resolve): task spec says "Edit only netlify.toml" and lists eslint.config.mjs as a dependent (not edited) file, but requirement 3 + eslint.config.mjs:113-117 comment + shared memory all require promoting rules IN eslint.config.mjs once conversion is clean. Promotion is task_08's job but gated on 01–05.
- Next run after 01–05 land: (1) promote local/canonical-scale + enforce-consistent-class-order warn→error in eslint.config.mjs; (2) confirm lint exits 0 on clean source; (3) run the live seeded-drift check (seed text-lg → build red → revert → green); (4) full-site computed-style sweep vs baseline; (5) re-verify Lighthouse budgets.
