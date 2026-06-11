---
status: completed
title: Add the Approach and Credentials sections
type: frontend
complexity: medium
dependencies:
  - task_01
---

# Task 3: Add the Approach and Credentials sections

## Overview
Add the two CTO-signal sections: an Approach section that renders the leadership
vision (`about`) and thought-leadership writing (`talks`), and a Credentials
section that renders the curated executive `credentials`. Both match the existing
section design and drop any draft `[TODO]` item (ADR-003).

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST create `src/components/Approach.astro` that renders `about` (narrative) and `talks` (writing references), reusing the section pattern: `<section aria-labelledby="approach-heading" class="reveal mx-auto max-w-2xl border-t border-border px-6 py-14">` with a matching `<h2 id="approach-heading">`.
- MUST create `src/components/Credentials.astro` that renders `credentials` with a unique heading anchor (`credentials-heading`), reusing the same section pattern.
- MUST filter `talks` and `credentials` items through `isReady`, and render nothing when the relevant field is empty or absent (guarded), consistent with other sections.
- MUST use unique heading anchor ids not used by any other section, tokens only, and no client JS.
- MUST surface the published writing as an external-brand link where appropriate, and introduce no contact details (ADR-002).
</requirements>

## Subtasks
- [x] 3.1 Create `Approach.astro` rendering `about` and `talks` (isReady-filtered).
- [x] 3.2 Create `Credentials.astro` rendering `credentials` (isReady-filtered).
- [x] 3.3 Use unique heading ids and the shared section markup.
- [x] 3.4 Guard empty/absent states to render nothing.
- [x] 3.5 Confirm both match the design system in both themes.

## Implementation Details
Create `src/components/Approach.astro` and `src/components/Credentials.astro`.
Mirror the markup of an existing section component (for example `Certifications.astro`
or `Expertise.astro`). Import `isReady` from `src/data/cv.ts`. Wiring into pages is
task_05. See the TechSpec "System Architecture" (new sections).

### Relevant Files
- `src/components/Certifications.astro`, `src/components/Expertise.astro` — markup pattern to mirror.
- `src/data/cv.ts` — provides `about`, `talks`, `credentials`, and `isReady`.
- `src/components/Links.astro` — existing pattern for outbound links (writing).

### Dependent Files
- `src/pages/cv.astro` (task_05) — renders both sections.

### Related ADRs
- [ADR-001: Re-pitch the canonical CV to CTO altitude](adrs/adr-001.md) — vision + credentials are core signals.
- [ADR-003: Draft-gated placeholders](adrs/adr-003.md) — isReady filtering.

## Deliverables
- `Approach.astro` and `Credentials.astro`, matching the design system.
- isReady filtering and empty-state guards in both.
- Render and accessibility verification evidence **(REQUIRED)**.

## Tests
- Unit tests (render/markup verification):
  - [x] `Approach` renders the `about` text and each ready `talks` item; a `[TODO]` writing item is absent.
  - [x] `Credentials` renders each ready credential; a `[TODO]` credential is absent.
  - [x] With `about`/`talks`/`credentials` empty, the respective section renders nothing.
  - [x] Each section's heading id is unique within the document.
- Integration tests:
  - [x] `npx astro check` and `npx astro build` exit 0.
  - [x] Real Lighthouse on a page including these sections holds accessibility (>=95) in both themes; WCAG AA contrast verified.
- Test coverage target: >=80% (populated, empty, and TODO states exercised)
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Approach and Credentials sections render correctly, AA-compliant, no client JS.
- Draft items are filtered; empty states render nothing; no contact details.
