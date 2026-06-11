# Workflow Memory

Keep only durable, cross-task context here. Do not duplicate facts that are obvious from the repository, PRD documents, or git history.

## Current State

- cv-content-improve task_01..task_07 done but uncommitted (auto-commit off; stacked in the working tree). task_07: added `src/content/work/dfds-platform.md` (second featured case study, `order: 2`, company DFDS); exercises multi-entry sort/grouping; all gates green. (Note: the `cv-content task_0N` entries in `git log` are the PRIOR cv-content workflow, unrelated numbering.) task_01: `work` schema extended (`company` required, `featured`, `themes`, `skills`); `axon-ai-platform.md` migrated. task_02: `cv.ts` gained `themes`/`skills` on Role/Highlight, `Interest` type + `interests` data. task_03: `Interests.astro` + wired into `cv.astro` (`/cv` only). task_04: `src/pages/projects.astro` (`/projects` index grouped by `company`, reuses `CaseStudyCard`, back-link to `/cv`). task_05: `CaseStudies.astro` filters `work` to `featured && !draft` and appends a "See all projects" link to `/projects` (link sits inside the section, so the empty-featured guard hides both). task_06: deepened `cv.ts` hero/summary/bullets and the AXON body to the senior-leadership bar under the voice rules (AXON case study only).

## Shared Decisions

- Tag vocabulary is free-form (ADR-004); recommended themes documented as a comment near the fields, not enforced. AXON used: themes ai-llm/cloud-realtime-data/org-scaling/platform-devex/transformation.

## Shared Learnings

- Verification toolchain: no unit-test runner. Gates are `npx astro check` (Result summary is authoritative: want 0 errors/0 warnings), `npx astro build` (exit 0), and content greps.
- `astro check` quirk: `tsconfig.json` uses `include: ["**/*"]` (excludes only `dist`), so it crawls the gitignored local-only `docs/` dir (untracked minified JS) and CRASHES. Run check with `docs/` temporarily moved aside to mirror a clean checkout/CI. `astro build` is unaffected.
- `astro check` reports `ts(6385) 'z' is deprecated` hints on every `z` usage from `astro:content` (Astro 6 deprecation). Counted as hints, not warnings — does not fail the 0-warnings gate. Pre-existing.
- Link integrity: `linkinator` 7.6.1 runs via `npx` (not in `node_modules`) against a running `astro preview` (e.g. `--port 4399`, `--recurse --skip 'joncarlsen.dk'`). Lighthouse is NOT installed; the project carries no audit tooling, so perf/a11y is argued from reuse of the AA-verified pattern, not measured.
- Voice gate is a manual read, not a grep: `furthermore|moreover` and em-dashes already pass at baseline, so a green grep proves nothing about hitting the bar. The discriminating tell is parallel triads (three grammatically parallel phrases for rhythm). Factual N-item tech/deliverable lists (e.g. "React, serverless, headless CMS") are enumerations, not triads — leave them. The metrics "strip" on a `/work/<slug>` page is rendered by `[slug].astro` from frontmatter `metrics` in the header, above the body; the body itself leads with `## Context`.
- To exercise multi-entry behaviour (grouping, draft exclusion) while the repo has one real `work` entry, add throwaway fixture md files, build, capture HTML, then delete before the final build. Do not leave permanent stubs (ADR-002/003).

## Open Risks

- `docs/` not in `tsconfig` `exclude` — every later task that runs `astro check` must relocate `docs/` or the check crashes. Candidate one-line fix (add `docs/` to exclude) deferred as out-of-scope follow-up.

## Handoffs

- Featured surfacing wired (task_05): a new `work` entry needs `featured: true` to appear on `/` and `/cv`; otherwise it shows only on `/projects`.
- Schema is ready for task_07 (new `work` entries must satisfy the extended schema, incl. required `company`).
