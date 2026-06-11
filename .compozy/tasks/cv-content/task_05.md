---
status: completed
title: Assemble the /cv full-CV page in cv.astro
type: frontend
complexity: medium
dependencies:
  - task_01
  - task_03
  - task_04
---

# Task 5: Assemble the /cv full-CV page in cv.astro

## Overview
Create the `/cv` route that composes the complete CV from the typed data: summary,
full experience (with bullets), expertise, education, certifications, publications,
and personal details, inside the shared layout. This is the deep-evaluation tier of
the hub-and-spoke structure (ADR-001).

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST create `src/pages/cv.astro` rendering inside `Base.astro` with appropriate page metadata (title/description from `cvData`).
- MUST compose, in a sensible CV order: Summary, full Experience (`Timeline` `variant="full"`), Impact highlights, Expertise, Education, Certifications/Networks, Publications, PersonalDetails.
- MUST import the full `cvData` and the section components from task_04; MUST NOT duplicate content already in `cvData`.
- MUST render only real content and no contact details (ADR-002).
- MUST provide a clear link back to the frontpage and keep the page reachable from `/` (the `/` link is added in task_06).
- Case-study listing on `/cv` is added later (task_07); this task may leave a placeholder-free structure ready for it.
</requirements>

## Subtasks
- [x] 5.1 Create `src/pages/cv.astro` using `Base.astro` and `cvData` metadata.
- [x] 5.2 Compose the full CV sections in reading order using existing and task_04 components.
- [x] 5.3 Render full experience via `Timeline variant="full"`.
- [x] 5.4 Add a back-to-home link and ensure semantic landmarks/anchors.
- [x] 5.5 Confirm no placeholder strings and no contact details render.

## Implementation Details
Create `src/pages/cv.astro`. Reuse `Base.astro` (layout), the restyled
`Timeline`/`Impact`/`Links`, and the task_04 components. Follow `index.astro`'s
import pattern for `cvData`. Reference the TechSpec "System Architecture" for the
section composition. Do not add client JS.

### Relevant Files
- `src/layouts/Base.astro` — layout wrapper.
- `src/components/*.astro` — existing + task_04 section components.
- `src/data/cv.ts` — full content source (task_01).
- `src/pages/index.astro` — import/metadata pattern reference.

### Dependent Files
- `src/pages/index.astro` — links to `/cv` (task_06).
- `src/pages/work/[slug].astro` — case studies link back to `/cv` (task_07).
- `src/styles/global.css` — print rules target `/cv` (task_08).

### Related ADRs
- [ADR-001: Hub-and-spoke information architecture](../adrs/adr-001.md) — `/cv` as the full-CV spoke.
- [ADR-002: Single public leadership identity](../adrs/adr-002.md) — single identity, no contact details.

## Deliverables
- A working `/cv` page composing the full CV from `cvData`.
- `dist/cv/index.html` emitted by the build **(REQUIRED)**.
- A no-placeholder and no-contact-leak check on the rendered `/cv` **(REQUIRED)**.

## Tests
- Unit tests:
  - [ ] `astro build` emits `dist/cv/index.html`.
  - [ ] Rendered `/cv` contains all required section headings (summary, experience, expertise, education, certifications, publications, personal details).
  - [ ] Full experience shows achievement bullets (Timeline `variant="full"`).
  - [ ] No placeholder strings and no `@`-email/phone appear in the rendered `/cv`.
- Integration tests:
  - [ ] `linkinator` finds no broken links on `/cv`; the back-to-home link resolves.
  - [ ] Lighthouse a11y holds the project bar on `/cv` in both themes.
- Test coverage target: >=80% (all composed sections rendered).
- All tests must pass.

## Success Criteria
- All tests passing
- Test coverage >=80%
- `/cv` renders the complete real CV, accessible, contact-detail free, in both themes.

## Implementation Notes (as-built)
- Created `src/pages/cv.astro` in `Base.astro`. Composition: a back-to-`/` `<nav>`, `Hero` (page identity, the single `<h1>`), then `<main>` with Summary, Experience (`Timeline variant="full"`, bullets), Impact, Expertise, Education, Certifications, Publications, PersonalDetails, and Links. Metadata `title="Full CV · <name>"`, `description=valueProp`.
- Added two components beyond the task's explicit list, both justified: `Hero` (a standalone CV page needs a visible name/identity and an H1) and `Links` (outbound profiles are the only follow-up path on an independently-shared page). Case-study listing is intentionally deferred to task_07.
- Verified: `astro check` 0/0; `astro build` exit 0 emits `dist/cv/index.html`; all 9 section heading ids present; exactly one `<h1>`; 8 experience bullet lists; no placeholders/contact details; `linkinator` 7 links, 0 broken; console 0 errors/0 failed requests.
- Real contrast is AA in both themes (Playwright `getComputedStyle`, opacity-independent): dark fg 15.31 / muted 7.37; light fg 17.85 / muted 7.58. Lighthouse a11y `/cv` = 95 (meets the ≥95 bar).

### Follow-up (recommended, out of scope here)
- Lighthouse `color-contrast` is a **false positive** on long `.reveal` pages: below-fold sections are at ~0 opacity during the static audit, so axe blends text to background. It caps `/cv` a11y at 95 (frontpage is 100). Real contrast is AA. To hit the 100/100 target, harden the `cv-visual-design` reveal so content is never at low opacity for non-scroll/audit contexts (e.g. animate `transform` only, keeping `opacity: 1`). This is a shared-animation/design change, so leaving it for an explicit decision rather than expanding task_05.
