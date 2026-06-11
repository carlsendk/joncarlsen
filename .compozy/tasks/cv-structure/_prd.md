# PRD: CV Structure — order, density, and navigation of the full /cv overview

## Overview

The `/cv` page is the site's **full overview** — the deep tier a reader reaches
when they want everything, deliberately not short (the home page is the short
tier). Today it renders 15 sections in a fixed top-to-bottom run: Hero → Summary
→ Credentials → Timeline → Impact → Approach → Case Studies → Expertise →
Education → Certifications → Publications → Voluntary Leadership → Personal
Details → Interests → Links.

Two things work against the reader. First, the **highest-value proof sits below
the heaviest block**: the quantified Impact band and the Expertise / core
competencies land *after* the dense 40+-bullet Timeline, in the part of the page
where attention has already dropped. Second, a **15-section page has no
wayfinding** — no in-page navigation and no per-section lead-ins — so it reads as
one long wall and forces linear scrolling.

This feature restructures `/cv` for the reader without shrinking it. It
front-loads proof, gives every section a one-line lead-in, adds a sticky in-page
navigation so a long page becomes jump-to-section navigable, and applies
progressive disclosure **only to the long tail** so the page stays a complete
overview — nothing of value is hidden.

It is for the site's readers — recruiters, hiring managers, board contacts, and
prospective clients evaluating a senior engineering leader who have chosen to go
deep. It is valuable because it converts an exhaustive-but-exhausting page into
one that is exhaustive *and* navigable: the same completeness, far better
readability, with the strongest evidence reaching the first screen.

This PRD owns **order, density, and navigation of `/cv` only**. It is
intentionally disjoint from `cv-work-impact`, which owns the
impact/achievements/projects data model and the auto-aggregated `/impact` page.

## Goals

- Put quantified proof and core competencies in the top third of `/cv`, above the
  dense experience timeline, so the strongest evidence is seen first.
- Make a long page navigable: a reader can jump to any section and always know
  where they are, instead of scrolling linearly.
- Make every section skimmable with a one-line lead-in, so a reader decides what
  to read without reading everything.
- Keep `/cv` a true full overview — no substantial content hidden; print and
  shareability preserved.
- Reduce perceived fatigue on the heaviest sections (long experience tail, long
  lists) without removing any information.

## User Stories

**Primary persona — Recruiter / hiring manager (deep evaluator)**

- As a recruiter who opened the full CV, I want the strongest quantified outcomes
  and competencies in the first screen so that I can confirm fit before committing
  to the whole page.
- As a hiring manager, I want to jump straight to Experience or Education from an
  in-page nav so that I can check the one thing I came for without scrolling past
  everything else.
- As a time-pressed reader, I want a one-line lead-in under each heading so that I
  can skim the page's shape in seconds and dive in only where it matters.

**Secondary persona — Board contact / prospective client**

- As a board contact, I want recent leadership roles fully visible while older and
  routine detail stays tucked but reachable so that I get signal first and depth
  on demand.

**Owner persona — Site owner**

- As the owner, I want the restructure to preserve every existing piece of content
  and the print-friendly output so that going deep on readability costs me no
  completeness.
- As the owner, I want the section order and lead-ins to come from the existing
  single content source so that I maintain content in one place.

## Core Features

Grouped by priority. Wave 1 is the MVP.

**1. Reordered sections that front-load proof (Wave 1, foundational)**
Resequence the page to the following order, keeping all current sections:

1. Hero (identity)
2. Summary
3. Credentials — curated executive signals (qualitative proof)
4. Impact — quantified figures (quantitative proof)
5. Expertise — core competencies
6. Timeline — experience
7. Case Studies — featured work
8. Approach — leadership narrative + writing
9. Education
10. Certifications
11. Publications
12. Voluntary Leadership
13. Personal Details
14. Interests
15. Links

