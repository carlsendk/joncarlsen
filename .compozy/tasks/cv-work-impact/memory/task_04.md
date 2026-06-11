# Task Memory: task_04.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

- Repoint Impact band (home + `/cv`) at derived `leadImpactItems()`; retire
  `cvData.impact` + `Highlight`. Single-source model (ADR-003/004). DONE.

## Important Decisions

- Band secondary line changed from prose (`max-w-prose leading-relaxed text-muted`)
  to a mono uppercase company label, wrapped with the metric in one `/work/<slug>`
  anchor. Forced by ADR-004 figures-only rule; metric-led accent figure preserved.
- Pages compute `const leadImpact = await leadImpactItems()` in frontmatter rather
  than inlining the await in JSX (readability; Astro supports top-level await).
- No `isReady` filter in the new `Impact.astro`: work `metrics[]` never carry the
  `[TODO]` sentinel (shared memory), so derived items are always safe.

## Learnings

- Verified render: both home and `/cv` show identical 4-company band — AXON
  (50,000 datapoints/s → axon-ai-platform), DFDS (500+ microservices →
  dfds-platform), Lunar (~50 people → lunar-platform-experience), Scrive (ISO 27001
  → scrive-kubernetes-iso27001). Distinct from timeline bullet prose: no duplication.
- Band has 4 internal links, 0 `http` links, so the `global.css` print rule (URL
  suffix on `a[href^="http"]` only) leaves it clean.

## Files / Surfaces

- `src/components/Impact.astro` — rewritten: prop `items: ImpactItem[]`, metric +
  company in a `/work/<slug>` anchor, no client JS.
- `src/pages/index.astro`, `src/pages/cv.astro` — import `leadImpactItems`, feed
  `leadImpact` to `<Impact items=.../>`.
- `src/data/cv.ts` — removed `impact` field, `Highlight` interface, `impact` array.

## Errors / Corrections

- Scoped `astro check` first reported 17 false `implicit any` errors because the
  `src/**/*`-only include dropped `.astro/types.d.ts`. Fixed by adding
  `.astro/types.d.ts` + `env.d.ts` to include → 0 errors. Corrected the shared
  MEMORY.md workaround in place so task_05 doesn't hit the same trap.

## Ready for Next Run

- task_05 (`/impact` page) can reuse the `Impact.astro` item rendering pattern
  (metric + company + `/work/<slug>` link) and the same scoped type-check recipe.
