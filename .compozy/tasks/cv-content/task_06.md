---
status: completed
title: Restructure the frontpage index.astro to a condensed scan
type: frontend
complexity: medium
dependencies:
  - task_01
  - task_03
---

# Task 6: Restructure the frontpage index.astro to a condensed scan

## Overview
Rework the frontpage into the short, scannable hub of the hub-and-spoke structure:
hero, a few quantified highlights, areas of expertise, a condensed top-N experience
list, outbound links, and one clear path to the full CV. It must land the leadership
identity and a proof point within the first screen (ADR-001, ADR-002).

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST restructure `src/pages/index.astro` to render: Hero, Impact highlights, Expertise, condensed Experience (`Timeline variant="condensed"` with a `limit`), and Links.
- MUST include a prominent, descriptive link to `/cv` ("View full CV" or similar).
- MUST keep the frontpage short enough to serve a fast scan; the full history lives on `/cv`, not here.
- MUST import only the needed subset of `cvData`; MUST NOT duplicate content.
- MUST render no contact details (ADR-002) and lead with the single leadership identity.
</requirements>

## Subtasks
- [x] 6.1 Compose the condensed frontpage sections in scan order.
- [x] 6.2 Pass `variant="condensed"` and a `limit` to `Timeline`.
- [x] 6.3 Add the prominent "View full CV" link to `/cv`.
- [x] 6.4 Confirm identity + a quantified highlight appear above the fold.
- [x] 6.5 Confirm no placeholder strings and no contact details render.

## Implementation Details
Modify `src/pages/index.astro`. Reuse `Hero`, `Impact`, `Links`, the new
`Expertise.astro` (task_04), and `Timeline` condensed variant (task_03). Keep the
existing `cvData`-driven metadata pattern. Reference the TechSpec "System
Architecture" for the frontpage section set.

### Relevant Files
- `src/pages/index.astro` — the page to restructure.
- `src/components/Hero.astro`, `Impact.astro`, `Links.astro`, `Expertise.astro`, `Timeline.astro` — composed sections.
- `src/data/cv.ts` — content source (task_01).

### Dependent Files
- `src/pages/cv.astro` — the link target (task_05).
- `src/pages/work/[slug].astro` — case-study links may surface here (task_07).

### Related ADRs
- [ADR-001: Hub-and-spoke information architecture](../adrs/adr-001.md) — short frontpage hub.
- [ADR-002: Single public leadership identity](../adrs/adr-002.md) — single identity, no contact details.

## Deliverables
- A restructured, condensed frontpage with a clear path to `/cv`.
- Above-the-fold identity + proof point verifiable **(REQUIRED)**.
- A no-placeholder and no-contact-leak check on the rendered `/` **(REQUIRED)**.

## Tests
- Unit tests:
  - [ ] Rendered `/` shows the hero identity and at least one quantified highlight in the first screenful.
  - [ ] Experience on `/` is condensed (top-N, no bullets) via `variant="condensed"` + `limit`.
  - [ ] A descriptive link to `/cv` is present.
  - [ ] No placeholder strings and no `@`-email/phone appear on `/`.
- Integration tests:
  - [ ] `linkinator` finds no broken links; the `/cv` link resolves.
  - [ ] Lighthouse performance and a11y hold the project bar on `/` in both themes.
- Test coverage target: >=80% (all frontpage sections rendered).
- All tests must pass.

## Success Criteria
- All tests passing
- Test coverage >=80%
- The frontpage is a fast, single-identity scan that routes cleanly to `/cv`.

## Implementation Notes (as-built)
- Restructured `src/pages/index.astro` to the scan order: Hero, Impact (highlights), Expertise, condensed Experience (`Timeline variant="condensed" limit={4}`), a prominent "View full CV →" accent CTA linking `/cv`, then Links. Imports only the needed subset of `cvData`; no duplicated content.
- Fixed the page `<title>` em dash (`— CV` → `· CV`) per the cross-cutting no-em-dash gate.
- Verified: `astro check` 0/0; `astro build` exit 0; condensed renders exactly 4 roles and 0 bullet lists; impact/expertise/experience/links headings present; single `<h1>`; no placeholders/contact leaks; tokens only.
- `linkinator` (scoped to local origin) 7 links, 0 broken; outbound profiles (LinkedIn/GitHub/KB) 200; local `/cv` resolves 200. Note: an unscoped run flags `https://joncarlsen.dk/cv/` 404 because the canonical/og URLs point to production and `/cv` is not deployed yet; resolves on push.
- Lighthouse frontpage: a11y 100, perf 100. Above-the-fold (Playwright, mobile 390×844 and desktop 1350×940): identity `<h1>` and the first metric "50,000/s" both within the initial viewport.
