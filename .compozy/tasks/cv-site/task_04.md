---
status: completed
title: Style the page with Tailwind (mobile-first, accessible)
type: frontend
complexity: medium
dependencies:
  - task_03
---

# Task 4: Style the page with Tailwind (mobile-first, accessible)

## Overview
Apply Tailwind styling to the composed page so it is mobile-first, fast, visually
clear, and accessible — the qualities the PRD ties directly to the recruiter
30-second scan. This turns the structural page from task 03 into a polished,
shippable design.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST style mobile-first, with the hero name/title/value-proposition readable above the fold on a 375px-wide viewport.
- MUST reflow without horizontal overflow across mobile, tablet, and desktop widths.
- MUST visually emphasize each Impact `metric` over its summary so the number leads.
- MUST meet WCAG AA color contrast for text and provide a visible keyboard focus state on every link.
- MUST keep the production CSS small via Tailwind purge (per ADR-005) to protect load speed.
- SHOULD establish a consistent type scale and spacing using Tailwind's default tokens.
</requirements>

## Subtasks
- [x] 4.1 Define base layout styling (container width, vertical rhythm, typography scale).
- [x] 4.2 Style the Hero for above-the-fold clarity on mobile.
- [x] 4.3 Style the Timeline and Impact sections with clear hierarchy (metric emphasized).
- [x] 4.4 Style the Links section as a prominent, obvious next step.
- [x] 4.5 Verify responsive behavior and accessible contrast/focus states.

## Implementation Details
Add Tailwind utility classes to the components and base layout created in tasks
01 and 03; no new components. Reference TechSpec "Testing Approach" (Lighthouse
accessibility/performance budgets) for the bar this styling must clear and PRD
"User Experience" for the hierarchy intent.

### Relevant Files
- `src/components/Hero.astro` — above-the-fold hero styling.
- `src/components/Timeline.astro` — timeline layout and hierarchy.
- `src/components/Impact.astro` — metric emphasis styling.
- `src/components/Links.astro` — prominent outbound links.
- `src/layouts/Base.astro` — global container, typography, and spacing.

### Dependent Files
- `astro.config.mjs` / Tailwind config — purge content globs must cover all styled files.
- CI quality gate (task 05) — Lighthouse budgets evaluate this styling.

### Related ADRs
- [ADR-005: Style with Tailwind CSS](../adrs/adr-005.md) — styling approach and purge.
- [ADR-001: Single-page scrolling CV](../adrs/adr-001.md) — scannable single-page hierarchy.

### Implementation Notes (as-built)
- Styled all four components + `Base.astro` body + a small `global.css` base layer with Tailwind default tokens only (`text-sm`…`text-5xl`, `space-y-*`, `py-*`). No new components, no config changes.
- **Hierarchy:** section headings (`Experience`/`Impact`/`Links`) became small uppercase eyebrow labels so the *content* leads visually — role titles, and especially the Impact metric (`text-4xl`/`sm:text-5xl`, `font-extrabold`) over its `text-base` summary. The `<h1>`/`<h2>` element semantics and order are unchanged from task_03 (heading-order a11y preserved).
- **Accessibility:** body text is `slate-900`/`slate-600`/`slate-700` (all clear WCAG AA on white). A `global.css` `@layer base` rule gives every `a:focus-visible`/`button:focus-visible` a 2 px `#1d4ed8` (blue-700) outline as a guaranteed focus indicator; styled links add matching `focus-visible:outline-*` utilities. Links render as outlined pills (PDF as a filled button) for a prominent, obvious next step.
- **Budgets introduced (none were previously recorded):** a11y ≥ 95 (task-stated), performance ≥ 90 mobile, CSS ≤ 20 KB raw / ≤ 6 KB gzip. **task_05's CI Lighthouse/size gate should encode these same numbers.**
- **Verification tooling:** real Lighthouse via system Chrome (perf 100, a11y 100, mobile) and Playwright (viewport/overflow/computed-size/keyboard-focus), both run against `astro preview` of the production `dist/` — not `astro dev`. `astro check` 0, `astro build` 0, task_03 content contract still 38/38.
- **Note:** `cv.ts` content is still the placeholder (incl. a `TODO(owner)` value prop visible in the hero); a missing-favicon 404 from the task_01 scaffold remains (cosmetic, doesn't affect the perf/a11y scores) — neither is in this task's scope.
- **Environment observation (not changed here):** the toolchain currently resolves `astro@6.4.4` (package.json pins `^6.4.4`), which builds/type-checks/previews green because Tailwind is wired via `@tailwindcss/postcss`, not the Vite plugin. Flagged in case a future task expects the 5.x pin.

## Deliverables
- A fully styled, mobile-first, responsive single page.
- Emphasized Impact metrics and a prominent Links section.
- Accessible contrast and focus states throughout.
- Responsive/accessibility verification (Lighthouse gate + recorded checklist) **(REQUIRED)**.
- Lighthouse budget verification **(REQUIRED)**.

## Tests
Per the TechSpec "Testing Approach", styling is guarded by the automated Lighthouse/CSS-budget gate plus a recorded manual responsive/visual pass — no browser unit-test harness is introduced.
- Automated gate tests:
  - [x] Lighthouse accessibility score >= 95 on the built page (covers contrast, focus-visible, and semantic-structure audits). **Result: 100** (real Lighthouse, mobile profile, against `astro preview` of `dist/`; 0 failing a11y audits).
  - [x] Lighthouse performance score meets the agreed budget on a mobile profile. **Budget: >= 90. Result: 100.**
  - [x] Purged production CSS is under the agreed size budget. **Budget: <= 20 KB raw / <= 6 KB gzip. Result: 9.5 KB raw / 2.8 KB gzip.**
- Manual verification (recorded checklist, no new tooling — automated via Playwright against the built `dist/`):
  - [x] Hero name, title, and value proposition are within the first viewport at 375×667 with no scroll to see them. **(value-prop bottom = 226 px ≤ 667; measured with the verbose placeholder value prop, real content will be shorter.)**
  - [x] No horizontal overflow at 375px, 768px, and 1280px widths. **(scrollWidth == clientWidth at all three.)**
  - [x] Each Impact `metric` is visibly larger/heavier than its summary. **(metric 36 px / font-weight 800 vs summary 16 px / 400.)**
  - [x] Every link shows a visible keyboard focus state. **(both links: 2 px solid blue-700 outline on Tab; `:focus-visible` matched.)**
- Test coverage target: >=80% (the automated Lighthouse/CSS-budget gate plus the recorded verification checklist all pass).
- All tests must pass.

## Success Criteria
- All tests passing
- Test coverage >=80% (responsive + accessibility checks pass)
- Page is mobile-first, reflows cleanly, and reads clearly above the fold.
- Lighthouse performance and accessibility budgets are met.
- Contrast and focus states satisfy WCAG AA.
