# TechSpec: CV Structure — order, density, and navigation of /cv

## Executive Summary

This spec restructures the existing `/cv` page along the four pillars approved in
the PRD (front-load proof, per-section lead-ins, in-page navigation, long-tail
disclosure) **without changing any CV content or the `cv-work-impact` data model**.
The work is overwhelmingly composition and presentation: every section is already
a self-contained component reading `cvData` via props from `src/pages/cv.astro`,
so the reorder is a re-sequencing of that file, and the two new behaviors (nav and
disclosure) are added as pure progressive enhancement over a page that already
renders complete and correct with zero JavaScript.

Three technical decisions shape the design. The in-page nav is a **right-margin
sticky rail** (ADR-002) that lives outside the `max-w-2xl` reading column, so it
costs no vertical space and — unlike a stacked sub-bar — requires no change to the
existing `scroll-padding-top: 4.5rem`. Long-tail content collapses via an
**always-rendered DOM + class toggle defaulting to expanded** (ADR-003), so no-JS,
print, and search engines always get the full CV, with print forcing it open by
the same idiom that already cancels `.reveal`. Lead-ins are authored once in a
**central `sectionLeadIns` map** in `cv.ts` and passed as props (ADR-004), the
same pass that adds anchor `id`s to each section.

The primary trade-off: the feature roughly triples the site's client-side JS (from
one toggle to three small bundled scripts — scroll-spy and content-collapse added).
This is accepted because both additions are enhancement-only and cannot regress the
no-JS/print/SEO baseline; the build must confirm the Lighthouse budgets
(performance ≥ 0.90, accessibility ≥ 0.95) still hold.

## System Architecture

### Component Overview

**New components**

- `src/components/CvNav.astro` — the in-page navigation. Renders a
  `<nav aria-label="On this page">` of ~6 group links built from a `navGroups`
  constant. Desktop: a sticky vertical rail in the right margin (visible at `lg+`).
  Small screens: a native `<details>` "Jump to…" dropdown. Ships a bundled
  `IntersectionObserver` script that sets `aria-current` on the active group link.
  Rendered once by `cv.astro` (or `Base` scoped to `/cv`; see Integration Points).

**New shared module**

- `src/scripts/collapse` (a single bundled `<script>`, colocated in the component
  that owns the collapsible region, or a tiny shared module) — on load, collapses
  any region marked as long-tail and wires its `<button aria-expanded>` toggle.

**Modified data/content**

- `src/data/cv.ts` — add `sectionLeadIns: Record<SectionSlug, string>` and the
  `navGroups` definition (or a sibling `src/data/cvNav.ts` if `cv.ts` ownership is
  a concern). No change to existing `cvData` fields.

**Modified page**

- `src/pages/cv.astro` — re-sequence the section render order; render `<CvNav />`;
  pass `leadIn` props to each section.

**Modified section components (~14)**

- `Summary`, `Credentials`, `Impact`, `Expertise`, `Timeline`, `CaseStudies`,
  `Approach`, `Education`, `Certifications`, `Publications`, `VoluntaryLeadership`,
  `PersonalDetails`, `Interests`, `Links` — each gains: (a) an `id` on its
  `<section>` wrapper (the section slug, for nav anchors), and (b) an optional
  `leadIn` prop rendered as a `.cv-lead` line under the `<h2>`.

**Modified Timeline behavior**

- `src/components/Timeline.astro` — for `variant="full"`, still render **all**
  roles, but wrap the roles after the most-recent N in a collapsible region with a
  single bulk expander. No slicing.

**Modified styles**

- `src/styles/global.css` — add `.cv-lead`; add the right-rail/dropdown rules;
  add the collapse class and its `@media print` neutralization; confirm
  `scroll-padding-top` still clears the chrome.

**Data flow**: `cvData` + `sectionLeadIns` + `navGroups` → `cv.astro` (build time)
→ section components render complete HTML with anchor `id`s and lead-ins; `CvNav`
renders links to those `id`s. At runtime, two enhancement scripts run: scroll-spy
(reads section positions, writes `aria-current`) and collapse (adds class +
toggle). External systems: none.

