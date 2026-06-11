# Task Memory: task_07.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

Add a second featured `work` entry: the DFDS platform transformation case study. Done.

## Important Decisions

- Sourced the case study on the DFDS "Head of Department, Developer & Platform Experience" role (Nov 2017–Mar 2021), period rendered as "2017-2021" to mirror AXON's "2023-Present".
- `order: 2` (AXON is 1), so AXON precedes DFDS on `/` and `/projects`.
- Title "Moving a ferry and logistics business to cloud-native" is descriptive, not a metric (allowed); all figures (500+ microservices on K8s from zero, 3→20 dept, ~200 engineers, DFDS Horizon 200 nominees) trace to `cv.ts`.
- themes platform-devex/org-scaling/transformation, skills kubernetes/microservices/platform-engineering/engineering-leadership — copied from the matching `cv.ts` role.

## Learnings

- Confirmed memory's surfacing claims: `featured: true` makes a `work` entry appear on `/` and `/cv` (via CaseStudies.astro) and `company` groups it on `/projects` (id `company-<slug>`, here `company-dfds`).

## Files / Surfaces

- Added `src/content/work/dfds-platform.md` (only file changed for this task).

## Errors / Corrections

- None.

## Ready for Next Run

- Two featured case studies now exist (AXON order 1, DFDS order 2); multi-entry sort/grouping exercised and green.
