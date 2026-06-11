# Task Memory: task_04.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot
Reorder `src/pages/cv.astro` `<main>` to the PRD section order (Impact + Expertise
above Timeline; Approach below CaseStudies) and pass each section
`leadIn={sectionLeadIns.<slug>}`. Single-file integration point.

## Important Decisions
- BLOCKED, not started. Working tree left untouched (no `cv.astro` edit). Status
  kept `pending`; `_tasks.md` not modified.

## Learnings
- `sectionLeadIns` (cv.ts:786) has 9 entries: credentials, impact, expertise,
  experience, work, approach, education, voluntary, interests. 6 of these
  (credentials, impact, expertise, experience, work, approach) belong to the
  upper-band components owned by task_02.

## Files / Surfaces
- `src/pages/cv.astro` — intended sole edit; current `<main>` order is Summary →
  Credentials → Timeline → Impact → Approach → CaseStudies → Expertise → … (lines
  41-56). NOT edited.

## Errors / Corrections
- **Blocked on unmet dependency task_02.** task_04 declares
  `dependencies: [task_02, task_03]`. task_03 is done, task_01 is done, but
  **task_02 is still pending** — the run order skipped it (ran 01 → 03 → 04).
- Verified the 7 upper-band components (Summary, Credentials, Impact, Expertise,
  Timeline, CaseStudies, Approach) do NOT yet: (a) carry a section-level anchor
  `id="<slug>"` (only `id="<slug>-heading"` on the `<h2>`), nor (b) destructure a
  `leadIn` prop. Those are task_02's edits.
- Consequence: task_04's REQUIRED integration tests cannot pass —
  "14 section anchor ids in order" and "Impact/Expertise before experience"
  reference ids that don't exist for the upper band; 6 of 9 lead-ins would render
  nothing. A reorder-only partial pass was rejected (can't reach success criteria;
  wiring `leadIn` onto components that ignore it produces a misleading diff).
- Doing task_02's component work here is explicitly forbidden by the task spec
  ("MUST NOT alter component internals (those are tasks 02/03/05)").

## Ready for Next Run
- Execute **task_02** first (upper-band anchors + lead-ins, mirroring task_03's
  literal `{leadIn && <p class="cv-lead">{leadIn}</p>}` pattern), THEN (re-)run
  task_04. No other dependency is missing.