## Implementation Design

### Core Interfaces

The page composition depends on two new build-time structures and one collapse
config. Defined in TypeScript, consistent with the existing `src/data/cv.ts`.

```ts
// Section slugs double as anchor ids and lead-in keys. Aligned with the
// existing "<slug>-heading" h2 ids already in each component.
type SectionSlug =
  | "summary" | "credentials" | "impact" | "expertise" | "experience"
  | "work" | "approach" | "education" | "certifications"
  | "publications" | "voluntary" | "personal" | "interests" | "links";

// One scannable lead-in per section; omit a slug to render no lead-in (ADR-004).
type SectionLeadIns = Partial<Record<SectionSlug, string>>;

// A curated nav group → the section it scrolls to and the sections it spans
// (span drives scroll-spy: any spanned section in view highlights the group).
interface NavGroup {
  label: string;        // e.g. "Proof"
  anchor: SectionSlug;  // link target, e.g. "impact"
  spans: SectionSlug[]; // e.g. ["impact", "expertise"]
}

// Long-tail collapse tuning (ADR-003). Timeline keeps the most recent
// `recentRoles`; lists collapse only when longer than `listThreshold`.
interface CollapseConfig { recentRoles: number; listThreshold: number; }
```

Proposed values (tunable at review): `navGroups` = Summary→`summary`
[summary, credentials], Proof→`impact` [impact, expertise], Experience→`experience`
[experience], Work→`work` [work, approach], Background→`education`
[education, certifications, publications], Beyond→`voluntary`
[voluntary, personal, interests, links]. `CollapseConfig` = `{ recentRoles: 4,
listThreshold: 8 }` — at current content (11 roles, 7 certs, 4 publications) the
timeline collapses 7 roles behind one expander; lists are below threshold and stay
fully expanded, with the same wrapper ready if a list grows.

### Data Models

No domain/storage model changes. The only new persisted content is the
`sectionLeadIns` map and `navGroups` in `src/data/cv.ts`. `cvData` (roles,
education, certifications, publications, etc.) is unchanged; `cv-work-impact` keeps
sole ownership of the impact/bullet model.

### API Endpoints

None. The site is statically built (Astro); there is no runtime API. All ordering,
lead-in resolution, nav generation, and default-expanded markup resolve at build
time.

## Integration Points

No external services. The one internal integration boundary is the **sticky
header** from `cv-sticky-header` (`#site-header`, `sticky top-0 z-40`, ≈4rem; `html
{ scroll-padding-top: 4.5rem }`):

- The right-margin rail is `position: sticky` but does **not** stack below the
  header, so `scroll-padding-top` is unchanged. The spec still requires verifying
  anchor landings clear the header in both themes after wiring.
- `CvNav` should render only on `/cv`. Render it directly from `cv.astro` (not
  global `Base`) to keep it route-scoped without conditional logic in the layout.
- The mobile dropdown is a `<nav>`, already hidden by the existing
  `@media print { nav { display:none } }` rule.

## Impact Analysis

| Component | Impact Type | Description and Risk | Required Action |
|-----------|-------------|---------------------|-----------------|
| `src/pages/cv.astro` | modified | Re-sequence sections to the PRD order; render `<CvNav/>`; pass `leadIn` props. Low risk (composition only). | Reorder render block; add nav + props |
| `src/components/CvNav.astro` | new | Right-margin rail + mobile dropdown + scroll-spy script. Medium risk (new interactive component, a11y). | Build component + IO script |
| `src/data/cv.ts` | modified | Add `sectionLeadIns` + `navGroups`. Low risk (additive). | Add map + groups (+ types) |
| `src/components/Timeline.astro` | modified | Collapse roles after N behind one bulk expander on `variant="full"`; render all roles. Medium risk (must not slice; print/reveal interplay). | Add collapsible tail + button |
| `Summary`, `Credentials`, `Impact`, `Expertise`, `CaseStudies`, `Approach`, `Education`, `Certifications`, `Publications`, `VoluntaryLeadership`, `PersonalDetails`, `Interests`, `Links` | modified | Add section `id` + optional `leadIn` line. Low risk each, uniform edit. | Add `id` + `.cv-lead` render |
| `src/styles/global.css` | modified | Add `.cv-lead`, rail/dropdown rules, collapse class + print neutralization; re-verify `scroll-padding-top`. Medium risk (print + sticky interplay). | Add rules; extend `@media print` |
| collapse script | new | PE script: collapse tail + wire toggle on load. Medium risk (CLS, `.reveal` opacity on expand). | Build bundled IIFE |
| `netlify.toml` (Lighthouse gate) | unchanged | Two new scripts must not drop perf < 0.90 or a11y < 0.95. | Verify in build report |

