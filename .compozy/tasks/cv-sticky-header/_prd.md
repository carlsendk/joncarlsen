# PRD: Sticky Header — persistent identity, navigation, and theme control

## Overview

The site is a static, hub-and-spoke portfolio. The home page carries the full
identity (name, "Executive Engineering Leadership", value proposition); every
other page repeats its own inline back-link and lets the page body carry
identity. The dark/light toggle floats alone in the corner, and back-navigation
is scattered and inconsistent across pages.

This feature adds **one persistent sticky header on every page**. It travels with
the reader and carries, in one consistent bar: a contextual back-link, the
compact identity (name + title), the two key profile links (LinkedIn, GitHub) as
icons, and the dark/light theme toggle — which moves out of its floating corner
into the header.

It is for the site's readers — recruiters, hiring managers, and prospective
clients evaluating a senior technology leader — who, after scrolling into a CV or
case study, currently lose the name, the way back, and quick access to profiles.
It is valuable because identity, navigation, and theme control become reachable
at any scroll position on any page, presented once, consistently.

## Goals

- Keep the owner's name and "Executive Engineering Leadership" title visible at
  any scroll position on every page.
- Give every page one consistent back affordance that preserves the current
  step-back hierarchy (no navigation regression).
- Surface LinkedIn and GitHub as recognizable icon links, reachable from
  anywhere.
- Consolidate the floating theme toggle and the scattered per-page back-links
  into a single chrome element.
- Make the central name/title visually distinct enough to read as a deliberate
  masthead, without breaking the site's quiet design language.

## User Stories

**Primary persona — Recruiter / hiring manager (time-pressed evaluator)**

- As a recruiter who has scrolled deep into a case study, I want the name and
  title still visible so that I never lose track of whose work I'm reading.
- As a hiring manager, I want a clear, consistent way back so that I can step up
  a level without scrolling to the top or using the browser back button.
- As an evaluator, I want LinkedIn and GitHub one click away from any page so
  that I can verify the person the moment I'm convinced.

**Secondary persona — Prospective client / advisor lead**

- As a prospective client reading at night, I want the theme toggle always
  reachable so that I can switch to dark mode wherever I am on the page.

**Owner persona — Site owner maintaining content**

- As the owner, I want the header to read identity, links, and the theme toggle
  from existing content so that I maintain them in one place and they appear
  correctly site-wide.

## Core Features

Grouped by priority. Wave 1 is the MVP.

**1. Persistent sticky header on every page (Wave 1, foundational)**
A single shared bar on every route including home, always visible (pinned at the
top, no scroll-driven motion). One component, inherited site-wide.

**2. Compact identity (Wave 1)**
The header shows the name and the "Executive Engineering Leadership" title at a
compact scale. On home it coexists with the larger Hero, differentiated by size
so it reads as deliberate, not redundant.

**3. Contextual back-link (Wave 1)**
A back affordance that preserves today's hierarchy: `← Overview` on `/cv`;
`← Back to CV` on `/impact`, `/work`, `/work/<slug>`; none on home. Replaces the
per-page inline back-link blocks.

**4. LinkedIn + GitHub icon links (Wave 1)**
The two key profiles as recognizable icon links with accessible labels, reachable
from any page. The existing Knowledge Base link stays in the page body's links
section.

**5. Theme toggle absorbed into the header (Wave 1)**
The dark/light toggle moves from its floating corner into the header's utility
cluster, so the site has one chrome element rather than two. Its existing
behavior (persisted preference, no flash) is preserved.

**6. Distinct header surface (Wave 1)**
A translucent surface (the page background with a backdrop blur) and a hairline
bottom border separate the header from content beneath and let the central
name/title stand out — quiet, on-brand with the existing soft aesthetic.

## User Experience

**Reader journey**

1. Lands on home; sees the large Hero and, above it, the compact header bar with
   name, links, and toggle.
2. Scrolls or navigates to `/cv`, `/impact`, or a case study; the header stays
   pinned — name and title remain visible, the back-link now reads the right
   destination for that page.
3. Uses the header at any point to switch theme, open LinkedIn/GitHub, or step
   back a level — without scrolling to the top.

**Owner journey**

1. Edits name, title, or profile URLs in the existing content source.
2. The header reflects the change site-wide on the next build; no per-page chrome
   to update.

**UI/UX considerations**

- The bar stays compact (well under ~10% of viewport height) so it never crowds
  the single-column reading layout.
