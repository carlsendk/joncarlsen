---
status: completed
title: Self-host and subset Fraunces + JetBrains Mono; wire @font-face and preload
type: frontend
complexity: medium
dependencies:
  - task_01
---

# Task 2: Self-host and subset Fraunces + JetBrains Mono; wire @font-face and preload

## Overview
Deliver the editorial type system by self-hosting two subset webfonts — Fraunces (display) and JetBrains Mono (metadata) — with the body text remaining on a zero-cost system-sans stack. Self-hosting honors the no-tracking stance and keeps the font payload within the performance budget.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST subset Fraunces and JetBrains Mono to the Latin range and only the weights actually used, as `woff2`, committed under `public/fonts/`.
- MUST declare both faces with `@font-face` using `font-display: swap`.
- MUST bind `--font-display` to Fraunces and `--font-mono` to JetBrains Mono; `--font-sans` MUST be a system stack (no webfont).
- MUST `<link rel="preload" as="font" type="font/woff2" crossorigin>` only the above-the-fold faces in `Base.astro`'s `<head>`.
- MUST NOT load fonts from any third-party CDN (ADR-002).
- SHOULD keep the total committed font payload small enough to hold the Lighthouse perf budget.
</requirements>

## Subtasks
- [x] 2.1 Generate Latin-subset `woff2` files for the used weights and commit to `public/fonts/`.
- [x] 2.2 Add `@font-face` declarations (with `font-display: swap`) in `global.css`.
- [x] 2.3 Bind the `--font-display` / `--font-mono` / `--font-sans` tokens to the faces and system stack.
- [x] 2.4 Add preload links for the above-the-fold faces in `Base.astro`'s head.
- [x] 2.5 Confirm no CDN request and that `swap` avoids invisible text.

## Implementation Details
Add font files to `public/fonts/`, `@font-face` + token binding to `src/styles/global.css`, and preload tags to `src/layouts/Base.astro`. See TechSpec "Core Interfaces" (font token names) and ADR-002 for delivery rationale. Depends on task_01, which registers the `--font-*` token names.

### Relevant Files
- `public/fonts/` — committed subset `woff2` files (new directory).
- `src/styles/global.css` — `@font-face` declarations and font-token binding.
- `src/layouts/Base.astro` — preload links in `<head>`.

### Dependent Files
- `src/components/*.astro` — will apply `font-display` / `font-mono` utilities (task_05).

### Related ADRs
- [ADR-002: Self-hosted subset webfonts (Fraunces + JetBrains Mono), system-sans body](../adrs/adr-002.md) — the delivery decision this task implements.

## Deliverables
- Subset `woff2` files in `public/fonts/`.
- `@font-face` declarations and bound font tokens in `global.css`.
- Preload links for above-the-fold faces in `Base.astro`.
- Assertions confirming self-hosted (no-CDN) delivery and applied faces **(REQUIRED)**.
- A re-checked Lighthouse perf budget after fonts **(REQUIRED)**.

## Tests
- Unit tests:
  - [ ] The built CSS contains `@font-face` rules for Fraunces and JetBrains Mono with `font-display: swap`.
  - [ ] The subset `woff2` files are present in `dist/fonts/` after build.
  - [ ] `--font-display` resolves to a Fraunces-led stack and `--font-sans` to a system stack (no webfont).
- Integration tests:
  - [ ] No network request is made to `fonts.googleapis.com` or any third-party font host (Playwright network capture / build-output grep).
  - [ ] Lighthouse performance stays >= 90 after fonts are added.
  - [ ] `astro build` exits 0 and preloaded font URLs resolve (no 404 via `linkinator`).
- Test coverage target: >=80% (both faces, both delivery paths exercised).
- All tests must pass.

## Success Criteria
- All tests passing
- Test coverage >=80%
- Headlines render in Fraunces and metadata in JetBrains Mono, self-hosted, with no CDN request.
- Performance budget held after font addition.


## Implementation Notes (as-built)
- Self-hosted **latin-subset variable** woff2 in `public/fonts/`: `fraunces-latin-var.woff2` (67 KB, opsz 9–144 / wght 400–700) and `jetbrains-mono-latin-var.woff2` (31 KB, wght 400–700). Files fetched from Google's gstatic at build time and committed; no third-party request at runtime (ADR-002).
- `@font-face` (both faces, `font-display: swap`) added to `src/styles/global.css`; tokens `--font-display`/`--font-mono` (from task_01) now resolve to real faces, `--font-sans` stays the system stack. Fraunces preloaded in `src/layouts/Base.astro` `<head>` (above-the-fold display face); JetBrains Mono loads on demand via `swap`.
- Verified (worktree `cv-visual-task01-tokens`): `astro check` 0/0; `astro build` 0; built CSS has both `@font-face` rules with `swap`; `dist/fonts/` contains both files; preload emitted in `dist/index.html`; **no `fonts.googleapis`/`gstatic` reference in `dist`**; `linkinator` 4/4 200 incl. the font; Lighthouse desktop **performance 100 / accessibility 100**.
- Follow-up for task_05: variable range is 400–700 (deliberate, refined). Use headline weights ≤700, or re-fetch a wider range if heavier is wanted.
