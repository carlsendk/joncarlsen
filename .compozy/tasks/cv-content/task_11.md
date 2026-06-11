---
status: pending
title: Add the optimized headshot to the Hero via astro:assets
type: frontend
complexity: low
dependencies:
  - task_06
---

# Task 11: Add the optimized headshot to the Hero via astro:assets

## Overview
Add an optional, build-time-optimized headshot to the frontpage hero using Astro's
`<Image>` component, with the source in `src/assets/`. This is the Danish-norm photo
touch (PRD Core Feature 8). It is gated on the owner supplying a headshot file (see
PRD Open Questions).

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST render the headshot with `astro:assets` `<Image>` from a source in `src/assets/`, with explicit width/height (no layout shift), descriptive `alt`, and modern output formats.
- The photo MUST appear on the frontpage hero only; `/cv` MUST stay clean for parsing/print.
- The hero MUST degrade gracefully when no photo is present (optional rendering), so MVP is unaffected.
- MUST NOT regress the frontpage Lighthouse performance bar.
- BLOCKED until the owner supplies a real headshot file; until then, implement the optional rendering path and verify with a stand-in image, and document the gap.
</requirements>

## Subtasks
- [ ] 11.1 Add an optional photo import and `<Image>` render path to `Hero.astro`.
- [ ] 11.2 Set explicit dimensions, descriptive alt, and frontpage-only placement.
- [ ] 11.3 Confirm graceful no-photo fallback.
- [ ] 11.4 Verify performance is not regressed (with the supplied or stand-in image).

## Implementation Details
Modify `src/components/Hero.astro` to optionally render `<Image>` from
`src/assets/`. Reference the TechSpec photo decision (Technical Considerations).
Owner must provide the real file; note the blocker in tracking if still missing.

### Relevant Files
- `src/components/Hero.astro` — hero to extend with the optional photo.
- `src/assets/` — image source directory for `astro:assets`.
- `src/pages/index.astro` — frontpage that shows the hero (task_06).

### Dependent Files
- `src/pages/index.astro` — visually affected by the photo.

### Related ADRs
- [ADR-002: Single public leadership identity](../adrs/adr-002.md) — photo is not a contact detail; identity reinforcement.

## Deliverables
- An optional optimized headshot in the frontpage hero via `astro:assets`.
- Graceful no-photo fallback preserved **(REQUIRED)**.
- Performance-not-regressed evidence **(REQUIRED)**.

## Tests
- Unit tests:
  - [ ] With a photo present, the hero renders an optimized `<Image>` with explicit width/height and non-empty `alt`.
  - [ ] With no photo, the hero renders without error and without an empty image slot.
  - [ ] The photo renders on `/` only; `/cv` markup contains no headshot.
- Integration tests:
  - [ ] `astro build` exits 0 and emits an optimized image asset.
  - [ ] Lighthouse performance on `/` holds the project bar (no CLS regression) with the image present.
- Test coverage target: >=80% (photo-present and photo-absent paths exercised).
- All tests must pass.

## Success Criteria
- All tests passing
- Test coverage >=80%
- An optimized headshot appears on the frontpage hero without regressing performance; `/cv` stays clean; absent-photo path is safe.
