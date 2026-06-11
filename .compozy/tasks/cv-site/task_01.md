---
status: completed
title: Scaffold Astro + Tailwind project with GitHub Pages config
type: infra
complexity: medium
dependencies: []
---

# Task 1: Scaffold Astro + Tailwind project with GitHub Pages config

## Overview
Initialize the greenfield repository as an Astro project styled with Tailwind and
configured to deploy at the custom domain `joncarlsen.dk` on GitHub Pages. This
establishes the buildable foundation — config, base layout, and CNAME — that
every other task depends on.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST initialize an Astro project at the repo root with working `astro build` and `astro check` scripts.
- MUST add the Tailwind integration with content globs configured so unused styles are purged from the production build.
- MUST set `site: 'https://joncarlsen.dk'` and `base: '/'` in the Astro config (per ADR-006).
- MUST commit `public/CNAME` containing exactly the single line `joncarlsen.dk`.
- MUST provide a reusable base layout exposing slots/props for page `<title>`, meta description, and Open Graph tags.
- SHOULD pin dependency versions and keep the dependency surface minimal (per ADR-003).
</requirements>

## Subtasks
- [x] 1.1 Initialize the Astro project structure at the repository root.
- [x] 1.2 Add and configure the Tailwind integration (Tailwind 4 via PostCSS; auto source detection purges unused utilities — see Implementation Notes).
- [x] 1.3 Set `site` and `base` in the Astro config for the custom domain.
- [x] 1.4 Add `public/CNAME` with the value `joncarlsen.dk`.
- [x] 1.5 Create a base layout with title, description, and OG metadata slots.
- [x] 1.6 Confirm `astro build` and `astro check` succeed on the empty shell.

## Implementation Details
Create the project skeleton at the repo root. See TechSpec "System Architecture"
(the `astro.config` and `public/CNAME` bullets) and "Development Sequencing"
build-order step 1 for the intended structure and config values. Keep a single
base layout that pages compose; do not add per-page boilerplate.

### Relevant Files
- `astro.config.mjs` — set `site`/`base` and register the Tailwind integration.
- `package.json` — declare dependencies and `dev`/`build`/`check` scripts.
- `tsconfig.json` — TypeScript config so `astro check` validates content types.
- `src/layouts/Base.astro` — HTML shell exposing title/description/OG slots.
- `public/CNAME` — single line `joncarlsen.dk` to preserve the custom domain.

### Dependent Files
- `src/pages/index.astro` — will compose the base layout (task 03).
- `src/data/cv.ts` — content file added in task 02.
- `.github/workflows/deploy.yml` — CI builds this project (task 05).

### Related ADRs
- [ADR-003: Astro as the static-site stack](../adrs/adr-003.md) — defines the framework and project layout.
- [ADR-005: Style with Tailwind CSS](../adrs/adr-005.md) — defines the styling toolchain.
- [ADR-004: Host on GitHub Pages](../adrs/adr-004.md) — deploy target informing config.
- [ADR-006: Custom domain joncarlsen.dk](../adrs/adr-006.md) — `site`/`base` and CNAME values.

### Implementation Notes (as-built)
- **Tailwind wired via PostCSS, not the Vite plugin.** `@tailwindcss/vite@4.3` pulls vite 8 while Astro 5.18 bundles vite 6, causing an `astro check` type error and a duplicate-vite tree. Switched to `@tailwindcss/postcss` + `postcss.config.mjs`, which pulls no vite of its own — `astro check` passes with full type-checking and Tailwind 4 auto-purge still works. Satisfies ADR-005's intent (Tailwind, utility classes, small purged output); only the plumbing changed. Follow-up: ADR-005/TechSpec mention the Vite plugin — a one-line doc note could align them, but no behavior change is needed.
- **Versions pinned** (Astro on the 5.x line, deliberately not 6.x: Astro 6's rolldown-vite is currently incompatible with the Tailwind plugin). `package-lock.json` is committed so installs reproduce this exact set.
- **TypeScript pinned `^5`** (corrected during task_02): `@astrojs/check` requires `peer typescript@"^5"`, so the original `^6` pin made `npm ci` fail. `package.json` + `package-lock.json` updated accordingly; `npm ci` now exits 0.
- **Files created:** `package.json`, `package-lock.json`, `astro.config.mjs`, `postcss.config.mjs`, `tsconfig.json`, `.gitignore`, `src/styles/global.css`, `src/layouts/Base.astro`, `src/pages/index.astro` (placeholder, replaced in task 03), `public/CNAME`.

## Deliverables
- A buildable Astro + Tailwind project at the repo root.
- `astro.config` with `site: 'https://joncarlsen.dk'`, `base: '/'`, Tailwind registered.
- `public/CNAME` containing `joncarlsen.dk`.
- `src/layouts/Base.astro` with metadata slots.
- Build and type-check verification **(REQUIRED)** — `astro build` and `astro check` pass.
- Integration check that Tailwind classes compile **(REQUIRED)**.

## Tests
- Unit tests (build/type gates):
  - [x] `astro build` exits 0 and emits `dist/index.html` from a placeholder page.
  - [x] `astro check` exits 0 with zero type errors.
  - [x] Built asset URLs resolve under `/` (base `'/'`), not a `/joncarlsen` subpath.
  - [x] `dist/CNAME` contains exactly `joncarlsen.dk` after build.
- Integration tests:
  - [x] A sample element using a Tailwind utility class produces matching compiled CSS in `dist/`, and an unused utility is absent (purge works).
- Test coverage target: >=80% (no runtime logic to unit-cover at this stage; the build and type-check gates are the coverage equivalent and must all pass).
- All tests must pass.

## Success Criteria
- All tests passing
- Test coverage >=80% (build + type-check gates all green)
- `dist/` contains `index.html` and a `CNAME` with the correct domain.
- Tailwind classes compile and unused styles are purged from production output.
- Project is ready for content (task 02) and components (task 03).
