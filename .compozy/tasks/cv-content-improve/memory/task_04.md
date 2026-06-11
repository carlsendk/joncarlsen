# Task Memory: task_04.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

Done. `/projects` index lists every non-draft `work` entry grouped by `company`, each linking to its `/work/<slug>` deep page; back-link to `/cv`; no client JS; no contact details.

## Important Decisions

- Reused `CaseStudyCard.astro` unchanged for per-entry cards (already renders title/role·period/summary/metrics and links to `/work/<id>`).
- Determinism: entries within a company sort by `order` asc (mirrors CaseStudies); companies sort by their lowest-`order` entry, tie-break `localeCompare(b, "en")` (locale pinned for build stability).
- Company `<h2>` uses the shared section-label style (mono/uppercase/tracking) to match the design system; h1 "Projects" → h2 company → h3 card title.
- Added an empty-state guard ("No projects published yet.") so the route never renders blank.

## Learnings

- Verified multi-company grouping + draft exclusion with two TEMP fixture md files (`_fixture-dfds.md` second company, `_fixture-draft.md` draft) since the repo has only one non-draft entry; deleted both before final build. Real DFDS work is task_07 — do not leave permanent stubs (ADR-002/003).
- linkinator 7.6.1 runs via `npx` (not in node_modules) against `astro preview`; Lighthouse is not installed.

## Files / Surfaces

- Added `src/pages/projects.astro` (only file changed by this task).

## Errors / Corrections

## Ready for Next Run

task_05 adds the "See all projects" link to `/projects` from `CaseStudies.astro` and filters that listing to `featured === true`.
