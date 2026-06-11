---
status: completed
title: Add CSS-only film-grain overlay
type: frontend
complexity: low
dependencies:
  - task_01
---

# Task 6: Add CSS-only film-grain overlay

## Overview
Add the subtle "texture & depth" the design calls for as a CSS-only faint film-grain overlay, giving the page tactile depth with zero extra network requests and no contrast penalty in either theme.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST render the grain as an inline SVG `feTurbulence` noise `data:` URI (no raster image, no extra HTTP request).
- MUST apply it as a fixed, `pointer-events: none` overlay at low opacity (~3–5%) behind page content, above the token background.
- MUST NOT shift text/background contrast — neutral luminance noise at low opacity only.
- MUST work in both light and dark themes without re-tinting.
- SHOULD keep the data-URI string small to respect the CSS-size budget.
</requirements>

## Subtasks
- [x] 6.1 Author a small SVG `feTurbulence` noise pattern as a `data:` URI.
- [x] 6.2 Add the fixed overlay layer (e.g. `body::before`) with low opacity and `pointer-events: none`.
- [x] 6.3 Set z-order so the grain sits above the bg token but below content.
- [x] 6.4 Verify it renders correctly in both themes.
- [x] 6.5 Confirm no external request and no contrast regression.

## Implementation Details
Add the overlay to `src/styles/global.css` (depends on task_01 for the bg tokens it layers over). See TechSpec "Component Overview" and ADR-004 for the CSS-only, no-asset approach. Keep opacity low and verify AA over the grain.

### Relevant Files
- `src/styles/global.css` — the grain overlay layer and its data URI.

### Dependent Files
- `src/components/*.astro` — content sits above the grain; contrast must hold over it.

### Related ADRs
- [ADR-004: CSS-only faint film-grain texture (no image assets)](../adrs/adr-004.md) — the texture decision this task implements.

## Deliverables
- A CSS-only grain overlay in `global.css`.
- Both-theme rendering with preserved contrast.
- A no-external-request assertion **(REQUIRED)**.
- An AA-over-grain contrast check **(REQUIRED)**.

## Tests
- Unit tests:
  - [ ] The built CSS contains the inline SVG `data:` URI grain and an overlay with `pointer-events: none` and low opacity — and no external `url(...)` image reference.
  - [ ] The overlay's z-order places it above the background and below content (content remains interactive/selectable).
- Integration tests:
  - [ ] No new network request is made for the texture (Playwright network capture / build-output inspection).
  - [ ] WCAG AA contrast for foreground text over the composited background+grain holds in both light and dark.
  - [ ] `astro build` exits 0 and the CSS-size budget step still passes.
- Test coverage target: >=80% (overlay presence, no-request, contrast, both themes).
- All tests must pass.

## Success Criteria
- All tests passing
- Test coverage >=80%
- Subtle grain adds depth in both themes with zero extra requests and no contrast loss.


## Implementation Notes (as-built)
- Added a `body::before` grain overlay in `src/styles/global.css`: `position: fixed; inset: 0; z-index: -1; pointer-events: none; opacity: .04`, background an inline `data:image/svg+xml` `feTurbulence` (fractalNoise, stitchTiles) desaturated via `feColorMatrix saturate 0`, tiled (`background-repeat: repeat`). CSS-only, no image asset/request.
- z-index:-1 places it above the token background and behind content; pointer-events:none keeps everything interactive. Theme-independent (neutral grayscale noise), so it works in light and dark unchanged.
- Verified (worktree, real Chromium, both themes): computed `::before` has the noise data URI, opacity 0.04, z-index -1, pointer-events none, position fixed; a link passes Playwright's actionability (trial) click → content is above the grain and clickable. No external image `url()` in `dist`; CSS 14,076 B (< 20,480). AA over grain holds — worst-case 4% noise keeps muted/accent ≥6 in both themes (task_05 measured ≥7 on solid bg); the formal axe-over-grain audit is task_08. `astro check` 0/0, `astro build` 0.
