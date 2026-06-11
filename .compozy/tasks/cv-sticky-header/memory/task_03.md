# Task Memory: task_03.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

- Delete the duplicate inline back-link `<nav>` block from the four secondary pages; header (task_02) now supplies the single contextual back-link. Done.

## Important Decisions

- Proceeded despite `_tasks.md` listing task_02 as `pending`: task_02's implementation is present in the working tree (Header rendered in `Base.astro:74`, ThemeToggle/global.css modified, uncommitted), so the back-link dependency is functionally satisfied. Did not touch/expand into task_02.

## Learnings

- Built HTML serves back-link `<a>` href as the bare path (`/`, `/cv`) — no trailing slash on the target attribute, even though pages themselves are served with trailing slash.
- The `←` arrow is multibyte; `grep -oE '.{N}...'` context matching across it returns nothing. Use Python regex (or fixed-string grep) to assert href targets in built HTML.

## Files / Surfaces

- `src/pages/cv.astro`, `src/pages/impact.astro`, `src/pages/work/index.astro`, `src/pages/work/[slug].astro` — each lost its `<nav class="mx-auto max-w-2xl px-6 pt-6">…</nav>` block (8 lines each, 32 deletions total). `index.astro` untouched.

## Errors / Corrections

- First linkinator run omitted the skip list and reported 26 `joncarlsen.dk` 404s (production-domain canonical links, pre-existing). Correct invocation is the `netlify.toml:6` gate: `linkinator@6.1.2 ./dist --recurse --skip '(^https?://(www\.)?linkedin\.com|^https?://(www\.)?joncarlsen\.dk)'` → 35 links, 0 broken.

## Ready for Next Run

- Feature complete. Each route shows exactly one (header) back-link with correct target; check/build/linkinator all green. Diff left uncommitted (auto-commit disabled).
