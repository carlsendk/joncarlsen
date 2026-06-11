---
status: completed
title: Build the full-CV section components for /cv
type: frontend
complexity: medium
dependencies:
  - task_01
---

# Task 4: Build the full-CV section components for /cv

## Overview
Create the presentational section components the full CV page needs beyond the
existing ones: Summary, Expertise, Education, Certifications, and PersonalDetails.
Each is a small stateless component that takes typed props from `cvData` and uses
the established design tokens and type system.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST create `Summary.astro`, `Expertise.astro`, `Education.astro`, `Certifications.astro`, and `PersonalDetails.astro` under `src/components/`.
- Each component MUST take typed props sourced from `cvData` and render semantic, accessible markup with a labelled section heading (unique `id` for in-page anchors).
- MUST use the existing design tokens and type classes (consistent with the restyled sections from `cv-visual-design`); MUST NOT hard-code colors.
- `PersonalDetails.astro` MUST render only dob/nationality/marital; it MUST NOT render or accept email/phone (ADR-002).
- Components are presentation only; they MUST NOT fetch data or add client JS.
</requirements>

## Subtasks
- [x] 4.1 Build `Summary.astro` (professional summary prose).
- [x] 4.2 Build `Expertise.astro` (areas-of-expertise block).
- [x] 4.3 Build `Education.astro` (degrees list).
- [x] 4.4 Build `Certifications.astro` (certs, networks, associations) and `Publications` coverage (within this component set or a sibling as the TechSpec lists).
- [x] 4.5 Build `PersonalDetails.astro` (dob/nationality/marital only).
- [x] 4.6 Ensure each section has a labelled heading with a unique anchor id and token styling.

## Implementation Details
Create the components under `src/components/`. Mirror the markup conventions and
token usage of the existing `Timeline.astro`/`Impact.astro` sections. Props shapes
come from the `cvData` fields defined in task_01. Publications/honours render as a
list (either inside `Certifications.astro` or a small `Publications.astro` sibling,
per the TechSpec component overview). These components are wired into the page in
task_05.

### Relevant Files
- `src/components/Timeline.astro`, `src/components/Impact.astro` — style/markup reference.
- `src/styles/global.css` — design tokens and type system to reuse.
- `src/data/cv.ts` — prop shapes (task_01).

### Dependent Files
- `src/pages/cv.astro` — composes these components (task_05).

### Related ADRs
- [ADR-002: Single public leadership identity](../adrs/adr-002.md) — PersonalDetails excludes contact details.
- [ADR-003: Content layer](../adrs/adr-003.md) — components read the typed data file.

## Deliverables
- Five new section components rendering real `cvData` content with tokens.
- Each section exposes a unique heading id for `/cv` anchors **(REQUIRED)**.
- A token-usage check (no hard-coded colors) over the new components **(REQUIRED)**.

## Tests
- Unit tests:
  - [ ] Each component renders its `cvData` content with a labelled heading and unique `id`.
  - [ ] `PersonalDetails.astro` renders dob/nationality/marital and no `@`-email or phone string.
  - [ ] No hard-coded color classes (e.g. `slate-*`, `bg-white`) appear in the new components (grep).
  - [ ] Components contain no `<script>`/client JS.
- Integration tests:
  - [ ] `astro check` and `astro build` exit 0 with the components imported by a scratch page or task_05's page.
- Test coverage target: >=80% (each component exercised).
- All tests must pass.

## Success Criteria
- All tests passing
- Test coverage >=80%
- The full-CV section components exist, are accessible, token-styled, and contact-detail free.

## Implementation Notes (as-built)
- Created six presentational section components under `src/components/`: `Summary.astro`, `Expertise.astro`, `Education.astro`, `Certifications.astro`, `Publications.astro` (the sibling allowed by subtask 4.4 / TechSpec component list), and `PersonalDetails.astro`. Each takes typed props from `cvData` and adds no client JS.
- All match the established section markup: `<section class="reveal mx-auto max-w-2xl border-t border-border px-6 py-14">` with a mono, uppercase, tracked eyebrow `<h2>` carrying a unique anchor id (`summary-heading`, `expertise-heading`, `education-heading`, `certifications-heading`, `publications-heading`, `personal-heading`). Tokens only (no hard-coded colors). Expertise renders as non-interactive chips; PersonalDetails uses a `<dl>` and carries no contact field (ADR-002).
- Verified via a temporary probe page: `astro check` 0/0; `astro build` exit 0; all six heading ids present; real content rendered (MSc/DTU, certifications, expertise chips, dob); no `mailto:`/`tel:`/email/phone in `PersonalDetails`; no `<script>` and no hard-coded colors. Probe removed; no stray routes. Wiring into `/cv` is task_05.
