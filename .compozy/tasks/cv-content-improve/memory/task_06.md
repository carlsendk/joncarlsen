# Task Memory: task_06.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

- Deepen existing copy to a senior-leadership bar: hero `valueProp`, `summary`, role `bullets` in `cv.ts`, and the AXON case-study body. Real figures only; voice rules enforced. Scope is AXON only (DFDS study is task_07, not this task).

## Important Decisions

- Hero/summary anchored on concrete sourced figures (50,000/s per device, 3→20, ~200 engineers / 500+ microservices kept as distinct claims, ~50-person orgs at Scrive/Lunar). Closed summary with the owner's own "leave an organisation a maturity stage further along" line from leadership-narrative.md.
- AXON metrics strip "leads" via the `[slug].astro` header (renders frontmatter `metrics` above the body), so the body keeps `## Context` first. No body-level metrics strip needed.
- Reverted "Advised the founders" (Heeplink) to "Advised on..." — source says only "Advisory Board Member", who was advised is unsourced.

## Learnings

- Voice gate is manual, not grep: `furthermore|moreover` and em-dash already pass at baseline, so green grep proves nothing. The real failure mode is parallel triads — fixed three (summary close, two Lunar bullets, DFDS-CX bullet, AXON "What I did"/Outcome). Factual N-item tech/deliverable lists (e.g. "React, serverless, headless CMS") are enumerations, not rhetorical triads — left intact.
- AXON body ~275 words = ~60-90s read; within target.

## Files / Surfaces

- `src/data/cv.ts` — valueProp, summary, AXON/Heeplink/Lunar/DFDS-CX bullets rewritten (Scrive, DFDS-DevEx, Ørsted bullets already concrete, left as-is).
- `src/content/work/axon-ai-platform.md` — body deepened (frontmatter untouched).

## Errors / Corrections

- `grep -c "—" $F` with two files in one var arg mis-parses under ugrep; pass files as explicit args.

## Ready for Next Run

- task_07 (DFDS featured case study) is the remaining deep-copy work the techspec build-order step 6 bundled; deliberately NOT done here.
- Source figures for Scrive SLA/cost remain absent (about-me.md flags them); kept qualitative — do not invent in later edits.
