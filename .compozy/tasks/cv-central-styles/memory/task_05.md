# Task Memory: task_05.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot
- Convert work/[slug].astro + page shells (cv.astro, index.astro, Base.astro) to cv-* role classes; bind case-study article body to canonical cv-body (16px). Review ThemeToggle (likely leave inline).

## Important Decisions
- UNBLOCKED (2026-06-11): task_01 role layer is shipped. Executing the conversion.
- TWO accepted drifts this batch owns: (1) article body→cv-body (16px) — but ALREADY 16px at HEAD (commit 6bd12c0 dropped text-lg lead tier), so binding cv-body is computed-identical NOW; capture before=after=16px and say so. (2) case-study h1 `text-4xl…sm:text-5xl`→`text-5xl…sm:text-6xl` canonical display collapse — this is the off-scale drift eslint.config.mjs:115 + task_08 memory explicitly assign to conversion 02-05; h1 stays INLINE (no cv-display role), matches work/index + impact h1s byte-for-byte.
- `role · period` meta line in [slug] uses `tracking-[0.2em]` (eyebrow spacing, no font-medium) — matches NO role; tracking-[0.2em] is in ALLOWED_ARBITRARIES so it is NOT drift to clear. LEFT INLINE. Same tracking-[0.2em] reused intentionally in the `[&_h2]` prose rule — do NOT add that cluster to the grep-forbidden list.
- Header.astro is ORPHANED (untracked new file, in no task's relevant-files; task_02 owns Hero/Summary/Approach/Credentials/Expertise/Interests). Nav links were extracted to Header after the PRD. Mandate "convert nav links" now points there → converted its 3 nav links (back-link + 2 profile icon links) to cv-link as PURE no-ops (cv-link only @applies the interaction cluster all 3 already carried). Home identity link left inline (group-hover, not hover → adding cv-link would add utilities, not a no-op).
- cv.astro + Base.astro: composition-only, zero role utilities in markup — no edits. ThemeToggle: one-off control — left inline.

## Files / Surfaces
- Edited: src/pages/work/[slug].astro, src/pages/index.astro, src/components/Header.astro.
- Reviewed, no edit: src/pages/cv.astro, src/layouts/Base.astro, src/components/ThemeToggle.astro.
- Tests: tests/cv-roles-conversion-05.test.mjs + tests/fixtures/cv-roles-computed-05.json.

## Errors / Corrections
- (cleared) Prior blocker (missing role layer) resolved by task_01.

## Follow-ups (out of scope, surfaced not silenced)
- Header.astro `text-[0.625rem]` (10px micro-label, line 57) is below the canonical floor (text-xs=12px). Clearing it is a VISIBLE design change, not a no-op — needs a design decision on the target size. task_08 lists it (with the now-fixed h1 text-4xl) as drift conversion must clear before promoting local/canonical-scale to error. Leaving it means task_08 promotion stays blocked on this one literal.
- Header icon links keep `hover:bg-fg/5` + layout inline beside cv-link; no recurring icon-button role defined — fine to leave, revisit if a 2nd icon-button cluster appears.
