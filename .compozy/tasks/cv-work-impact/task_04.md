---
status: completed
title: 'Switch home + `/cv` Impact band to derived metrics; remove `cvData.impact`'
type: frontend
complexity: medium
dependencies:
  - task_02
  - task_03
---

# Task 4: Switch home + `/cv` Impact band to derived metrics; remove `cvData.impact`

# Overview
Repoint the existing Impact section on the home page and `/cv` at the derived
per-company metrics and retire the hand-curated `cvData.impact` list, completing
the single-source model (TechSpec ADR-003, ADR-004). Repurposing `Impact.astro`
breaks its current callers, so the component, both pages, and the `cv.ts` removal
move together to keep the build green.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST change `src/components/Impact.astro` to accept `ImpactItem[]` (from `src/lib/impact.ts`) instead of `Highlight[]`, rendering each as a metric + company that links to `/work/<slug>`.
- MUST update `src/pages/index.astro` and `src/pages/cv.astro` to pass `await leadImpactItems()` to `Impact`.
- MUST remove `impact: Highlight[]` from `CvData` and delete the now-unused `Highlight` interface in `src/data/cv.ts`.
- MUST keep the band figures-only (no case-study prose) so the `/cv` band never repeats the timeline bullet text (ADR-004).
- MUST preserve the existing Impact section visual treatment (metric-led, accent figure) and add no client JS; print behavior must stay clean (internal links are skipped by the existing print rule).
</requirements>

## Subtasks
- [x] 4.1 Rewrite `Impact.astro` props/template to render `ImpactItem[]` with `/work/<slug>` links.
- [x] 4.2 Feed `leadImpactItems()` from `index.astro` and `cv.astro`.
- [x] 4.3 Remove `cvData.impact` and the `Highlight` interface from `cv.ts`.
- [x] 4.4 Confirm no remaining references to `Highlight`/`cvData.impact`.
- [x] 4.5 Verify the `/cv` band shows numbers only and does not duplicate timeline bullets.

## Implementation Details
Modify `src/components/Impact.astro`, `src/pages/index.astro`,
`src/pages/cv.astro`, and `src/data/cv.ts`. `Impact.astro` currently maps
`highlights` (metric over summary); change it to map `items` (metric + company,
wrapped in a `/work/<slug>` link). Both pages currently pass `cvData.impact`;
change to `await leadImpactItems()` (pages may already be async in Astro).
See TechSpec "System Architecture" and "Core Interfaces".

### Relevant Files
- `src/components/Impact.astro` — repurpose from `Highlight[]` to `ImpactItem[]`.
- `src/pages/index.astro` — home; replace `cvData.impact` with `leadImpactItems()`.
- `src/pages/cv.astro` — full CV; same swap; relies on figures-only band.
- `src/data/cv.ts` — remove `impact`/`Highlight`.
- `src/lib/impact.ts` — provides `leadImpactItems()`/`ImpactItem` (task_03).

### Dependent Files
- `src/pages/impact.astro` (task_05) — reuses the repurposed `Impact.astro` item rendering.

### Related ADRs
- [ADR-004: Impact derivation from the work collection](adrs/adr-004.md) — band is first metric per company; figures only.
- [ADR-003: The work collection is the canonical source of impact and skills](adrs/adr-003.md) — remove the curated `cvData.impact`.

## Deliverables
- `Impact.astro` rendering `ImpactItem[]` with deep links.
- Home and `/cv` Impact sections sourced from `leadImpactItems()`.
- `cvData.impact` and `Highlight` removed from `cv.ts`.
- Verification evidence (no dangling references, no `/cv` duplication) **(REQUIRED)**.

## Tests
- Unit tests (render verification):
  - [x] Home HTML Impact section shows one number per company with metrics (~4: AXON, DFDS, Lunar, Scrive), each an `href="/work/<slug>"` link. (dist HTML: 4 companies — AXON/DFDS/Lunar/Scrive — each one metric + `/work/<slug>` link.)
  - [x] `/cv` Impact band renders the same figures-only set; the bullet sentences from the timeline do NOT appear inside the Impact section (no duplicated text). (Band shows work metric strings, e.g. "500+ microservices on Kubernetes", distinct from bullet prose.)
  - [x] Grep confirms zero remaining references to `Highlight` or `cvData.impact` in `src/`. (`grep -rn "Highlight\|cvData.impact\|highlights="` → 0 refs.)
- Integration tests:
  - [x] `npm run check && npm run build` exits 0 after removing `cvData.impact`/`Highlight`. (`npm run build` exit 0; `npm run check` literal OOMs in this tree — scoped `astro check` with `.astro/types.d.ts` included = 0 errors.)
  - [x] `linkinator` over `dist` resolves all band `/work/<slug>` links (200). (`linkinator dist --recurse --skip joncarlsen.dk` → 20 links scanned, all band links 200.)
  - [x] `/cv` print check: the new internal band links emit no trailing URL (only outbound `http` links do, per `global.css`). (Band has 4 internal `/work` links, 0 `http` links → print rule appends nothing.)
- Test coverage target: >=80% (band render, link branch, removal)
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Home and `/cv` Impact bands derive from work metrics; `cvData.impact`/`Highlight` gone.
- `/cv` shows numbers (band) and descriptions (timeline) with no repetition; no client JS.
