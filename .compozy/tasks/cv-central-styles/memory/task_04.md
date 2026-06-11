# Task Memory: task_04.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot
- DONE (2026-06-11): Converted CaseStudies, CaseStudyCard, Impact, Links + impact.astro and work/index.astro to cv-* role classes. task_01 was confirmed shipped before starting (stale "blocked" notes from the earlier halted run were superseded).

## Important Decisions
- Impact-item heading "drift" is STRUCTURAL, not pixel: the hand-rolled company/title line (`font-mono text-xs uppercase tracking-wider text-muted`) already equalled cv-meta's canonical values. Adopting cv-meta is a zero-computed-change no-op that removes the drift risk. Did NOT promote it to cv-eyebrow (font-medium/[0.2em]) — that would be a non-enumerated visible change, violating the parity requirement.
- CORRECTION to task_04 spec wording: req says "keep per-instance colour utilities (e.g. cv-metric uses text-accent) in markup", but shipped global.css BAKES text-accent into cv-metric and text-bg into cv-pill-solid (task_01, intrinsic). Resolved toward the shipped design + ADR-002 + task_03 precedent: baked invariant colours DROPPED from markup (text-accent off cv-metric, text-bg off cv-pill-solid, text-muted off cv-eyebrow/cv-meta); genuinely per-instance colours KEPT (text-fg on cv-entry-title/cv-pill, text-muted on cv-body/cv-badge). Computed style identical either way (expand() re-supplies the baked colour). Keeping text-accent would have been inconsistent with dropping text-muted on cv-meta in the same batch.
- "See all" CTA links (CaseStudies, Impact) map to cv-link, NOT cv-meta (per task_01 1.4 mapping): they keep their meta-typography (`font-mono text-xs uppercase tracking-wider text-muted`) inline beside cv-link. So that typography string is intentionally NOT in this task's grep-forbidden list.
- Impact-item WRAPPER link (`group block focus-visible:outline-*`) left inline (NOT cv-link): cv-link would wrongly add motion-safe:transition-colors + hover:text-accent it doesn't have.
- Empty-state sections/paragraphs (companies.length===0 branch) also converted (cv-section / cv-body) for grep-cleanliness even though they never render with current data.

## Learnings
- Links section keeps `pb-24` after `reveal cv-section pb-24`: utilities layer beats components-layer py-14, computed padding-bottom verified 96px live.
- Conversion REDUCED lint warnings ~47→33 (removed duplicated/off-tier strings). All remaining are `enforce-consistent-class-order` (WARN until task_08); `reveal cv-section` order matches task_03 convention.

## Files / Surfaces
- src/components/CaseStudies.astro, CaseStudyCard.astro, Impact.astro, Links.astro
- src/pages/impact.astro, src/pages/work/index.astro
- tests/cv-roles-conversion-04.test.mjs + tests/fixtures/cv-roles-computed-04.json (new)

## Errors / Corrections
- Earlier run's "HALTED/blocked on task_01" notes were stale; task_01 shipped 2026-06-11. Proceeded.

## Ready for Next Run
- task_04 DONE. Full gate green (lint/check/build/test exit 0; 41 tests pass). Pure no-op: Playwright before/after byte-identical on /cv, /impact, /work.
- Remaining conversion: task_02 and task_05. After all conversions land, task_08 can promote canonical-scale + class-order lint warn→error, and task_09 doc-tidy.
