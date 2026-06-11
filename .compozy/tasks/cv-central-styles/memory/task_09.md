# Task Memory: task_09.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot
- Publish `docs/style-spec.md`: canonical type scale, role-class vocabulary, token-usage rules, reference to the ESLint guard. Plus REQUIRED consistency tests cross-checking the spec against the shipped `global.css @layer components` roles.

## Important Decisions
- Authored the spec NOW from pinned sources (techspec Data Models scale + ADR-002 role names + shipped markup), per techspec build-order step 8 ("authored in parallel, finalised after step 4"). Did NOT author role classes in global.css — that is task_01's scope.
- 6 of 12 role VALUES (`cv-link`, `cv-pill`, `cv-pill-solid`, `cv-card`, `cv-badge`, `cv-metric`) are not pinned in any readable source; they are extracted from markup during task_01. Documented their names/intent but marked the values `_pending task 01 extraction_` rather than inventing them.

## Learnings
- Canonical type SCALE ≠ set of role-class size values. Two scale tiers carry no role-class size: Display title (`text-5xl`/`text-6xl`) is styled INLINE on hero `h1` (no `cv-display` role); Body prose `text-base` is the INHERITED default of `cv-body` (`@apply leading-relaxed`, no literal size). The consistency test must exempt both or it churns red forever even after task_01. Spec encodes this in the scale table's "Applied via" column + a `(default)` marker on the body size; the test reads those to skip the right tiers.
- Shipped scale grounded in markup: display title `font-display text-5xl font-semibold tracking-tight … sm:text-6xl`; impact metric `font-display text-2xl font-semibold tracking-tight text-accent sm:text-3xl`. Case-study `h1` is `text-4xl`/`sm:text-5xl` — that is the documented drift task_01 raises to the canonical display tier.
- Test harness has `SPEC_TEST_CSS` env override (simulated post-task_01 global.css) proving it reaches 6/6 green once the role layer ships.

## Files / Surfaces
- (new) `docs/style-spec.md` — the spec.
- (new) `tests/style-spec.test.mjs` — 6 tests: 4 internal-consistency (green now), 2 cross-check (red until task_01).

## Errors / Corrections
- First test draft asserted every scale size appears literally in a role class → red on `text-base`/`cv-body` by construction. Fixed by the `(default)` exemption above.

## Ready for Next Run
- BLOCKED on task_01: success criteria require "all tests passing" and an accurate description of the SHIPPED role system. With no `@layer components` block, the 2 cross-check tests are red and the 6 role values are unpinned. task_09 status left `pending`.
- When task_01 ships: re-run `node --test "tests/**/*.test.mjs"`; fill the 6 pending role values in `docs/style-spec.md` from the shipped `@apply` definitions; expect 6/6 green; then complete task_09.
