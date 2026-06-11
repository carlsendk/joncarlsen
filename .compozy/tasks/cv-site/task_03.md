---
status: completed
title: Build section components and compose the page
type: frontend
complexity: medium
dependencies:
  - task_01
  - task_02
---

# Task 3: Build section components and compose the page

## Overview
Build the four section components — Hero, Timeline, Impact, and Links — as
semantic, accessible Astro components that render their slice of `CvData`, and
compose them into a single scrolling `index.astro` with page metadata. This
produces the complete page structure that styling (task 04) then refines.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST implement `Hero`, `Timeline`, `Impact`, and `Links` components, each rendering its `CvData` slice received as typed props.
- MUST render the four sections in order (Hero → Timeline → Impact → Links) within a single `src/pages/index.astro` using the base layout.
- MUST render the Impact metric before its summary so the number leads (per PRD "Impact highlights").
- MUST render a PDF download link in `Links` only when `resumePdf` is set, and outbound profile links with appropriate `rel`/`target` for external links.
- MUST emit a page `<title>`, meta description, and Open Graph tags for credible link sharing.
- MUST NOT include any contact form, email link, or phone link anywhere in the output (per ADR-002).
- SHOULD use semantic landmarks (header/section/footer, headings in order) for accessibility.
</requirements>

## Subtasks
- [x] 3.1 Implement `Hero` rendering name, title, and value proposition above the fold.
- [x] 3.2 Implement `Timeline` rendering one entry per role (company, position, dates, scope).
- [x] 3.3 Implement `Impact` rendering one item per highlight with the metric leading.
- [x] 3.4 Implement `Links` rendering outbound links plus a conditional PDF download.
- [x] 3.5 Compose the four sections in `index.astro` via the base layout.
- [x] 3.6 Populate page metadata (title, description, OG tags).

## Implementation Details
Create the four components under `src/components/` and the page at
`src/pages/index.astro`. Import the content object from `src/data/cv.ts` and pass
typed slices to each component. Keep markup semantic and minimally styled; visual
design is task 04. See TechSpec "System Architecture → Component Overview" for
each component's responsibility and the data-flow description.

### Relevant Files
- `src/components/Hero.astro` — renders the hero/summary (created here).
- `src/components/Timeline.astro` — renders the experience timeline (created here).
- `src/components/Impact.astro` — renders impact highlights (created here).
- `src/components/Links.astro` — renders outbound links + PDF download (created here).
- `src/pages/index.astro` — composes sections and owns metadata (created here).

### Dependent Files
- `src/layouts/Base.astro` — receives title/description/OG values from the page.
- `src/data/cv.ts` — source of all rendered content.
- Styling (task 04) modifies these same component files.

### Related ADRs
- [ADR-001: Single-page scrolling CV](../adrs/adr-001.md) — section order and one-page composition.
- [ADR-002: No contact details](../adrs/adr-002.md) — Links is outbound-only; no contact form.

### Implementation Notes (as-built)
- Created `Hero.astro`, `Timeline.astro`, `Impact.astro`, `Links.astro` (each with a typed `Props` interface importing from `src/data/cv.ts`) and rewrote `src/pages/index.astro` to compose them via `Base.astro`.
- **Metadata single-sourced from `cvData` (ADR-003):** `index.astro` derives `title = "${cvData.name} — CV"` and `description = cvData.valueProp`, removing the placeholder's hardcoded title that disagreed with `cv.ts`. The owner now edits one file. `Base.astro` emits the OG tags unchanged.
- **Semantic structure:** `Hero` is a `<header>` banner owning the single `<h1>`; `Timeline`/`Impact`/`Links` are `<section aria-labelledby=…>` with one `<h2>` each, wrapped in `<main>`. Heading order is h1→h2 (Experience)→h3 (role)→h2 (Impact)→h2 (Links), no skipped levels — pre-satisfies the task_05 Lighthouse a11y gate.
- **External links:** anchors whose URL matches `^https?://` (or `//`) get `target="_blank" rel="noopener noreferrer"`; the optional internal PDF link gets neither but carries `download`.
- **`resumePdf` kept omitted:** `cv.ts` is unchanged by this task (verified byte-identical to the delivered file). The present-branch PDF link was verified by temporarily setting `resumePdf`, rebuilding, asserting the `<a href="/resume.pdf" download>` link, then reverting — so no broken `/resume.pdf` path ships before task_05's link check.
- **Verification:** `astro check` exit 0, `astro build` exit 0 (single `dist/index.html`), and a 38-assertion build-output contract test (imports `cvData` from source via Node type-stripping and asserts against the built HTML) — all green, covering T1–T7 + I1/I2 incl. exact per-item counts and the PDF present/absent branches.

## Deliverables
- Four working section components rendering `CvData`.
- `src/pages/index.astro` composing them in order with metadata.
- Conditional PDF download link wired in `Links`.
- Build-output assertion tests **(REQUIRED)**.
- Build integration test producing a single composed page **(REQUIRED)**.

## Tests
Per the TechSpec "Testing Approach", there is no component unit-test harness; tests assert on the built `dist/` HTML plus the type check.
- Build-output tests (assert on the generated `dist/index.html`):
  - [x] Built HTML contains the `name`, `title`, and `valueProp` strings from `cv.ts`.
  - [x] Built HTML contains exactly one timeline entry per `roles[]` item, each showing company, position, start–end, and scope.
  - [x] Built HTML contains one impact item per `impact[]`, with the `metric` text appearing before its `summary` in source order.
  - [x] Built HTML contains one anchor per `links[]` with the correct `href` and `rel="noopener"` on external links.
  - [x] Building with `resumePdf` set emits a PDF download link; building with it omitted emits none.
  - [x] The built `<head>` contains a non-empty `<title>`, a meta description, and OG tags.
  - [x] The built HTML contains no `<form>`, `mailto:`, or `tel:` (enforces ADR-002, asserted via grep).
- Integration tests:
  - [x] `astro build` exits 0 and produces one `index.html` with all four sections in order (Hero, Timeline, Impact, Links).
  - [x] `astro check` passes with the typed props wired to `cv.ts`.
- Test coverage target: >=80% of rendered fields/branches verified against the built output (incl. the `resumePdf` present/absent branch).
- All tests must pass.

## Success Criteria
- All tests passing
- Test coverage >=80% (built-output assertions, incl. PDF present/absent)
- Single composed page renders all four sections from `cv.ts` content.
- Output is semantic and contains no contact form or contact details.
- Page metadata is present for link sharing.