- The back-link, icon links, and toggle must be keyboard-accessible with a
  visible focus indicator, and focusable content must not be hidden beneath the
  sticky bar.
- Icon links carry accessible names ("LinkedIn", "GitHub"); a non-applicable
  back-link (home) is simply absent, not a broken affordance.
- The header must respect the print stylesheet — hidden when printing, alongside
  the other chrome — so the print/PDF CV is unaffected.
- Labels stay consistent with the site ("Overview", "CV") and the existing
  mono-uppercase nav styling.

## High-Level Technical Constraints

- The site is static with near-zero JavaScript; the header adds no scroll-driven
  script. The only associated script remains the existing theme toggle.
- Reuse the existing identity and profile-link content source; introduce no new
  content store.
- Preserve existing reader-facing performance, the no-flash theme behavior, and
  the print-friendly output.
- The header must not obscure keyboard focus or break skip-link/focus behavior.

## Non-Goals (Out of Scope)

- No hide-on-scroll, shrink-on-scroll, or appear-after-fold behavior (see
  ADR-002).
- No mobile hamburger / collapsible menu; the bar's contents are few enough to
  show directly.
- No new navigation destinations or a full site nav menu — only the existing
  back-step targets.
- No Knowledge Base or additional links in the header (Wave 1); only LinkedIn +
  GitHub.
- No visual redesign beyond the header surface itself; the broader visual system
  is owned elsewhere.
- No search, in-page section anchors, or progress indicator in the header.

## Phased Rollout Plan

### MVP (Phase 1 / Wave 1)

- Persistent always-visible sticky header on every page.
- Compact identity (name + title), reconciled with the home Hero by scale.
- Contextual back-link replacing per-page inline back-links.
- LinkedIn + GitHub icon links; theme toggle absorbed into the header.
- Distinct translucent/blurred header surface; print-hidden; accessible.
- **Success criteria to proceed**: header appears correctly on all five routes
  with the right back-link target per page; theme toggle works from the header
  with no flash; LinkedIn/GitHub reachable everywhere; keyboard focus never
  hidden behind the bar; print output unchanged.

### Phase 2 (optional, only if needed)

- Responsive refinement if any header element crowds on the smallest viewports
  (e.g., condense the title or icons).
- **Success criteria**: header reads cleanly at the narrowest supported width
  with no overlap or wrap problems.

## Success Metrics

- **Persistent identity**: name + title visible at any scroll position on 100% of
  pages.
- **Navigation integrity**: the back-link target on every page matches the prior
  step-back hierarchy; zero pages send the reader to the wrong level.
- **Single source**: identity, links, and toggle authored once and correct
  site-wide (owner-verified).
- **Accessibility**: keyboard focus never obscured by the header; all header
  controls reachable and labeled; AA contrast in both themes.
- **No regression**: print/PDF CV and theme no-flash behavior unchanged.

## Risks and Mitigations

- **Identity duplication on home** — name appears in both the header and the
  Hero. *Mitigation*: compact header scale vs. large Hero so it reads as
  deliberate.
- **Crowding on small screens** — several elements in one bar. *Mitigation*: keep
  it compact; defer responsive condensing to Phase 2 only if needed.
- **Accessibility regressions from a sticky bar** — obscured focus, broken skip
  behavior. *Mitigation*: short bar, visible focus indicator, ensure focused
  content isn't hidden beneath it.
- **Print/theme regressions from moving the toggle** — chrome changes could leak
  into print or reintroduce a flash. *Mitigation*: explicit print-hidden header
  and preserved no-flash toggle behavior as success criteria.

## Architecture Decision Records

- [ADR-001: A persistent identity sticky header on every page with a contextual back-link](adrs/adr-001.md) — Shared header on every route carrying identity, contextual back-link, LinkedIn/GitHub icons, and the absorbed theme toggle; rejects uniform-overview and name-as-home-link models.
- [ADR-002: Always-visible, pure-CSS sticky behavior](adrs/adr-002.md) — Pin via `position: sticky` with no scroll-driven JS; rejects hide-on-scroll and appear-after-fold for accessibility and the near-zero-JS ethos.

## Open Questions

- On the smallest viewports, if the bar crowds, which element yields first — the
  title (shortened), the icons (smaller), or the back-link (icon-only)?
- Should the compact header identity on home fade or stay static relative to the
  Hero, or is plain coexistence by scale sufficient?
- Is the existing mono-uppercase nav styling the right type treatment for the
  header's name/title, or should the name use the display face for masthead
  emphasis?
