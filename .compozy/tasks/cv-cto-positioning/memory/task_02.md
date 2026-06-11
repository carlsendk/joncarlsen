# Task Memory: task_02.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

- Wire the task_01 `isReady` guard into Timeline (`role.bullets`) and Impact (`highlights`). Done.

## Important Decisions

- Timeline: filter bullets once in frontmatter via `shown = limited.map(r => ({...r, bullets: r.bullets.filter(isReady)}))`, so the length guard and `.map` stay in sync (no empty `<ul>` if all bullets are drafts). `role.scope` left ungated (spine field).
- Impact: drop a highlight only when metric OR summary holds the sentinel → `highlights.filter(h => isReady(h.metric) && isReady(h.summary))`.

## Learnings

- "Ready items unchanged" proven cleanly: current content has zero markers, so the filter is a no-op → before/after `/cv` and `/` HTML are byte-identical. Stronger than counting.
- Guard tested by temporarily adding a `[TODO]` bullet + highlight, building, confirming dist had no sentinel while sibling ready items still rendered; markers then removed.

## Files / Surfaces

- `src/components/Timeline.astro`, `src/components/Impact.astro` (import `isReady`, filter arrays). Call sites/props unchanged.

## Errors / Corrections

- zsh: `grep --include=*.html` needs quotes (`'*.html'`); unquoted glob errors with "no matches found".

## Ready for Next Run

- task_03 (Approach/Credentials) and task_04 (scope) still pending; both consume the same `isReady` pattern shown here.
