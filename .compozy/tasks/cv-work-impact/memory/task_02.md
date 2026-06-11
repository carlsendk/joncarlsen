# Task Memory: task_02.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

- Ensure every real `cvData.impact` figure exists in the matching work entry's
  `metrics[]` before task_04 removes the curated list. Content-only; no `cv.ts` edit.

## Important Decisions

- `cvData.impact` actually holds 7 entries, not the "five" the brief states: 6 real
  figures + 1 draft (`[TODO: budget owned]`). Enumerated all rather than trusting the
  count. 5 of 6 real figures already lived on work metrics; only `5 → 25` was missing.
- `5 → 25` (DFDS Customer Experience scaling) → added to
  `dfds-responsive-web-platform.md` (the flagship CX deliverable, order 3), NOT
  `dfds-way-of-working.md`. Precedent: the parallel `3 to 20 person department`
  figure lives on the flagship `dfds-platform.md`, not a ways-of-working entry.
- Phrased as `"5 to 25 person Customer Experience department"` (not bare "5 to 25"):
  `/impact` groups by company, so DFDS would show two adjacent "N to M person
  department" pills; the CX qualifier disambiguates per ADR-002.
- `[TODO: budget owned]` deliberately NOT migrated. It is a draft sentinel, not a
  real figure. Work `metrics[]` have no `isReady` guard (the guard at cv.ts:154
  only filters cvData arrays), so the sentinel would render as a literal pill.
  task_04 drops it with the list; that is correct, not a migration miss.

## Learnings

- Confirmed work metric pills render the raw frontmatter string with no draft guard.

## Files / Surfaces

- Edited: `src/content/work/dfds-responsive-web-platform.md` (+1 metric line).
- Read-only: `src/data/cv.ts` (impact source), other `work/*.md`, `content.config.ts`.

## Errors / Corrections

- None.

## Ready for Next Run

- task_03 (`src/lib/impact.ts`) can read finalized work metrics: each company now
  has ≥1 metric except the two non-metric Ørsted/DFDS-WoW/Lunar-eID entries (by
  design). dfds-responsive-web-platform now has 2 metrics (≤3 guideline holds).