The high-leverage moves are pulling **Impact** and **Expertise** above the dense
Timeline so quantified proof and competencies land in the top third, and dropping
**Approach** (narrative/voice) to below the case studies so evidence precedes
voice. Credentials stays near the top as the qualitative proof line. Whether
Credentials and Impact visually share a single "proof band" is a presentation
choice left to the TechSpec, because the Impact surface is owned by
`cv-work-impact`.

**2. Per-section lead-ins (Wave 1)**
Each section heading gains a single scannable lead-in line that says what the
section contains, so readers can triage the page without reading every block.

**3. Sticky in-page navigation (Wave 1)**
A persistent in-page table of contents / anchor nav lets a reader jump to any
section and highlights the current section as they scroll. To stay scannable it
lists ~6 curated top-level groups (e.g. Summary, Proof, Experience, Work,
Background, Beyond) rather than all 15 sections. On small screens it presents as a
collapsed dropdown the reader can open, not the full rail and not hidden. It must
coordinate with the existing sticky header rather than compete with it.

**4. Long-tail progressive disclosure (Wave 1)**
Apply expand-in-place disclosure to the long tail only, by two derived rules that
need no new authoring: the experience timeline keeps the N most-recent roles
expanded and collapses older ones; long lists (certifications, publications)
collapse once they exceed a length threshold. Both rules derive from the existing
content order — no per-item flag. Recent roles, the summary, the proof sections,
and competencies are never collapsed. Disclosed content stays in the rendered,
printable, indexable document.

**5. Coordinated visual rhythm (Wave 1)**
Reordering and lead-ins must preserve consistent spacing, heading scale, and the
established visual system; the page should read as one coherent document, not a
reshuffled stack.

**6. In-page nav density refinements (Wave 2, optional)**
Optional enhancements once the core nav ships: grouping nav entries, a
back-to-top affordance, or collapsing the nav on small screens — added only if
the Wave 1 nav proves the pattern.

## User Experience

**Reader journey**

1. Opens `/cv` from the home page wanting the full picture.
2. The first screen presents identity, a tight summary, the strongest quantified
   outcomes, and core competencies — enough to confirm fit immediately.
3. A sticky in-page nav shows the page's sections; the reader either scrolls or
   jumps directly to the section they care about, always seeing where they are.
4. Each section opens with a one-line lead-in; the reader reads in full or skims
   onward.
5. In the experience tail and long lists, recent/important items are fully shown;
   older or routine detail sits behind an expand-in-place control the reader can
   open without leaving the page.
6. The reader reaches the lower credibility sections and links having absorbed the
   high-value material first.

**Owner journey**

1. Maintains content in the existing single source.
2. Section order, lead-ins, and which items are collapsed-by-default derive from
   that source and the page composition — no parallel structure to maintain.
3. Printing or sharing `/cv` yields the complete document, including disclosed
   content.

**UI/UX considerations**

- The sticky in-page nav and the existing sticky header must not collide
  (stacking, scroll offset, anchor targets); they should feel like one chrome. On
  small screens the nav collapses to an openable dropdown rather than the full
  rail.
- Disclosure controls must be real buttons, keyboard-operable, with clear
  expand/collapse state; collapsed content must still print and be indexable.
- Lead-ins must be visually subordinate to headings and consistent across
  sections.
- Maintain the existing print-friendly `/cv`: print shows everything expanded.
- Preserve near-instant load and the established visual system; no heavy
  client-side machinery for nav or disclosure.

## High-Level Technical Constraints

- The site is static with near-zero JavaScript; section ordering, lead-ins, nav
  generation, and default-collapsed state must resolve at build time.
- Reuse the existing single content source; do not introduce a runtime data layer
  for structure or navigation.
- Preserve the print-friendly `/cv` (all content expanded in print) and current
  reader-facing performance.
- Coordinate with the existing sticky header (`cv-sticky-header`) so the two
  fixed/sticky elements compose cleanly.
- Keep all content in the rendered HTML (indexable) even when visually collapsed.

## Non-Goals (Out of Scope)

