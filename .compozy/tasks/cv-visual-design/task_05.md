---
status: completed
title: Restyle the four sections to the token and type system
type: frontend
complexity: medium
dependencies:
  - task_01
  - task_02
---

# Task 5: Restyle the four sections to the token and type system

## Overview
Apply the editorial design system across all four sections (Hero, Timeline, Impact, Links) — Fraunces display type for headlines, JetBrains Mono for dates/labels, semantic color tokens throughout, and the cobalt accent used sparingly. Content, props, and structure are unchanged; only presentation moves to the shared system, giving the page a cohesive senior feel.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST restyle Hero, Timeline, Impact, and Links to semantic token utilities (`text-fg`, `bg-bg`, `text-muted`, `text-accent`, `border-border`) — no hard-coded `slate-*`/`white` colors remain in these components.
- MUST use `font-display` (Fraunces) for headlines and `font-mono` (JetBrains Mono) for dates, labels, and metadata.
- MUST keep Impact metric-forward (metric before summary) and use the accent sparingly (links, key metrics).
- MUST NOT change component props, content, or DOM structure that the content contract depends on (heading IDs, metric-before-summary order, external-link `rel`, the conditional PDF button).
- MUST hold WCAG AA contrast in both themes for restyled text.
</requirements>

## Subtasks
- [x] 5.1 Restyle Hero: Fraunces display name, token text for title/value-prop.
- [x] 5.2 Restyle Timeline: mono dates, token text, refined entry rule.
- [x] 5.3 Restyle Impact: metric in display/accent, mono micro-label, token summary.
- [x] 5.4 Restyle Links: pill links on tokens, accent hover state.
- [x] 5.5 Replace all hard-coded `slate-*`/`white` with token utilities.
- [x] 5.6 Confirm the content contract (IDs, order, rel, PDF button) still holds.

## Implementation Details
Modify `src/components/Hero.astro`, `Timeline.astro`, `Impact.astro`, `Links.astro`. Use the token + font utilities from task_01/task_02. See TechSpec "Component Overview" and ADR-001 for the editorial/accent discipline. Do not touch `cv.ts` or `index.astro` props.

### Relevant Files
- `src/components/Hero.astro` — display headline + value prop.
- `src/components/Timeline.astro` — mono dates, role entries.
- `src/components/Impact.astro` — metric-forward highlights.
- `src/components/Links.astro` — pill links + conditional PDF button.

### Dependent Files
- `src/data/cv.ts` — read-only; content/props must remain compatible.
- `src/pages/index.astro` — composition unchanged; verifies props still match.

### Related ADRs
- [ADR-001: "Editorial refined" visual direction](../adrs/adr-001.md) — type system, sparing accent, no photo.
- [ADR-002: Self-hosted subset webfonts](../adrs/adr-002.md) — the faces applied here.

## Deliverables
- All four section components restyled to tokens + the type system.
- The content contract preserved.
- A re-run content-contract assertion suite **(REQUIRED)**.
- A token-usage check (no hard-coded `slate-*` in sections) **(REQUIRED)**.

## Tests
- Unit tests:
  - [ ] The content-contract dist-HTML suite passes: `experience-heading`/`impact-heading`/`links-heading` IDs present, the Impact metric renders before its summary, external links carry `rel="noopener noreferrer"`, and the PDF button appears only when `resumePdf` is set.
  - [ ] No hard-coded `slate-*` or `bg-white` classes remain in the four section components (grep).
  - [ ] Timeline dates and Impact micro-labels resolve to the JetBrains Mono stack; the Hero name resolves to Fraunces.
- Integration tests:
  - [ ] WCAG AA contrast holds for restyled text against `--bg` in both light and dark.
  - [ ] `astro check` and `astro build` exit 0; `linkinator` finds no broken links.
- Test coverage target: >=80% (all four sections + the content-contract assertions exercised).
- All tests must pass.

## Success Criteria
- All tests passing
- Test coverage >=80%
- All sections share one cohesive editorial system; content contract intact; AA held in both themes.


## Implementation Notes (as-built)
- Restyled Hero, Timeline, Impact, Links to semantic tokens + the editorial type system: Fraunces (`font-display`) for the hero name and section content headings; JetBrains Mono (`font-mono`, uppercase, tracked) for the section eyebrows, role dates, and link/PDF labels; body copy on the system sans. Cobalt accent used sparingly — Impact metrics (`text-accent`, metric leads), link hover (`hover:text-accent`/`hover:border-accent`), and the filled PDF button (`bg-accent text-bg`). Section rules use `border-border`. `motion-safe:` guards added on interactive transitions.
- Content contract preserved: heading IDs (`experience-/impact-/links-heading`), metric-before-summary order, external `rel="noopener noreferrer"`, conditional PDF button (absent since `resumePdf` is unset). No prop/content/DOM changes; `cv.ts` and `index.astro` untouched.
- Verified (worktree, real Chromium, both themes, 390px): no hard-coded `slate-*`/`white`/`blue-700` remain; Fraunces + JetBrains Mono actually load and apply (`document.fonts.check` true); metric-before-summary true; **AA in both themes** — light fg 17.85 / muted 7.58 / accent 6.70, dark fg 15.31 / muted 7.37 / accent 7.43 (all ≥ 4.5). Full-page screenshots confirm the editorial look. `astro check` 0/0, `astro build` 0.