## Testing Approach

No unit-test runner gates the build; `npm run test` (`node --test tests/**`) exists
and is run manually, and the hard gate is `lint → check → build → linkinator →
Lighthouse`. Tests below use that existing harness plus rendered-HTML assertions.

### Unit Tests

- **Lead-in coverage**: every `SectionSlug` rendered on `/cv` either has a
  `sectionLeadIns` entry or is intentionally absent; no orphan keys exist in the
  map. (assert against the slug set)
- **Nav anchors resolve**: every `navGroups[].anchor` and every entry in `spans`
  corresponds to a section `id` present in the built `/cv` HTML. (no dead anchors)
- **Section order**: the built `/cv` HTML emits section `id`s in the exact PRD
  order (summary, credentials, impact, expertise, experience, work, approach,
  education, certifications, publications, voluntary, personal, interests, links).
- **Completeness**: the number of role entries in the built HTML equals the count
  in `cvData.roles` (collapse must not drop roles — guards against slicing).
- **Collapse default-expanded**: the server-rendered HTML contains the earlier
  roles' markup (not behind a closed `<details>`); the collapse class is present
  for the script to act on, but content is in the DOM.

### Integration Tests

- **Anchor landing clears chrome**: navigating to each section `#id` scrolls so the
  section heading is below the sticky header (verify `scroll-padding-top` covers
  header [+ rail if it ever stacks]) in both light and dark themes.
- **Scroll-spy**: as the viewport moves through each group's spanned sections, the
  corresponding rail link gains `aria-current="true"` and others lose it.
- **Collapse toggle**: clicking "Show earlier roles (N)" expands the tail, sets
  `aria-expanded="true"`, and expanded roles render at full opacity (not stuck at
  `.reveal` `opacity:0`); collapsing restores the button label/state.
- **No-JS / print**: with JS disabled and in print preview, all roles and lists are
  fully visible; the rail/dropdown `<nav>` is hidden in print; external link URLs
  still print (existing rule).
- **Lighthouse gate**: `npm run build` + the Netlify Lighthouse plugin reports
  performance ≥ 0.90 and accessibility ≥ 0.95; CLS is not regressed by the
  below-fold collapse.

## Development Sequencing

### Build Order

1. **Add `sectionLeadIns` + `navGroups` + types and the `.cv-lead` style** to
   `src/data/cv.ts` and `src/styles/global.css`. No dependencies. Leaves the page
   unchanged (data only).
2. **Add section `id` + optional `leadIn` rendering to the ~14 section components.**
   Depends on step 1 (consumes the map and `.cv-lead`). After this, sections are
   anchor-addressable and show lead-ins; page still in old order.
3. **Re-sequence the render block in `cv.astro` and pass `leadIn` props** to the
   new PRD order. Depends on step 2 (components accept `leadIn`; `id`s exist).
4. **Build `CvNav.astro` (rail + mobile `<details>` dropdown) and render it from
   `cv.astro`.** Depends on step 3 (anchor `id`s present in final order). Anchors
   work without JS at this point.
5. **Add the scroll-spy `IntersectionObserver` script** to `CvNav`. Depends on
   step 4 (links + spans exist). Pure enhancement.
6. **Add the long-tail collapse**: timeline collapsible tail + the bundled collapse
   script + the `@media print` neutralization. Depends on step 2 (Timeline markup)
   and the print block; independent of the nav, can proceed after step 3.
