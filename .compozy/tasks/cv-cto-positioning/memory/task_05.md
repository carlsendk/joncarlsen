# Task Memory: task_05.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

- Wire CTO sections into `/cv` and front-load the frontpage. DONE.
- `cv.astro`: pass `scope` to Hero; Credentials after Summary (high); Approach after Impact (before CaseStudies); pass `about`/`talks`.
- `index.astro`: pass `scope` to Hero; add Summary after Hero (front-loads exec summary + scope before Impact).

## Important Decisions

- Did NOT populate `about`/`talks` — task_06 owns content population (and depends on task_05); ADR-002 forbids invented content. Approach therefore renders empty in the shipped state, which is the correct final state for task_05.
- Credentials placed directly after Summary = "high"; Approach after Impact — both per the spec's explicit placement guidance.

## Learnings

- Approach wiring is unverifiable from shipped dist (about/talks empty → component self-guards to nothing). Verified the wiring with the repo's temp-injection idiom: set a real-prose `about` + one `talks` item, build, confirmed Approach renders in order `impact → approach → work`, reverted. cv.ts left clean.
- Lighthouse a11y on `/` = 0.95 (perf 1.0) due to a PRE-EXISTING initial-paint color-fade artifact, NOT a real defect and NOT introduced by task_05: the global `transition: color 0.3s` (global.css ~143) is caught mid-fade by axe; reported colors (#1e2024/#25272b) are transition intermediates, not steady tokens. Pristine pre-change `/` also scored 0.95 (6 nodes); my Summary addition reduced it to 2 nodes. Steady-state contrast (Playwright, fade settled) is AA in both themes: dark muted 7.37:1, fg 15.31:1; light muted 7.58:1, fg 17.85:1.
- `/cv` Lighthouse a11y = 1.0, perf = 1.0.

## Files / Surfaces

- `src/pages/cv.astro` — imports + places Credentials, Approach; passes scope to Hero. (+11/-1)
- `src/pages/index.astro` — imports + places Summary; passes scope to Hero. (+9/-1)
- No change needed to print CSS or components (verified): new sections reuse the print-covered `.reveal`/`border-t` pattern.

## Errors / Corrections

- Initial linkinator run hit a stale dev server on 4321/4322 (dev-only @vite/client 404s); my `astro preview` actually bound 4323. Re-ran against 4323 (prod build) → 15 links, all 200.

## Ready for Next Run

- task_06 (content): when `about`/`talks` get real prose, Approach auto-renders after Impact on `/cv` (wiring confirmed). Recast `summary`/`valueProp` will flow to both pages (single-sourced).
- FOLLOW-UP (not task_05 scope): the global `transition: color 0.3s` on body/section/p/h* makes Lighthouse a11y report a dark-theme contrast false-positive on initial paint (steady state is AA). Owner of the theme transition / a polish task could suppress the transition on first paint (e.g. a `no-transition` class removed after load) to make Lighthouse a11y hit 1.0 on `/`.
