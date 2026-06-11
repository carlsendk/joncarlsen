# TechSpec: Central Style System for the CV Site

## Executive Summary

Convert the site's duplicated Tailwind utility strings into a small vocabulary of
named role classes defined once in `src/styles/global.css` under
`@layer components`, each implemented with `@apply` over the exact utilities in use
today. Because the role classes `@apply` the same utilities, compiled CSS is
identical to the current output, so the whole-site conversion is verifiably
non-visual except where a role's value is deliberately collapsed to its canonical
form (the drift fixes). A new ESLint pass — a Tailwind class-linting plugin plus
one custom rule enforcing the canonical font-size scale and banning colour literals
in markup — runs in the Netlify build command before the build, so drift fails the
deploy. A short written style spec records the canonical scale.

Primary trade-off: introducing an ESLint toolchain to a previously lint-free repo
adds dependencies and build time, accepted in exchange for conventional,
editor-integrated enforcement of the drift signals that motivated the work. See PRD
"Goals" and "Core Features"; this spec covers HOW.

## System Architecture

### Component Overview

- **Role-class layer** (`global.css` → `@layer components`): the single source of
  truth. Owns one class per recurring role (`cv-section`, `cv-eyebrow`,
  `cv-entry-title`, `cv-body`, `cv-meta`, `cv-link`, `cv-pill`, `cv-pill-solid`,
  `cv-card`, `cv-badge`, `cv-metric`, `cv-detail`). Built on existing tokens.
- **Components & pages** (`src/components/*.astro`, `src/pages/**`, `work/[slug].astro`):
  consume role classes instead of duplicated utility strings. Per-instance colour
  (`text-fg`/`text-muted`) and genuine one-off modifiers remain in markup.
- **Drift guard** (`eslint.config.mjs` + custom rule, run via `npm run lint`):
  static analysis over `src/`. Stock Tailwind rules enforce class hygiene; the
  custom rule enforces the canonical font-size scale and bans colour literals.
- **Build gate** (`netlify.toml`): the build command runs `npm run lint` first, so
  a violation fails the deploy. No runtime component; everything is build-time.
- **Style spec** (`docs/` markdown): human-readable canonical scale and token rules.

Data flow: tokens → role classes (`@apply`) → component markup (compiled by Tailwind
via PostCSS) → static HTML/CSS. The guard reads source markup; it produces no output
other than pass/fail.

## Implementation Design

### Core Interfaces

This is a static Astro + CSS site (TypeScript/CSS, no Go service layer), so the
"interface" other code depends on is the role-class contract in `global.css` and
the custom lint rule's options type.

```css
/* global.css — the role-class contract (single source of truth) */
@layer components {
  .cv-section     { @apply reveal mx-auto max-w-2xl border-t border-border px-6 py-14; }
  .cv-eyebrow     { @apply font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted; }
  .cv-entry-title { @apply font-display text-xl font-semibold tracking-tight; }
  .cv-body        { @apply leading-relaxed; }              /* size = text-base default */
  .cv-meta        { @apply font-mono text-xs uppercase tracking-wider text-muted; }
  .cv-detail      { @apply text-sm leading-relaxed; }      /* sub-detail tier (14px) */
}
```

```ts
// custom ESLint rule options (canonical-scale enforcement)
interface CanonicalScaleOptions {
  allowedTextSizes: string[];   // e.g. ["text-xs","text-sm","text-base","text-xl","text-2xl","text-3xl","text-5xl","text-6xl"]
  allowedArbitrary: string[];   // documented system arbitraries, e.g. ["tracking-[0.2em]"]
  banColorLiteralsInMarkup: boolean;
}
```

### Data Models

No data models or persistence. The only structured artefact is the role
vocabulary (above) and the canonical type scale, sourced from the cv-visual-design
type-scale amendment:

- Display title (h1): Fraunces, `text-5xl`/`6xl`
- Entry title (h3): Fraunces, `text-xl`
- Impact metric: Fraunces, `text-2xl`/`3xl`, `text-accent`
- Section eyebrow (h2): JetBrains Mono, `text-xs`, `font-medium`, `tracking-[0.2em]`
- Meta line: JetBrains Mono, `text-xs`, `tracking-wider`
- Body prose: Hanken Grotesk, `text-base`, `leading-relaxed`
- Sub-detail (e.g. Education activities): `text-sm`

### API Endpoints

Not applicable — static site, no API surface.

## Integration Points

Not applicable — no external services. The only system boundary touched is the
Netlify build command in `netlify.toml`, where `npm run lint` is prepended to the
existing gate.

## Impact Analysis