- No changes to the impact/achievements/projects **data model** or the
  auto-aggregated `/impact` page — owned by `cv-work-impact`.
- No removal or rewriting of CV content; this is structure, order, and density,
  not copy editing.
- No new visual redesign beyond what reordering, lead-ins, nav, and disclosure
  require (the visual system is owned by `cv-visual-design`).
- No client-side search, filtering, or personalization of the page.
- No changes to the home page or other routes; scope is `/cv`.
- No accordion-style hiding of top-of-page value content (summary, highlights,
  competencies, recent roles).

## Phased Rollout Plan

### MVP (Phase 1 / Wave 1)

- Reordered sections that front-load proof (highlights + competencies above the
  timeline).
- A one-line lead-in under every section heading.
- Sticky in-page navigation with current-section highlighting, coordinated with
  the sticky header.
- Long-tail progressive disclosure (expand-in-place) on earlier/routine roles and
  long lists; everything else always visible.
- Preserved print-friendly output and visual rhythm.
- **Success criteria to proceed**: the first screen shows identity, summary,
  quantified highlights, and competencies; the in-page nav jumps to and highlights
  every section; no content is lost versus today; print shows everything expanded;
  the page reads as one coherent document.

### Phase 2 (optional)

- In-page nav refinements (grouping, back-to-top, small-screen behavior) if the
  Wave 1 nav proves the pattern.
- **Success criteria to proceed**: Wave 1 nav is used and well-received; a
  concrete refinement need is observed.

## Success Metrics

- **Proof in the first screen**: identity, summary, quantified highlights, and
  core competencies are all visible above the experience timeline.
- **Navigability**: a reader can reach any section in one action via the in-page
  nav, with the current section always indicated.
- **Skimmability**: every section carries a one-line lead-in.
- **Completeness preserved**: 100% of today's content remains present and reachable
  on the page; print output is complete with all disclosure expanded.
- **Reduced fatigue (qualitative)**: readers describe the page as long but easy to
  navigate rather than exhausting.

## Risks and Mitigations

- **Restructure drifts into hiding content** — disclosure creeps onto core
  sections. *Mitigation*: collapse is restricted to the long tail; summary,
  highlights, competencies, and recent roles are always visible; print shows all.
- **Scope bleed into the impact data model** — overlap with `cv-work-impact`.
  *Mitigation*: this effort changes order/density/navigation only; bullet and
  impact content stays as authored elsewhere.
- **Two sticky elements conflict** — in-page nav fights the sticky header.
  *Mitigation*: treat them as one coordinated chrome; resolve stacking and offset
  during design before building.
- **Reorder disrupts visual rhythm** — spacing/heading regressions after
  resequencing. *Mitigation*: reordering is paired with a visual-rhythm pass;
  reuse the established visual system.
- **Lead-ins add noise** — extra lines clutter rather than clarify. *Mitigation*:
  keep lead-ins short, subordinate to headings, and consistent; cut any that
  restate the heading.

## Architecture Decision Records

- [ADR-001: Restructure /cv by front-loading proof, adding in-page navigation, and disclosing only the long tail](adrs/adr-001.md) — Reorder to put proof in the top third, add per-section lead-ins and a sticky in-page nav, and collapse only the long tail in place so the page stays a complete overview.

## Open Questions

Resolved during brainstorming (now fixed in this PRD): the final section order,
the long-tail disclosure rules (recency for the timeline, length threshold for
lists), nav granularity (~6 curated groups), small-screen nav (collapsed
dropdown), and independence from `cv-work-impact` (ship independently, reuse the
existing Impact/highlights component if present).

Remaining for the TechSpec:

- The exact thresholds: how many most-recent roles stay expanded, and at what list
  length certifications/publications collapse.
- Whether Credentials and Impact visually share one "proof band" or remain two
  stacked sections (presentation detail that touches the `cv-work-impact`-owned
  Impact component).
- The precise six nav group labels and which sections map under each.
