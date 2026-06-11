---
status: completed
title: Expand CvData model and populate real content in src/data/cv.ts
type: frontend
complexity: medium
dependencies: []
---

# Task 1: Expand CvData model and populate real content in src/data/cv.ts

## Overview
Grow the single typed content source (`src/data/cv.ts`) from the current minimal
`CvData` into the full structured CV, and replace all placeholder values with the
owner's real content from `docs/Content/_base/master-CV.md`. This file becomes the
single source of truth that both the frontpage and the full CV import (ADR-003).

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST extend `CvData` with the fields named in the TechSpec "Core Interfaces" section: `summary`, `expertise`, `education`, `certifications`, `publications`, `personalDetails`, optional `about`, optional `talks`; and add `bullets: string[]` to `Role`.
- The `PersonalDetails` type MUST contain only `dob`, `nationality`, `maritalStatus`. It MUST NOT define an email or phone field (ADR-002 made structural).
- MUST populate every field with real content drawn from `docs/Content/_base/master-CV.md` (and `about-me.md` for summary/expertise wording). No placeholder strings ("Your Name", "Company A", "TODO(owner)") may remain.
- MUST keep exactly one `roles` array (newest first), each role carrying both a one-line `scope` and achievement `bullets` (the two-rendering split is consumed downstream, not duplicated here).
- Links MUST be outbound profiles only (LinkedIn, GitHub, knowledge base); MUST NOT include email or phone (ADR-002).
- All prose (summary, scope lines, bullets) MUST follow the authentic-voice rules (no em dashes; none of the listed AI tells).
</requirements>

## Subtasks
- [x] 1.1 Extend the `CvData` and `Role` interfaces and add `Education` and `PersonalDetails` types per the TechSpec.
- [x] 1.2 Populate name, title (leadership identity per ADR-002), value prop, and the 3–4 line summary.
- [x] 1.3 Populate the full `roles` array (all roles newest first, each with scope + achievement bullets) from the master CV.
- [x] 1.4 Populate expertise, education, certifications/networks, and publications/honours.
- [x] 1.5 Populate `personalDetails` (dob/nationality/marital only) and outbound `links`.
- [x] 1.6 Remove every placeholder value and confirm prose passes the voice rules.

## Implementation Details
Edit only `src/data/cv.ts`. Mirror the interface shapes in the TechSpec
"Core Interfaces" and "Data Models" sections (do not redefine them here). Source
content from `docs/Content/_base/master-CV.md`; use `about-me.md` and
`leadership-narrative.md` for summary/expertise phrasing. Use only figures that
exist in the source (leave missing numbers out rather than inventing them).

### Relevant Files
- `src/data/cv.ts` — the file to expand and populate (single source of truth).
- `docs/Content/_base/master-CV.md` — primary content source for all fields.
- `docs/Content/_base/about-me.md` — summary, expertise, and voice rules.

### Dependent Files
- `src/pages/index.astro` — imports `cvData` (consumes the new shape in task_06).
- `src/components/Timeline.astro` — will read `Role.bullets` (task_03).
- `src/pages/cv.astro` — will import the full `cvData` (task_05).

### Related ADRs
- [ADR-002: Single public leadership identity](../adrs/adr-002.md) — structural no-contact-details; single leadership identity in title/summary.
- [ADR-003: Content layer](../adrs/adr-003.md) — expanded typed file as the single source for structured facts.

## Deliverables
- Expanded `CvData`/`Role` plus `Education` and `PersonalDetails` interfaces in `src/data/cv.ts`.
- Real content populated across every field; zero placeholder strings remain.
- A `astro check` type-clean result for the new model **(REQUIRED)**.
- A no-contact-leak grep over the source **(REQUIRED)**.

## Tests
- Unit tests:
  - [ ] `astro check` exits 0 (the expanded `CvData` and `Role` type-check; no implicit any).
  - [ ] `PersonalDetails` has no `email`/`phone` member: grep `src/data/cv.ts` for `email`/`phone` returns nothing.
  - [ ] No placeholder strings remain: grep for "Your Name", "Company A", "TODO(owner)" returns nothing.
  - [ ] `roles` is a single array, newest first, and every role has a non-empty `bullets` array.
- Integration tests:
  - [ ] `astro build` exits 0 with the expanded data wired through the existing `index.astro` import.
- Test coverage target: >=80% (all new fields populated and referenced).
- All tests must pass.

## Success Criteria
- All tests passing
- Test coverage >=80%
- `src/data/cv.ts` holds the complete real CV with no placeholders and no contact details.
- Prose conforms to the authentic-voice rules.

## Implementation Notes (as-built)
- Expanded `CvData` in `src/data/cv.ts` with `summary`, `expertise`, `roles` (now with per-role `bullets`), `earlierRoles`, `impact`, `education`, `certifications`, `publications`, `links`, `personalDetails`, and optional `about`/`talks` (Phase 2). Added `Education` and `PersonalDetails` interfaces.
- Populated all fields from `docs/Content/_base/master-CV.md` (summary/value-prop phrasing from the leadership narrative). Real figures only (50,000/s, 3→20, 500+, ~200 engineers, ISO 27001/ISAE 3000).
- `PersonalDetails` holds dob/nationality/maritalStatus only; no field exists for contacting the owner (ADR-002 made structural). No contact-detail tokens or values anywhere in the file or rendered output.
- Added `earlierRoles: string[]` beyond the task's explicit field list, so the four early-career roles are captured without violating the "every `roles` entry has non-empty bullets" rule. Kept `resumePdf?` optional/unset so the existing `index.astro`/`Links.astro` still type-check (print-friendly `/cv` replaces a PDF, ADR-001).
- Verified: `astro check` 0 errors / 0 warnings; `astro build` exit 0 (frontpage renders the real name); placeholder, contact-leak, and em-dash greps all clean; one `roles` array, 8 roles newest-first, all with non-empty bullets.
