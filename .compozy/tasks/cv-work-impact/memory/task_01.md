# Task Memory: task_01.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

- Done: `Role.bullets` → `Bullet[]`; all 8 roles migrated to `{ text, work? }`;
  `Timeline.astro` full variant renders `bullet.text` with optional `/work/<slug>` link.

## Important Decisions

- Slug mapping (each linked bullet's text verified present in the case-study body):
  - AXON → all 6 bullets `axon-ai-platform`.
  - Lunar → 3 bullets `lunar-platform-experience`; the eID-outcome bullet →
    `lunar-eid-consolidation` (names eID explicitly; surfaces that dedicated study).
  - Scrive → all 5 bullets `scrive-kubernetes-iso27001` (one is a `[TODO]` draft,
    dropped by `isReady` at render but still carries the slug).
  - DFDS Platform → all 4 `dfds-platform`.
  - DFDS CX → 3 `dfds-responsive-web-platform`, "DFDS Way" bullet → `dfds-way-of-working`.
  - Ørsted → SCRUM/offshore 2 `orsted-agile-scrum-transformation`, VPP bullet
    `orsted-virtual-power-plant`, DMS bullet `orsted-distribution-management-system`.
  - Heeplink, eSignatur → no case study, bullets left unlinked (no-link branch).
- Kept `Highlight`/`cvData.impact` in `cv.ts` — removal is task_04, out of scope.

## Learnings

- `Timeline.astro` was the only `.bullets` consumer (grep confirmed). The
  `isReady` filter runs for both variants and now reads `bullet.text`.
- Verification commands and the `astro check` OOM workaround promoted to shared MEMORY.md.

## Files / Surfaces

- `src/data/cv.ts` — added `Bullet`; `Role.bullets: Bullet[]`; migrated all roles.
- `src/components/Timeline.astro` — filter on `bullet.text`; render text + optional link.

## Errors / Corrections

- Repo `npm run check` OOM-crashes (untracked `docs/` JS); see shared MEMORY.md workaround.

## Ready for Next Run

- Data model + Timeline ready. task_03 (`src/lib/impact.ts`) can read finalized
  work metrics; task_04 removes `Highlight`/`impact` and rewires `Impact.astro`.
