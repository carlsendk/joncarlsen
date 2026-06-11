# Task Memory: task_02.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot
- Upper-band batch: add `id="<slug>"` on `<section>` + optional guarded `leadIn` to Summary(summary), Credentials(credentials), Impact(impact), Expertise(expertise), Timeline(experience), CaseStudies(work), Approach(approach). Mirror task 03's exact pattern. Done.

## Important Decisions
- Mirrored task 03 literal markup verbatim: `{leadIn && <p class="cv-lead">{leadIn}</p>}` directly after `<h2>`, no `mt-*`.
- CaseStudies.astro had NO `Props`/`Astro.props` before — added `interface Props { leadIn?: string }` + `const { leadIn } = Astro.props` in its frontmatter.

## Learnings
- node --test runs test files in PARALLEL. cv-structure-03's integration `before()` builds into default `dist/`; a second integration test building into the same `dist/` races and clobbers (both builds fail with status 1, no stderr under stdio:"ignore"). Fix: cv-structure-02 builds into a private outDir via `npx astro build --outDir <os.tmpdir()/cv-structure-02-dist>` and reads from there. Any future build-in-test must use its own outDir.

## Files / Surfaces
- src/components/{Summary,Credentials,Impact,Expertise,Timeline,CaseStudies,Approach}.astro
- tests/cv-structure-02.test.mjs (new; 67 tests)

## Errors / Corrections
- Open risk in shared MEMORY said "3 PRE-EXISTING failing tests"; actual baseline is 4 (added "the near-eyebrow labels are preserved inline (no role adopted)"). All 4 are in cv-roles-conversion-* and present WITHOUT my edits (verified by stashing). Corrected shared memory.

## Ready for Next Run
- Task 04 can now pass `leadIn` props to all 7 upper-band components from `sectionLeadIns`.
