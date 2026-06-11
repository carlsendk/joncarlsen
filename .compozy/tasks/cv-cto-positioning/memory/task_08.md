# Task Memory: task_08.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

- Create `content-gaps.md`: prioritised supply checklist, one-to-one with the seeded `[TODO]` markers in `cv.ts`. Planning artifact only, no contact details, voice rules.

## Important Decisions

- 4 checklist entries, one per marker token (not the memory's earlier "3"): the Scrive bullet holds two distinct figures (`[TODO: SLA % after]`, `[TODO: cost reduction %]`), so each gets its own entry. Test counts markers, not gaps.
- Excluded the 2 comment-block hits (`cv.ts:133` `[TODO: ...]`, `cv.ts:134` `[TODO: % YoY]`): illustrative ADR-003 doc examples, not seeded content. Classified explicitly in the file so a naive grep (6 hits) reconciles with 4 entries.
- Hiring velocity / retention (named in PRD/ADR-002) have NO marker yet, so kept OUT of the bijective checklist (would break "every entry has a marker"). Noted in a separate non-counting section.
- Priority order: budget owned > cost reduction % > SLA % after > board/investor cadence (matches PRD example ordering; budget/P&L is the top CTO signal).

## Learnings

- "Where it lands" cites field + line (e.g. `impact[6].metric`, `cv.ts:394`) so the owner can jump straight to each marker.

## Files / Surfaces

- Created: `.compozy/tasks/cv-cto-positioning/content-gaps.md` (planning artifact, outside src/public). No code edits.

## Errors / Corrections

- None.

## Ready for Next Run

- All gates PASS: marker↔entry one-to-one (4/4), each entry has Supply/Where/Why (4/4/4), em-dash 0, contact-leak 0, `astro build` exit 0 with content-gaps absent from dist. Not committed (auto-commit off).
- Re-verified fresh this run (file found pre-existing from an interrupted run; verified line-by-line, not overwritten). Scope the dist placeholder check to `find dist -iname 'content-gaps*'` (=0); a global dist `[TODO` grep gives false hits from the throwaway `a11y-harness*`/`scope-harness*` routes.
- Follow-up (NOT this task): shared-memory L40 assigns harness-route deletion to "task_08", but this task_08 spec is the checklist only. Plan/numbering drift — harness cleanup (`src/pages/a11y-harness*.astro`, `scope-harness*.astro`) belongs to the final build/verification task; those routes still emit `[TODO` into dist.