| Component | Impact Type | Description and Risk | Required Action |
|-----------|-------------|----------------------|-----------------|
| src/styles/global.css | modified | Add `@layer components` role classes via `@apply`. Low risk (compiled CSS identical). | Author role vocabulary; collapse drift to canonical values. |
| src/components/*.astro (17) | modified | Replace duplicated utility strings with role classes; keep per-instance colour. Low-medium risk (visual). | Convert each; verify computed styles unchanged. |
| src/pages/** + work/[slug].astro | modified | Same conversion; case-study body uses `cv-body` (shared 16px). Medium risk (prose layout). | Convert; verify article still reads correctly. |
| package.json | modified | Add ESLint, Astro parser, Tailwind plugin devDeps; add `lint` script. Low risk. | Add deps + script. |
| eslint.config.mjs | new | Flat config + custom canonical-scale rule. Medium risk (false positives/version skew). | Author config + rule; tune allowlist. |
| netlify.toml | modified | Prepend `npm run lint` to build command. Low risk (gate change). | Update command; verify build passes. |
| docs/ style-spec.md | new | Written canonical scale. No runtime risk. | Author spec. |

## Testing Approach

### Unit Tests

- **Custom ESLint rule**: rule-level tests (ESLint RuleTester) — a `text-lg` in
  markup is reported; a `text-base` is not; `tracking-[0.2em]` is allowed; a
  `#1d4ed8`/`text-[#...]` colour literal in markup is reported; a token utility
  (`text-accent`) is not.
- **Role-class compilation**: assert `global.css` compiles and each role class
  appears in the built CSS (build succeeds, no `@apply` of an unknown utility).

### Integration Tests

- **No-visual-regression (acceptance gate)**: with the dev server, capture computed
  styles (font-family, font-size, font-weight, line-height, margins) for a
  representative element of every role on `/cv`, `/impact`, `/work`, and a
  `/work/<slug>` page, before and after conversion. The only permitted diffs are
  the enumerated drift corrections. Uses the established Playwright measurement
  method.
- **Guard-fails-on-drift**: seed an off-scale size (`text-lg`) in one component;
  confirm `npm run lint` exits non-zero; remove it; confirm green. Proves the guard
  works end-to-end.
- **Build gate**: run the full Netlify command locally (`npm run lint && npm run
  check && npm run build && linkinator`) and confirm exit 0; re-verify Lighthouse
  performance ≥ 0.9 and accessibility ≥ 0.95.

## Development Sequencing

### Build Order

1. **Define the role-class layer** in `global.css` (`@apply` exact current
   utilities) and collapse each role to its canonical value — no dependencies.
2. **Convert the /cv components** to role classes — depends on step 1.
3. **Convert the index pages and the case-study layout** (case-study body → `cv-body`)
   — depends on step 1; parallelisable with step 2.
4. **No-visual-regression verification** across all pages — depends on steps 2 and 3.
5. **Add ESLint toolchain + stock Tailwind rules** (`eslint.config.mjs`, deps,
   `lint` script) — depends on step 1 (needs final class names) ; can start after 1.
6. **Add the custom canonical-scale rule** + its RuleTester tests — depends on step 5.
7. **Wire `npm run lint` into the Netlify build command** and run the full gate —
   depends on steps 4 and 6.
8. **Write the style spec** in `docs/` — depends on step 1 (final scale); can be
   authored in parallel, finalised after step 4.

### Technical Dependencies

- Node 22 (already the Netlify build environment).
- ESLint 9 flat-config-compatible Astro parser + Tailwind v4-compatible class plugin
  (exact packages chosen at step 5; pin versions).
- No infrastructure or external-service dependencies.

## Monitoring and Observability

Build-time only; no runtime telemetry. Observability = the build gate output: the
`npm run lint` step reports violations with file/line; the Lighthouse plugin reports
perf/accessibility scores per deploy. A failed lint or missed budget fails the
Netlify build and is visible in the deploy log.

## Technical Considerations

### Key Decisions

- **Decision**: Role classes via `@apply` in `@layer components` (ADR-002).
  **Rationale**: identical compiled CSS → verifiable non-regression, least churn.
  **Trade-off**: classes couple to utility names. **Rejected**: plain-CSS-from-tokens
  (pixel-drift risk), Astro wrapper components (high churn).
- **Decision**: ESLint + Tailwind plugin + one custom canonical-scale rule, in the
  build gate (ADR-003). **Rationale**: conventional, editor-integrated, and the
  custom rule covers the project-specific drift signals stock rules cannot.
  **Trade-off**: new toolchain + bespoke rule maintenance. **Rejected**: custom Node
  script, stylelint (blind to markup), stock-rules-only (misses off-scale sizes).
- **Decision**: One shared `cv-body` role at 16px including case-study articles.
  **Rationale**: single source of truth; no second body size for the guard to special-case.

### Known Risks

- **Tailwind v4 `@apply` scope**: keep all role classes in `global.css` (theme in
  scope); avoid component `<style>` blocks that would need `@reference`. Likelihood
  low if confined to the entry stylesheet.
- **ESLint/Astro/plugin version skew** (Astro 6, ESLint 9 flat config, v4 plugin):
  pin compatible versions; prototype the config early (step 5). Likelihood medium.
- **Build-time increase** from linting: scope ESLint to `src/`, keep config lean;
  re-verify Netlify build duration and Lighthouse budgets.
- **Custom-rule false positives**: maintain an allowlist of documented system
  arbitraries (e.g. `tracking-[0.2em]`); cover with RuleTester cases.
- **Conversion visual regression**: the Playwright computed-style diff is the gate;
  any non-enumerated diff is a defect, not an accepted change.

## Architecture Decision Records

- [ADR-001: Centralise styling into a named component-class system in one cohesive pass](adrs/adr-001.md) — Whole-site single-source-of-truth roles, drift fixed, spec + guard, one pass.
- [ADR-002: Express style roles as @apply component classes in global.css @layer components](adrs/adr-002.md) — Role classes `@apply` the exact current utilities for pixel-identical output.
- [ADR-003: Drift guard via ESLint + Tailwind plugin plus a custom canonical-scale rule, in the build gate](adrs/adr-003.md) — ESLint + custom size-scale/colour rule, wired into the Netlify build command.
