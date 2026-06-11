# Task Memory: task_05.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

- Done: `/impact` page grouping `impactItems()` by company, each metric deep-linked
  to `/work/<slug>`; "see all impact →" link added to the shared Impact band.

## Important Decisions

- `/impact` renders the item markup INLINE per company group (not by reusing
  `Impact.astro` as a component — that would emit a duplicate "Impact" h2 per
  company). Item visual classes are byte-identical to `Impact.astro` for real
  consistency.
- Secondary line under each metric is the case-study `title` (not `company`):
  company is already the group heading, so repeating it 3× under AXON is
  redundant; `title` gives each link a distinct accessible name. ImpactItem
  carries `title` for exactly this.
- "see all impact →" placed inside `Impact.astro` (shared component), so it
  appears once on home and once on `/cv` with no per-page edits; absent on
  `/impact` itself.
- Grouping mirrors `projects.astro`: Map by company + explicit
  `items[0].order || localeCompare("en")` sort (deterministic, even though
  `impactItems()` is already order-sorted). companyId() id scheme reused.
- No draft fixture authored: the `!data.draft` exclusion is inherited from
  `impactItems()` (task_03), verified there; adding a throwaway draft entry
  would pollute real content/dist (YAGNI, consistent with prior tasks).

## Learnings

- Spec's "10 metrics" is stale; content derives **11** (AXON 3, DFDS 3+2,
  Lunar 1, Scrive 2). Honored 11. Already flagged in shared MEMORY.

## Files / Surfaces

- New: `src/pages/impact.astro`.
- Modified: `src/components/Impact.astro` (added band → `/impact` link).

## Errors / Corrections

- None.

## Ready for Next Run

- task_06 (hard-rename `/projects` → `/work`) is independent of this; `/impact`
  links only to `/work/<slug>` which already resolve. `CaseStudies.astro` still
  points at `/projects` and is task_06's concern, not touched here.