7. **Verify**: run `lint → check → build → linkinator → Lighthouse`; manually
   confirm no-JS, print, both themes, anchor landings, scroll-spy, and collapse.
   Depends on steps 1–6.

### Technical Dependencies

- The `cv-sticky-header` feature is already shipped (`#site-header` wired in
  `Base.astro`, `scroll-padding-top` set). No blocking external dependency.
- Independent of `cv-work-impact` — ship without waiting on it; reuse the existing
  `Impact`/`Expertise` components as-is.

## Monitoring and Observability

Not applicable — a static marketing/CV site with no runtime backend. The
operational signal is the build-time Lighthouse report (perf/a11y budgets in
`netlify.toml`) and `linkinator` link validation; both run in the Netlify build and
fail it on regression.

## Technical Considerations

### Key Decisions

- **Decision**: Right-margin sticky rail for the in-page nav.
  **Rationale**: Lives in the wide desktop margin, costs zero vertical space, and
  avoids re-stacking under the header (no `scroll-padding-top` change).
  **Trade-offs**: Rail only at `lg+`; mobile uses a dropdown.
  **Alternatives rejected**: stacked horizontal sub-bar (permanent vertical chrome
  + offset rework), dropdown-everywhere (weak desktop wayfinding). See ADR-002.

- **Decision**: Always-rendered DOM + class-toggle disclosure, default expanded;
  native `<details>` only for the mobile nav dropdown.
  **Rationale**: Guarantees print/SEO/no-JS completeness; print forces open via the
  existing `.reveal`-cancel idiom; `<details>` is unreliable to force-open in print.
  **Trade-offs**: One extra script; brief post-load collapse on the tail.
  **Alternatives rejected**: `<details>` for content, CSS checkbox hack. See ADR-003.

- **Decision**: Central `sectionLeadIns` map in `cv.ts`, passed as props; section
  `id`s added in the same pass.
  **Rationale**: Single source of truth (owner story), testable, anchors land with
  the lead-in edit. **Trade-offs**: ~14 small uniform component edits.
  **Alternatives rejected**: hardcoded per-component copy, richer cvData objects.
  See ADR-004.

- **Decision**: Collapse, never slice, on the timeline; render all roles.
  **Rationale**: Completeness is a hard success criterion; a slice would drop
  content. **Trade-offs**: Slightly more markup than a slice.

### Known Risks

- **Lighthouse perf regression from new JS / CLS** (medium likelihood, low impact).
  *Mitigation*: both scripts are small bundled IIFEs; collapse only below-the-fold
  content so layout shift is out of viewport; verify the report.
- **`.reveal` opacity sticks at 0 on expanded content** (medium). *Mitigation*:
  govern collapse via height/visibility, not the reveal opacity, or clear the
  reveal state on expand; integration test asserts full opacity after expand.
- **Anchor landings hidden behind chrome** (low). *Mitigation*: rail does not stack;
  re-verify `scroll-padding-top: 4.5rem` clears the header in both themes.
- **Lead-ins read as noise** (low). *Mitigation*: short, distinct, optional; omit
  where they would restate the heading.
- **Scroll-spy mis-highlight at boundaries** (low). *Mitigation*: observe all
  sections, map to group, pick topmost intersecting; links work without the script.

## Architecture Decision Records

- [ADR-001: Restructure /cv by front-loading proof, adding in-page navigation, and disclosing only the long tail](adrs/adr-001.md) — The overall product approach: reorder, lead-ins, sticky nav, long-tail-only disclosure (from PRD).
- [ADR-002: In-page navigation as a right-margin sticky rail with progressive-enhancement scroll-spy](adrs/adr-002.md) — Margin rail (dropdown on mobile) + `IntersectionObserver` highlight; avoids stacking under the header.
- [ADR-003: Long-tail disclosure via always-rendered DOM + class toggle, default expanded](adrs/adr-003.md) — Content always rendered; JS collapses on load; print/no-JS show all; `<details>` only for the nav, not content.
- [ADR-004: Per-section lead-ins sourced from a central `sectionLeadIns` map in cv.ts](adrs/adr-004.md) — Single-source lead-in map passed as props; section `id`s added in the same pass for nav anchors.
