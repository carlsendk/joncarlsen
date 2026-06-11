---
status: completed
title: 'Restructure role bullets to `{ text, work? }` and render linked bullets on `/cv`'
type: frontend
complexity: medium
dependencies: []
---

# Task 1: Restructure role bullets to `{ text, work? }` and render linked bullets on `/cv`

## Overview
Turn each role bullet from a plain string into a description that can deep-link to
its work case study, establishing the role → work connection the feature depends
on. This is the foundational data-model change; it is paired with the `Timeline`
update because changing the bullet type breaks its only consumer, so both must
ship together to keep the build green (TechSpec ADR-003).

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST add a `Bullet` interface (`text: string; work?: string`) to `src/data/cv.ts` and change `Role.bullets` from `string[]` to `Bullet[]` (see TechSpec "Core Interfaces").
- MUST migrate every existing bullet across all eight roles to the `{ text }` object form, preserving the current wording verbatim.
- MUST add a `work` slug to each bullet that corresponds to an existing `work` case study, using the exact collection id (e.g. `dfds-platform`); bullets with no case study keep `work` unset.
- MUST update `src/components/Timeline.astro` (full variant) to render `bullet.text` and wrap it in a link to `/work/<bullet.work>` only when `work` is set, leaving plain bullets as text.
- MUST NOT carry any metric on the bullet (impact lives on the work entry — ADR-003) and MUST add no client JS.
</requirements>

## Subtasks
- [x] 1.1 Add the `Bullet` interface and change `Role.bullets` to `Bullet[]` in `cv.ts`.
- [x] 1.2 Convert all eight roles' bullets to `{ text }`, preserving wording.
- [x] 1.3 Attach `work` slugs to bullets backed by an existing case study.
- [x] 1.4 Update `Timeline.astro` full variant to render text + optional `/work` link.
- [x] 1.5 Verify `astro check` passes and linked bullets resolve.

## Implementation Details
Modify `src/data/cv.ts` (types + role data) and `src/components/Timeline.astro`
(rendering). The full-variant bullet loop currently renders `<li>{bullet}</li>`;
it must render `bullet.text` and conditionally wrap in an `<a href={\`/work/${bullet.work}\`}>`.
Reuse the existing `link-underline`/focus-visible link styling already used by
`CaseStudyCard.astro`. See TechSpec "Core Interfaces" and "System Architecture"
(Timeline). Valid `work` slugs are the file ids under `src/content/work/`.

### Relevant Files
- `src/data/cv.ts` — defines `Role`/`bullets`; holds the role data to migrate.
- `src/components/Timeline.astro` — only consumer of `role.bullets`; must render the new shape.
- `src/content/work/` — source of valid `work` slugs (collection ids).
- `src/components/CaseStudyCard.astro` — existing link styling pattern to mirror.

### Dependent Files
- `src/components/Impact.astro` (task_04) — unaffected by bullets, but shares the page; no change here.
- `src/pages/cv.astro` — renders `Timeline variant="full"`; benefits from linked bullets (no edit needed).

### Related ADRs
- [ADR-003: The work collection is the canonical source of impact and skills](adrs/adr-003.md) — bullets are descriptions `{ text, work? }`, no metric.
- [ADR-001: Work + Impact naming with the bullet as the connective unit](adrs/adr-001.md) — bullet links role to work.

## Deliverables
- `Bullet` interface and `Role.bullets: Bullet[]` in `cv.ts`, all roles migrated.
- `work` slugs on bullets backed by a case study.
- `Timeline.astro` rendering `bullet.text` with optional `/work/<slug>` links.
- Type-check and link-resolution verification evidence **(REQUIRED)**.

## Tests
- Unit tests (render/type verification):
  - [ ] `astro check` reports 0 errors after `Role.bullets` becomes `Bullet[]` and `Timeline.astro` is updated.
  - [ ] Rendered `/cv` HTML: a bullet with `work` set emits `href="/work/<slug>"`; a bullet without `work` emits plain text with no anchor.
  - [ ] Every `work` slug used on a bullet matches an existing `src/content/work/<id>.md` (no typos).
- Integration tests:
  - [ ] `npm run build` exits 0 and emits `/cv`.
  - [ ] `linkinator` over `dist` resolves every `/work/<slug>` bullet link (200); no broken links.
- Test coverage target: >=80% (bullet shape, link/no-link branches, slug validity exercised)
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- `Role.bullets` is `Bullet[]`; all roles migrated with wording preserved.
- `/cv` renders bullets as descriptions, linking to `/work/<slug>` only where a case study backs them; no client JS.
