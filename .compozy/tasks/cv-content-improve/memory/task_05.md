# Task Memory: task_05.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

Done. `CaseStudies.astro` filters `work` to `featured && !draft` (then sorts by `order`) and appends a "See all projects" link to `/projects` inside the Selected Work section. Both `/` and `/cv` keep `<CaseStudies />` with no props.

## Important Decisions

- Link placed inside the `<section>` (after the `<ul>`), so it disappears together with the section when no entry is featured — single empty-state guard covers both.
- Link text: "See all projects, grouped by company →" (descriptive, matches the /projects grouping). Styled with the existing `.link-underline` utility (global.css:151) + accent/focus tokens, mirroring the /projects back-link.

## Learnings

- Empty-featured verified by temporarily flipping the only featured entry (axon) to `featured: false`, rebuilding, confirming "Selected Work" absent, then restoring. Non-featured omission verified with a throwaway `zzz-fixture-nonfeatured.md` (present on /projects, absent on / and /cv).

## Files / Surfaces

- `src/components/CaseStudies.astro` (only file changed).

## Errors / Corrections

- None.

## Ready for Next Run

- Featured-surfacing complete. task_07 (new `work` entries, e.g. DFDS) just needs `featured: true` to appear on / and /cv; otherwise they show only on /projects.
