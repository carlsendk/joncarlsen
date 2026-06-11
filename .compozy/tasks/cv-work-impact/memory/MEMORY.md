# Workflow Memory

Keep only durable, cross-task context here. Do not duplicate facts that are obvious from the repository, PRD documents, or git history.

## Current State

- task_06 done: index hard-renamed `/projects` → `/work` (no redirect, ADR-005).
  `src/pages/projects.astro` → `src/pages/work/index.astro` (imports rebased to
  `../../`, coexists with `work/[slug].astro`). `CaseStudies.astro` now links `/work`
  ("See all work, grouped by company →"). Zero `/projects` refs remain in src/dist
  (comment refs in `impact.astro`/`content.config.ts` updated too). `netlify.toml`
  untouched. Index rendered output unchanged (H1/title still "Projects").
- task_05 done: `/impact` (`src/pages/impact.astro`) renders all 11 `impactItems()`
  grouped by company (AXON 3, DFDS 3+2, Lunar 1, Scrive 2; Ørsted absent), each
  metric deep-linked to `/work/<slug>`, secondary line is the case-study `title`.
  Grouping mirrors `projects.astro` (Map + `order||localeCompare` sort). A
  "see all impact →" link was added inside `Impact.astro`, so it shows on home and
  `/cv` only. No client JS.
- task_04 done: home + `/cv` Impact band now feed `await leadImpactItems()` to
  `Impact.astro` (prop is `items: ImpactItem[]`); `cvData.impact` and the `Highlight`
  interface are removed from `cv.ts`. Band renders 4 companies (AXON, DFDS, Lunar,
  Scrive), figures-only (metric + company), each a `/work/<slug>` link, no client JS.
  `isReady` stays exported (still used by Timeline/Credentials/Approach). Pages compute
  `const leadImpact = await leadImpactItems()` in frontmatter (Astro top-level await).
- task_02 done: every real `cvData.impact` figure now lives on a work entry's
  `metrics[]` (5 already present; `5 → 25` added to `dfds-responsive-web-platform.md`
  as "5 to 25 person Customer Experience department"). The 7th impact entry,
  `[TODO: budget owned]`, was deliberately NOT migrated — it is a draft sentinel,
  not a real figure, and task_04 drops it with the list (not a migration miss).

## Shared Decisions

- `Role.bullets` is now `Bullet[]` (`{ text: string; work?: string }`) in
  `src/data/cv.ts` (task_01). The `work` field is a `work`-collection slug (file id
  under `src/content/work/`). `Highlight`/`cvData.impact` were intentionally left in
  place — their removal is task_04, not task_01.
- All 10 work case studies have at least one inbound bullet link from `/cv`.
  Heeplink and eSignatur roles have no case study, so their bullets stay unlinked.

## Shared Learnings

- Derived impact counts (task_03 `src/lib/impact.ts`): current content yields
  **11** `impactItems()` (AXON 3, DFDS 5 = platform 3 + responsive 2, Lunar 1,
  Scrive 2) and **4** `leadImpactItems()` (AXON, DFDS, Lunar, Scrive; Ørsted has
  no metric and is absent). The PRD/task test count of "10 / DFDS-responsive 1" is
  stale — it predates task_02 adding DFDS-responsive's "5 to 25" metric. The module
  derives from content; do NOT alter it to force 10. task_04/05 tests should expect
  11 (all) and 4 (lead).
- Work `metrics[]` pills render the raw frontmatter string with NO `isReady` guard
  (the cv.ts:154 guard only filters cvData arrays). Never put a `[TODO: ...]` sentinel
  into a work entry's frontmatter — it would render literally on the card/header/`/impact`.
- `npm run check` (`astro check`) OOM-crashes in this working tree: `tsconfig.json`
  uses `include: ["**/*"]` with only `dist` excluded, so it scans ~49M of untracked
  `docs/` plus `.claude` minified JS and runs out of heap. To get a clean type-check
  for src changes: temporarily set tsconfig `include` to
  `["src/**/*", ".astro/types.d.ts", "env.d.ts"]` and `exclude`
  `node_modules docs .claude .compozy .playwright-mcp dist`, then run `npx astro check`,
  then restore (`cp` a backup back). The `.astro/types.d.ts` entry is REQUIRED — it
  holds the `astro:content` augmentation; dropping it makes every `getCollection`
  call report false `implicit any` errors (17 in task_04, all spurious). Generate
  the types first (`npx astro sync` or any build) so `.astro/types.d.ts` exists.
  `npm run build` is unaffected and passes normally — but note `astro build` does NOT
  fail on type errors, so the build is not a substitute for the type-checker.
- `linkinator dist` reports false 404s on each page's canonical absolute URL
  (`https://joncarlsen.dk/...`) because it fetches them over the network. Verify
  internal links with `npx linkinator dist --recurse --skip "joncarlsen.dk"`.

## Open Risks

## Handoffs
