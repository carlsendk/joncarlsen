# Task Memory: task_01.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot
Done. Added `SectionSlug`/`SectionLeadIns`/`NavGroup`/`CollapseConfig` types + `sectionLeadIns`/`navGroups`/`collapseConfig` values to `cv.ts`, and `.cv-lead` to `global.css`. Data-only; nothing renders it yet.

## Important Decisions
- `sectionLeadIns` provided for 9 sections; omitted summary, certifications, publications, personal, links (would restate the heading) — allowed by ADR-004.
- `.cv-lead` = `@apply max-w-prose leading-relaxed text-muted` (body scale, muted invariant baked in like cv-eyebrow/cv-meta; mt-* spacing left to consuming markup in tasks 02/03).

## Learnings
- Required side-edit to keep tests green: adding a new `cv-*` role forces documenting it in `docs/style-spec.md` (role-vocab table) AND adding it to `CANONICAL_ROLES` in `tests/style-spec.test.mjs`. The spec/CSS/list are kept in bidirectional sync by `style-spec.test.mjs`. This was a forced consequence of the guard, not scope expansion.
- Node v26 strips TS types on import, so tests can `import('../src/data/cv.ts')` directly for runtime data assertions (no loader/flag needed). New test: `tests/cv-structure-01.test.mjs`.

## Files / Surfaces
- `src/data/cv.ts` (types after CvData; values after cvData)
- `src/styles/global.css` (`.cv-lead` in @layer components)
- `docs/style-spec.md` (cv-lead vocab row), `tests/style-spec.test.mjs` (CANONICAL_ROLES)
- `tests/cv-structure-01.test.mjs` (new, 9 tests)

## Errors / Corrections
- None.

## Ready for Next Run
- Baseline has 3 PRE-EXISTING failing tests in `tests/cv-roles-conversion-02.test.mjs` (Hero/Header class-string assertions; `src/components/Hero.astro` + `Header.astro` are modified in the working tree, unrelated to cv-structure). Do not attribute these to cv-structure work.
- `docs/style-spec.md` still carries a stale "Status — pending task 01" note referring to the *cv-central-styles* task 01 (already shipped); left as-is. Optional cleanup, not required.
