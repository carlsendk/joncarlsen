# Task Memory: task_06.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

Hard-rename `/projects` → `/work` (no redirect, ADR-005); update the one internal
link. Done.

## Important Decisions

- Rendered output of the index kept identical (H1/title still "Projects ·") per the
  test "same output as the old /projects"; only the route path and comments changed.
  The grep test targets the `/projects` path string, not the word, so this is clean.

## Learnings

- Moving `projects.astro` one dir deeper to `work/index.astro` required rewriting its
  three relative imports `../layouts|components|data` → `../../...` (matched the sibling
  `work/[slug].astro` depth). Build does NOT error on a wrong path here until it can't
  resolve — caught by checking the sibling before editing.

## Files / Surfaces

- `src/pages/projects.astro` → `src/pages/work/index.astro` (git mv; imports + lead
  comment updated). Coexists with `work/[slug].astro`.
- `src/components/CaseStudies.astro`: href `/projects`→`/work`, label "See all work,
  grouped by company →", comment.
- Comment-only `/projects` refs also updated: `src/pages/impact.astro` (x2),
  `src/content.config.ts` (x1) — needed for the zero-refs grep test.
- `netlify.toml` untouched (no redirect, ADR-005).

## Errors / Corrections

- None.

## Ready for Next Run

- task_06 done. `/work` is the live index URL; no `/projects` anywhere in src/dist.
