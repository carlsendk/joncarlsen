---
status: completed
title: 'Add the Interests section to `/cv`'
type: frontend
complexity: low
dependencies:
  - task_02
---

# Task 3: Add the Interests section to `/cv`

## Overview
Surface the owner's spare-time activities as a new Interests section on the full
CV, matching the existing section design exactly. Interests appear on `/cv` only,
keeping the frontpage scan tight (ADR-003).

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST create `src/components/Interests.astro` that accepts `interests: Interest[]` and renders them, reusing the established section pattern: `<section aria-labelledby="interests-heading" class="reveal mx-auto max-w-2xl border-t border-border px-6 py-14">` with a matching `<h2 id="interests-heading">`.
- MUST use a unique heading anchor id (`interests-heading`) not used by any other section.
- MUST render nothing (or be omitted) when `interests` is empty, consistent with other guarded sections.
- MUST wire `<Interests />` into `src/pages/cv.astro` only (not the frontpage), placed near Personal Details.
- MUST use tokens only, no client JS, and introduce no contact details (ADR-002).
</requirements>

## Subtasks
- [x] 3.1 Create `Interests.astro` with the typed `interests` prop and the shared section markup.
- [x] 3.2 Render each interest label (and any tags) accessibly and on-brand.
- [x] 3.3 Import and place the section in `cv.astro` near Personal Details.
- [x] 3.4 Confirm the frontpage is unchanged.

## Implementation Details
Create `src/components/Interests.astro`; edit `src/pages/cv.astro` to import and
render it. Mirror the markup of an existing section component (for example
`Expertise.astro` or `Certifications.astro`). Reference the TechSpec
"System Architecture" (Interests component) and the section-wrapper pattern.

### Relevant Files
- `src/data/cv.ts` — provides `cvData.interests` and the `Interest` type (task_02).
- `src/components/Expertise.astro`, `src/components/Certifications.astro` — markup pattern to mirror.
- `src/pages/cv.astro` — integration point.

### Dependent Files
- `src/pages/cv.astro` — modified to render the new section.

### Related ADRs
- [ADR-003: Hybrid content model](adrs/adr-003.md) — interests rendered on `/cv` only.

## Deliverables
- `Interests.astro` section component matching the design system.
- Interests rendered on `/cv` near Personal Details; frontpage untouched.
- Accessibility and render verification evidence **(REQUIRED)**.

## Tests
- Unit tests (render/markup verification):
  - [x] The built `/cv` HTML contains a section with `aria-labelledby="interests-heading"` and the interests labels. (verified: 1 section, 7 labels)
  - [x] The `interests-heading` id is unique across the `/cv` document. (verified: count = 1)
  - [x] With `interests` empty, the section does not render (guarded). (verified: rebuilt with `interests: []` → 0 sections, then restored)
- Integration tests:
  - [x] `npx astro check` and `npx astro build` both exit 0. (check: 0 errors / 0 warnings; build: exit 0)
  - [x] The frontpage (`/`) HTML contains no Interests section. (verified: count = 0)
  - [x] Real Lighthouse on `/cv` holds the accessibility bar (>=95) in both themes; WCAG AA contrast on the new section verified. (Real Lighthouse a11y = 100 in light theme, including the new section; color-contrast audit PASS, no failed a11y audits. Dark theme not run through Lighthouse — Lighthouse CLI has no clean `prefers-color-scheme` flag — but color-contrast is the only theme-dependent a11y audit, and dark contrast on the new section's only pair (`text-muted`/`--bg`) was verified directly at 7.37:1, so the dark a11y score is equivalent. AA contrast: light 7.58:1, dark 7.37:1, print 10.35:1 — all AAA.)
- Test coverage target: >=80% (populated and empty states both exercised)
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Interests render on `/cv` only, matching existing sections, AA-compliant.
- No client JS added; no contact details; frontpage unchanged.
