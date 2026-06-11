# PRD: Central Style System for the CV Site

## Overview

The CV site looks consistent today only because its styling conventions are
re-typed by hand in every component. Colour and font tokens are centralised, but
the recurring visual "roles" — section shells, headings, body text, meta lines,
links, cards — are expressed as long Tailwind utility strings duplicated across
23 files. Because there is no single definition per role, the same kind of element
drifts to slightly different sizes, letter-spacing, and weights over time. The
owner has repeatedly hit this (body prose appearing at two sizes; meta lines with
mismatched tracking), each fix being a manual hunt-and-patch.

This effort establishes a **single source of truth for styles**: one named
definition per visual role, applied across the whole site, with the existing
drift corrected to one canonical scale, documented in a short style spec, and
protected by an automated guard so it cannot silently return.

It is for the **site owner/maintainer**, who needs to change a style once and have
it apply everywhere, and it preserves the experience of the **recruiter/visitor**,
who should perceive a flawlessly consistent, premium document.

## Goals

- Eliminate duplicated style definitions: every recurring visual role has exactly
  one canonical definition used everywhere it appears.
- Resolve the existing visual drift so "similar items" render identically.
- Make any shared style changeable in one place, with the change applying site-wide.
- Prevent future drift with a written style spec and an automated guard.
- Preserve the current look (apart from the intentional drift corrections) and the
  site's performance and accessibility budgets.

## User Stories

- As the **site maintainer**, I want to change a shared style (e.g. body text size,
  section spacing) in one place, so that every component updates together and I
  never hunt through files again.
- As the **site maintainer**, I want every recurring element type to have one
  named role, so that when I add a new section it inherits the correct style by
  default instead of me re-typing a string I might get subtly wrong.
- As the **site maintainer**, I want a written record of the canonical scale, so
  that I (or a future collaborator) know the intended system rather than reverse-
  engineering it from markup.
- As the **site maintainer**, I want a check that fails when a style regresses
  (a re-introduced ad-hoc style, an off-scale size, a colour literal), so that
  drift is caught automatically rather than noticed weeks later.
- As a **recruiter/visitor**, I want every comparable element to look identical,
  so that the document reads as meticulously crafted and senior.

## Core Features

- **Named style-role system (must-have).** A complete vocabulary covering every
  recurring role on the site: section shell, section eyebrow/heading, entry title,
  body prose, meta line, text link, pill/button link, card, badge/chip, and impact
  metric. Each role is defined once and reused. This is the single source of truth.
- **Whole-site adoption (must-have).** Every page — the main CV, the impact and
  projects index pages, and the case-study detail pages including their long-form
  body text — uses the role system rather than duplicated styling.
- **Drift correction (must-have).** As roles are consolidated, the existing
  inconsistencies are resolved to one canonical value each (one body size, one
  meta-line letter-spacing, consistent heading weights). Small, intentional visual
  changes are acceptable where they make comparable elements identical.
- **Written style spec (must-have).** A concise, human-readable description of the
  canonical type scale and token-usage rules, kept with the project as the
  reference for future work.
- **Automated drift guard (must-have).** A check, run as part of the build, that
  fails when styling regresses — for example a re-introduced ad-hoc repeated style,
  a font size outside the canonical scale, or a colour literal in markup.
- **No-visual-regression verification (must-have).** Before/after confirmation
  that, apart from the agreed drift corrections, the rendered pages are unchanged.

## User Experience

The maintainer's journey: open the central style definitions, see a named role per
visual element, and edit one definition to restyle everywhere. When building a new
section, apply the matching role name and get the correct, consistent appearance
with no guesswork. Run the build; if a style has drifted outside the system, the
guard reports it with a clear message. Consult the style spec to understand the
intended scale.

The visitor's journey is unchanged: the site looks the same, only more uniform —
every section header, body paragraph, date line, and link is pixel-consistent with
its peers across all pages.

Accessibility and quality considerations carry over unchanged: AA contrast in both
themes, visible keyboard focus, reduced-motion honouring, and the print layout must
all remain intact after the conversion.

## High-Level Technical Constraints

- Must preserve the existing semantic token model (theme switching, light/dark,
  per-theme accent) — the role system builds on tokens, it does not replace them.
- Must hold the current performance budget (Lighthouse performance >= 90) and the
  near-zero-JS posture; this is a styling-structure change, not a feature addition.
- Must hold all current accessibility guarantees (AA contrast both themes, keyboard
  focus, reduced motion) and the print stylesheet.
- No contact details may be introduced anywhere (standing site constraint).

## Non-Goals (Out of Scope)

- No redesign or new visual direction — the editorial look is retained, not changed.
- No new sections, content, or page types.
- No new colours, fonts, or theme behaviour beyond what already exists.
- No change to the build framework or hosting.
- Not creating shared definitions for genuinely one-off styles that appear only
  once — only recurring roles are centralised.

## Phased Rollout Plan

### MVP (Phase 1)
- Define the complete named style-role vocabulary as the single source of truth.
- Convert the whole site to use it, correcting drift to one canonical scale.
- Verify no unintended visual regression and that accessibility/print/perf hold.
- Success criteria: zero duplicated role definitions remain; comparable elements
  render identically; rendered output matches the before state except for agreed
  drift fixes.

### Phase 2
- Publish the written style spec alongside the project.
- Add the automated drift guard to the build.
- Success criteria: the guard passes on the converted site and fails on a seeded
  regression (proving it works); the spec accurately describes the shipped scale.

### Phase 3
- Long-term: the system is the default for all future component work; the guard
  keeps it honest.
- Success criteria: subsequent edits introduce no new duplicated styles or
  off-scale values (guard stays green over time).

## Success Metrics

- **Zero** duplicated role definitions across the site (every recurring role
  defined once).
- **One-place change**: editing a single definition visibly updates every instance.
- **No visual regression**: before/after rendered comparison shows only the agreed
  drift corrections.
- **Guard effectiveness**: the automated check passes on the clean site and fails
  on an intentionally seeded drift.
- **Budgets held**: Lighthouse performance >= 90; accessibility and print output
  unchanged.

## Risks and Mitigations

- **Unintended visual change during mass conversion.** Mitigation: verify computed
  styles before and after across pages; treat any non-agreed diff as a defect.
- **Over-centralisation** — turning a one-off style into a brittle shared definition.
  Mitigation: only create a role for a pattern that genuinely recurs; leave true
  one-offs as-is.
- **Guard friction** — an over-strict check that blocks legitimate work. Mitigation:
  scope the guard to clear regression signals (repeated ad-hoc strings, off-scale
  sizes, colour literals) and keep its messages actionable.
- **Scope creep into redesign** — the temptation to "improve" visuals mid-refactor.
  Mitigation: the only sanctioned visual changes are the enumerated drift fixes;
  anything else is a separate effort.

## Architecture Decision Records

- [ADR-001: Centralise styling into a named component-class system in one cohesive pass](adrs/adr-001.md) — Whole-site single-source-of-truth style roles, drift fixed to one canonical scale, plus a written spec and an automated guard, delivered in one coordinated pass.

## Open Questions

- What exact font-size / spacing values become canonical for each role? (The
  cv-visual-design ADR-001 amendment records a starting scale; the implementation
  should confirm each role's single value as drift is collapsed.)
- Should the case-study long-form body text share the same body role as the CV
  prose, or keep a distinct long-form reading size? (To resolve during conversion.)
- What precise signals should the automated guard enforce, and where should it run
  in the build? (Belongs to the TechSpec.)
