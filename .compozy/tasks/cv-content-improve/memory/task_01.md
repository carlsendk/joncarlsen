# Task Memory: task_01.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

Extend the `work` Zod schema with `company` (required), `featured` (bool, default false), `themes`/`skills` (string[], default []); migrate `axon-ai-platform.md` frontmatter. Done.

## Important Decisions

- Field order in schema: company, featured, themes, skills inserted after `period`, before `metrics` (matches techspec).
- AXON themes from ADR-004 vocab: ai-llm, cloud-realtime-data, org-scaling, platform-devex, transformation. Skills (free-form, no defined vocab): ai-ml, real-time-data, cloud-architecture, go, engineering-leadership.
- Recommended theme vocabulary documented as a comment above the tag fields (ADR-004), not enforced.

## Learnings

- `npx astro check` only passes cleanly when the gitignored local-only `docs/` dir is relocated: `tsconfig.json` uses `include: ["**/*"]` (excludes only `dist`), so it crawls untracked minified JS under `docs/` and crashes. `astro build` is unaffected (only builds `src/pages`).
- `astro check` Result summary is authoritative: 0 errors, 0 warnings, 16 hints. The 16 hints are `ts(6385) 'z' is deprecated` on every `z` usage (importing `z` from `astro:content` is deprecated in Astro 6); pre-existing (baseline 10, mine 16 after adding 6 z uses). Labelled "warning" per-line but counted as hints.

## Files / Surfaces

- `src/content.config.ts` — extended `work` schema + vocab comment.
- `src/content/work/axon-ai-platform.md` — frontmatter only (company/featured/themes/skills); body untouched (deepened in task_06).

## Errors / Corrections

- company-required proof: stripping `company` → build fails `InvalidContentEntryDataError ... **company**: Required`; restored → exit 0.
- Defaults proof: throwaway entry omitting featured/themes/skills builds exit 0 (deleted after).

## Ready for Next Run

- Schema ready for task_04 (`/projects` groups by `company`), task_05 (`featured`), task_07 (new entries must satisfy extended schema).
- Follow-up (not done, out of task_01 scope): add `docs/` to `tsconfig.json` `exclude` so `astro check` runs without relocating it.
