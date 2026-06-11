# PRD: CV Site Visual Redesign — "Editorial Refined"

## Overview

A visual redesign of the existing one-page CV site, elevating it from
clean-but-conservative to a **premium, editorial, unmistakably-senior** presence
— without changing what the site says or how it is structured.

- **Problem**: The current design is credible but unremarkable. It does not
  differentiate the owner or signal senior taste, so the content works harder
  than it should to land a leadership impression.
- **Who it is for**: Recruiters and hiring managers evaluating the owner for
  engineering-leadership roles — scanning ~30 seconds, mostly on mobile, forming
  a seniority/taste judgment fast.
- **Why it is valuable**: A memorable, premium, fast-loading presence the owner
  is proud to share, reinforcing the leadership brand through restraint executed
  precisely — not gimmicks.

## Goals

- Read as premium and considered within the first scroll, signaling senior taste.
- Preserve 30-second scannability and mobile-first speed — no regression to load
  or clarity.
- Offer polished light **and** dark experiences matching visitor preference.
- Hold accessibility (WCAG AA) and performance (Lighthouse) at current levels in
  both themes.
- Stay credible — nothing that reads gimmicky to a leadership audience.

## User Stories

- As a recruiter, I instantly sense a senior, polished professional from the
  design, so the track record carries more weight.
- As a recruiter on mobile, the page loads instantly and reads cleanly; the
  styling never slows me or obscures content.
- As a recruiter who uses dark mode, the site respects my preference and looks
  intentional in it.
- As a motion-sensitive visitor, animations are subtle and disabled when I have
  set reduced-motion.
- As the owner, I am proud to put this URL in applications, and updating content
  stays a one-file edit.

## Core Features (all MVP)

1. **Editorial type system** — display headlines + monospace for
   metadata/dates/labels; large, confident hero type as the primary interface.
2. **Disciplined cobalt accent** — one electric-blue accent used sparingly
   (links, key metrics, the theme toggle) over a quiet neutral base.
3. **Light & dark themes** — system-preference default with a manual toggle; soft
   dark grays (not pure black); accent pops in both; choice remembered.
4. **Subtle texture & depth** — faint grain/mesh in hero/section backgrounds;
   never reduces text contrast.
5. **Quiet micro-interactions** — reveal-on-scroll, refined hover states, animated
   underlines, smooth theme transition; fully honor `prefers-reduced-motion`.
6. **Refined, cohesive layout** across all four sections (Hero, Experience,
   Impact, Links) — metric-forward, scannable, type-led, no photo.

**Interaction**: the type system + accent + texture form the premium base; themes
+ micro-interactions add the "alive but quiet" polish; all four sections share one
system for cohesion.

## User Experience

Same flow as today (hero → experience → impact → links), elevated. Mobile-first;
large type and layout collapse to a clean single column. The theme toggle is
easily reachable and keyboard-operable. Accessibility: AA contrast in both themes
(including text over texture), visible keyboard focus, and reduced-motion support.
No onboarding; shared-link metadata stays as-is.

## High-Level Technical Constraints

- Preserve the near-zero-JS posture — client JS limited to the theme toggle.
- Hold the existing Lighthouse budgets (perf >= 90, a11y >= 95; 100/100 target) in
  both themes.
- Single page, mobile-first; both themes meet WCAG AA.

## Non-Goals

- No content changes (the `cv.ts` values remain owner-provided, separate work).
- No photo this round; no bento-grid or expressive/scroll-driven motion (deferred).
- No contact form or contact details (the site's anti-spam stance still holds).
- No multi-page, internationalization, analytics, CMS, new sections, or
  3D/WebGL/gamification.

## Phased Rollout Plan

### MVP (Phase 1)

The six core features — editorial refresh in light+dark with subtle motion across
all sections, holding perf/a11y.

### Phase 2 (optional)

Optional headshot or monogram; tasteful richer motion; a bento accent for Impact;
a print/PDF-styled view.

### Phase 3 (optional)

Alternate accent themes; a subtle hero signature animation.

## Success Metrics

Qualitative and owner-judged (no on-site tracking, per the site's stance):

- The owner is proud to share the URL; it reads as premium and senior.
- Lighthouse performance and accessibility stay at/above current in **both** themes.
- Clean mobile reflow (no horizontal overflow); hero clear above the fold.
- Dark mode looks intentional; toggle works; reduced-motion respected.
- No meaningful load-speed regression vs. the current site.

## Risks and Mitigations

- **Web-font load cost** → subset, preload, `font-display`; keep the font count
  minimal.
- **Texture/accent hurting contrast** → enforce AA in both themes, including over
  texture; verify.
- **Over-polish reading gimmicky** → restraint; subtle motion; a senior-tone
  review pass.
- **Dark-mode flash/contrast** → soft grays, prevent theme flash, AA in both modes.
- **Motion sensitivity** → fully honor `prefers-reduced-motion`.
- **Scope creep toward maximal** → hold MVP to disciplined editorial; defer
  bento/expressive motion.

## Architecture Decision Records

- [ADR-001: "Editorial refined" visual direction via a full disciplined refresh](adrs/adr-001.md)
  — editorial type system, single cobalt accent, subtle texture, light/dark with
  toggle, quiet motion, type-led; alternatives (hero-only, maximal bento+motion)
  rejected.

## Open Questions

- Exact display/heading typeface and the monospace pairing (defer to design/TechSpec).
- The precise cobalt shade that holds AA in both light and dark.
- Grain intensity and whether to use pure grain vs. a faint mesh gradient.
- Phase 2 photo-vs-monogram decision.
