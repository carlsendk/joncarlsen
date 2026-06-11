---
status: completed
title: Add reduced-motion-gated micro-interactions
type: frontend
complexity: medium
dependencies:
  - task_05
---

# Task 7: Add reduced-motion-gated micro-interactions

## Overview
Add the "alive but quiet" polish — reveal-on-scroll, animated link underlines, refined hover states, and a smooth theme transition — using CSS only, fully suppressed under `prefers-reduced-motion`, so the page gains motion without growing its JS surface.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST implement reveal-on-scroll via CSS scroll-driven animation (`animation-timeline: view()`), progressively enhanced so content is fully visible when unsupported.
- MUST add an animated underline and refined hover states for links, plus a smooth theme color transition.
- MUST wrap ALL motion in `@media (prefers-reduced-motion: no-preference)` so reduced-motion fully suppresses movement (no reveal, no transition animation).
- MUST NOT introduce any JavaScript for animation (CSS-only; the only JS remains the theme guard + toggle).
- MUST keep content visible and usable if scroll-driven animations are unsupported.
</requirements>

## Subtasks
- [x] 7.1 Add reveal-on-scroll keyframes + `animation-timeline: view()` behind a no-preference guard.
- [x] 7.2 Add the animated underline and refined hover states for links.
- [x] 7.3 Add a smooth theme color transition (guarded).
- [x] 7.4 Ensure reduced-motion fully suppresses all movement.
- [x] 7.5 Confirm the unsupported-fallback leaves content visible and no JS was added.

## Implementation Details
Add motion utilities/rules to `src/styles/global.css`; apply reveal/underline classes in the section components from task_05. See TechSpec "Technical Considerations" (CSS-only animation, progressive enhancement). Depends on task_05 (the restyled sections receive the motion).

### Relevant Files
- `src/styles/global.css` — keyframes, scroll-driven reveal, underline, transition rules, reduced-motion guards.
- `src/components/*.astro` — receive reveal/underline classes.

### Dependent Files
- `src/components/ThemeToggle.astro` — the theme transition applies when it flips.

### Related ADRs
- [ADR-001: "Editorial refined" visual direction](../adrs/adr-001.md) — quiet micro-interactions honoring reduced-motion.
- [ADR-003: Class-based theming](../adrs/adr-003.md) — keeps JS limited to the toggle.

## Deliverables
- CSS-only reveal, underline, hover, and theme-transition effects.
- Full reduced-motion suppression and an unsupported-fallback that stays visible.
- Reduced-motion and no-JS-added verification **(REQUIRED)**.

## Tests
- Unit tests:
  - [ ] With `prefers-reduced-motion: reduce` emulated, no reveal/underline/theme-transition movement occurs and all content is visible.
  - [ ] With `prefers-reduced-motion: no-preference`, the reveal and animated underline run.
  - [ ] The motion rules are gated by `@media (prefers-reduced-motion: no-preference)` in the built CSS.
- Integration tests:
  - [ ] No JavaScript is added for animation — the built page's only JS remains the theme guard + toggle.
  - [ ] With scroll-driven timelines unsupported (no `animation-timeline`), revealed content is in its visible end state by default.
  - [ ] `astro check` and `astro build` exit 0.
- Test coverage target: >=80% (reduced-motion path, no-preference path, fallback path).
- All tests must pass.

## Success Criteria
- All tests passing
- Test coverage >=80%
- Subtle motion enriches the page, fully honors reduced-motion, and adds zero JS.


## Implementation Notes (as-built)
- Added CSS-only micro-interactions to `src/styles/global.css`, all under `@media (prefers-reduced-motion: no-preference)`: (1) reveal-on-scroll `.reveal` (`@keyframes reveal-rise` fade+rise, `animation-timeline: view()`, additionally `@supports`-gated) applied to the Experience/Impact/Links sections (hero stays static, above fold); (2) smooth theme transition (`background/color/border-color 0.3s`) on body + section + headings + paragraphs (links/button fade via their own `transition-colors`); (3) animated underline `.link-underline` on the pill links (grows from left via `background-size 0→100%`, `background-origin: content-box` so it sits under the label).
- No JavaScript added — the only client JS remains the flash guard + toggle (2 inline scripts, zero `_astro` bundle). Progressive enhancement: where `animation-timeline: view()` is unsupported the `.reveal` rule never applies, so content shows in its resting (visible) state.
- Verified (worktree, real Chromium): reduced-motion → section `opacity 1`, `animation-name: none`, body `transition-duration: 0s` (fully suppressed, content visible — same path as no-support fallback); no-preference → `animation-name: reveal-rise` + `animation-timeline: view()`, theme transition `0.3s`, underline `0px 1px`→`100% 1px` on hover, section opacity stays 1 (never hidden). Motion primitives survive Lightning CSS in the built stylesheet. `astro check` 0/0, `astro build` 0, CSS 14,766 B.
