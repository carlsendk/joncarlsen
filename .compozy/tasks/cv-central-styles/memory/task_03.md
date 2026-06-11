# Task Memory: task_03.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot
- Convert 6 entry/list components (Timeline, Education, VoluntaryLeadership, Publications, Certifications, PersonalDetails) to consume cv-* role classes from task_01 (cv-section, cv-eyebrow, cv-entry-title, cv-meta, cv-body, cv-detail, cv-link).
- Education activities -> cv-detail (14px); dates/periods -> cv-meta (canonical tracking). Preserve PersonalDetails dt/dd alignment.

## Important Decisions
- Did NOT author role classes in global.css here: task spec lists global.css as a dependent file "not edited here". Authoring it would silently expand into task_01's scope. Same decision task_02 reached.
- DRIFT DECISION (institution/dd/company body line-height): measured baseline (Playwright on dist /cv) — Education institution, PersonalDetails dd, and Timeline company all have lineHeight 24px (text-base default / inherited), NOT leading-relaxed. Applying cv-body (which @applies leading-relaxed) raises them to 26px. Treated as an INTENDED drift-collapse-to-canonical: task_01 + type-scale amendment fix the canonical body role at leading-relaxed, so divergent body lines snapping to 26px IS the enumerated drift correction ("fixing drift as each adopts a role"). All OTHER cv-body targets (scope, bullets, vol detail, pub/cert ul) already measure 26px → cv-body is a pure no-op there. cv-detail (edu activities 14px/22.75px) and cv-meta (all 0.6px tracking) are no-ops too.
- COMPANY decision: Timeline company line is byte-identical to Education institution (`text-base text-fg`, same entry secondary-line role). Spec's relevant-files note lists company under Timeline scope generally but only annotates institution as cv-body. Chose to convert company -> cv-body too (slight scope addition beyond the literal list) because shipping a 2px split between two structurally identical lines in a consistency-normalization task is the exact drift this PRD kills. Recorded deliberately.

## Learnings
- UNBLOCKED: task_01 role layer now shipped in global.css (@layer components, all 12 cv-* roles). Conversion proceeding.
- All 6 target components exist under src/components/.
- Baseline computed styles captured via Playwright against dist preview (port 4327) — see Errors/Corrections-free parity table; re-measure after conversion for 3.4.

## Files / Surfaces
- Converted: src/components/{Timeline,Education,VoluntaryLeadership,Publications,Certifications,PersonalDetails}.astro
- Added tests: tests/cv-roles-conversion.test.mjs (10 tests) + tests/fixtures/cv-roles-computed.json (before/after Playwright snapshot).
- Evidence: .compozy/tasks/cv-central-styles/task_03-baseline.json (pre-change baseline).
- Dependency (read-only): src/styles/global.css (task_01 role layer).

## Errors / Corrections
- None. Parity confirmed: every measured element byte-identical before/after EXCEPT the 3 documented body lines (24px->26px line-height). No unexpected diffs.

## Ready for Next Run
- task_03 DONE (2026-06-11). Full gate green: lint exit 0 (39 class-order WARNs, intentionally WARN), check 0 errors, build exit 0 (27 pages), test 29 pass/0 fail.
- Sibling conversions 02/04/05 still pending; task_08 promote-to-error still gated on ALL of 02-05 (this is 1 of 4).
- No commit created (--auto-commit=false). Diff left for manual review.
