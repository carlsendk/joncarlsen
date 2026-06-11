# TechSpec: Sticky Header

## Executive Summary

Add one shared `Header.astro` component, rendered once in `Base.astro` so all
five routes inherit it, replacing the standalone `<ThemeToggle />` and the
per-page inline back-link `<nav>` blocks. The header is `position: sticky; top:
0`, pure CSS, and derives its contextual back-link from `Astro.url.pathname` at
build time — no new layout props, no scroll JS. It carries identity (name + title
from `cvData`, as a home link — not an `<h1>`), LinkedIn + GitHub inline-SVG icon
links (filtered from `cvData.links`), and the existing `ThemeToggle` composed in
with its fixed positioning removed.

The primary trade-off: a small **inline** theme flash-guard script stays in
`<head>` against the literal "no inline" request. This is deliberate —
inline-in-head is the documented best practice for flash prevention (the
alternatives either flash, violating the approved no-flash criterion, or add a
render-blocking request that costs the enforced Lighthouse perf budget), and a
grep confirmed the site has no CSP to forbid it (ADR-004). The toggle's
*interactive* handler does move to a bundled `<script>`, the genuine
best-practice improvement.

## System Architecture

### Component Overview

- **`Header.astro`** (new, `src/components/`) — the sticky bar. Responsibilities:
  render the back-link (derived), identity home-link, icon links, and the
  composed `ThemeToggle`. Reads `cvData` (identity, links) and
  `Astro.url.pathname` (back-link). No props.
- **`Base.astro`** (modified) — renders `<Header />` as the first child of
  `<body>` in place of `<ThemeToggle />`; retains the inline flash guard in
  `<head>`. Adds `scroll-padding-top` (via `global.css`) so anchors clear the
  sticky bar.
- **`ThemeToggle.astro`** (modified) — positioning utilities (`fixed top-3
  right-3 z-50`) removed so it sits in the header flex row; its click handler
  converts from `is:inline` to a bundled `<script>`. Markup/SVGs and
  `aria-pressed` behavior unchanged.
- **Five pages** (modified) — `cv.astro`, `impact.astro`, `work/index.astro`,
  `work/[slug].astro` delete their inline back-link `<nav>`; `index.astro` is
  unaffected (it had none). No page passes new props.
- **`global.css`** (modified) — add `#site-header` to the print `display:none`
  chrome list; add `html { scroll-padding-top: … }`.

**Data flow:** build-time only. `cvData` (static TS) → `Header` props-free read;
`Astro.url.pathname` → `backLinkFor()` → rendered `<a>` or nothing. No runtime
data, no external systems.

## Implementation Design

### Core Interfaces

The header's only logic is back-link derivation — a pure function of the path.
(This is a TypeScript/Astro project; the skill's Go-struct requirement is
inapplicable, as in the prior TechSpecs — the primary type other code depends on
is shown below.)

```ts
// Inside src/components/Header.astro frontmatter
interface BackLink {
  href: string;
  label: string;
}

// '/' → null (no back-link); '/cv' → Overview; all else → Back to CV
function backLinkFor(pathname: string): BackLink | null {
  if (pathname === "/") return null;
  if (pathname === "/cv") return { href: "/", label: "Overview" };
  return { href: "/cv", label: "Back to CV" };
}

const back = backLinkFor(Astro.url.pathname);
const headerLinks = cvData.links.filter(
  (l) => l.label === "LinkedIn" || l.label === "GitHub",
);
```

### Data Models

No new entities. Reuses existing `cvData` fields:

- `cvData.name: string`, `cvData.title: string` — identity.
- `cvData.links: ProfileLink[]` where `ProfileLink = { label: string; url:
  string }` — filtered to `LinkedIn` / `GitHub`.

### API Endpoints

None. Static site; no runtime endpoints. The affected routes (`/`, `/cv`,
`/impact`, `/work`, `/work/[slug]`) are unchanged in path — only their rendered
chrome changes.

## Integration Points

None external. The only integration is internal: `Header` composes the existing
`ThemeToggle` and reads `cvData`. The trailing `[slug]` dynamic route is covered
by the catch-all branch of `backLinkFor` (any non-`/`, non-`/cv` path → `Back to
CV`).

## Impact Analysis

| Component | Impact Type | Description and Risk | Required Action |
|-----------|-------------|----------------------|-----------------|
| `src/components/Header.astro` | new | Sticky bar; identity + back-link + icons + toggle. Low risk, additive. | Create component; sticky CSS; `backLinkFor`; icon SVGs. |
| `src/layouts/Base.astro` | modified | Swap `<ThemeToggle />` → `<Header />`; keep inline flash guard. Med risk: header placement affects every page. | Render `<Header />` first in `<body>`. |
| `src/components/ThemeToggle.astro` | modified | Drop fixed positioning; handler `is:inline` → bundled `<script>`. Med risk: must preserve no-flash + `aria-pressed`. | Edit classes + script. |
| `src/pages/cv.astro` | modified | Remove inline `← Overview` nav (now in header). Low risk. | Delete `<nav>` block. |
| `src/pages/impact.astro` | modified | Remove inline `← Back to CV` nav. Low risk. | Delete `<nav>` block. |
| `src/pages/work/index.astro` | modified | Remove inline `← Back to CV` nav. Low risk. | Delete `<nav>` block. |
| `src/pages/work/[slug].astro` | modified | Remove inline `← Back to CV` nav. Low risk. | Delete `<nav>` block. |
| `src/pages/index.astro` | unaffected | No inline nav; gains header via Base. None. | None. |
| `src/styles/global.css` | modified | Print-hide `#site-header`; add `scroll-padding-top`. Low risk: `<header>` is shared with Hero, so hide by id not element. | Add print rule + scroll-padding. |

## Testing Approach

The project has no unit-test runner; verification matches the established pattern
(`astro check`, `astro build`, `linkinator`, plus the Netlify Lighthouse budget).
Tests are render/HTML assertions and build checks.

### Unit Tests (render assertions over built HTML)

- Every route's HTML contains exactly one `#site-header`, and exactly one `<h1>`
  (Hero's — header identity is not an `<h1>`).
- `/cv` header renders `← Overview` → `href="/"`; `/impact`, `/work`,
  `/work/<slug>` render `← Back to CV` → `href="/cv"`; `/` renders **no**
  back-link.
- Header on every route contains LinkedIn (`linkedin.com/in/joncarlsen`) and
  GitHub (`github.com/carlsendk`) links and **not** the Knowledge Base URL.
- Each removed page no longer contains its old inline back-link `<nav>` (no
  duplicate back-link).
- Theme toggle button (`#theme-toggle`) is present once, inside `#site-header`,
  with `aria-label` and `aria-pressed`.

### Integration Tests

- `npm run check` (astro check) → 0 errors/0 warnings.
- `npm run build` → exits 0; emits all five routes.
- `linkinator ./dist --recurse` (with the existing skip list) → all header links
  200, including each contextual back-link target.
- Manual/CI Lighthouse: perf ≥ 0.90, a11y ≥ 0.95 in **both** themes; verify no
  theme flash on load (guard intact) and that keyboard focus is never hidden
  behind the sticky bar (`scroll-padding-top` honored).
- Print check: `#site-header` hidden in print preview; Hero `<header>` still
  visible; existing print URL behavior intact.

## Development Sequencing

### Build Order

1. **`backLinkFor` + `Header.astro` skeleton** — no dependencies. Create the
   component with the derivation function, identity home-link, and placeholder for
   links/toggle; sticky CSS (`sticky top-0 z-…`, translucent `bg-bg/80
   backdrop-blur` + bottom border), `id="site-header"`.
2. **Icon links** — depends on step 1. Add inline LinkedIn/GitHub SVGs (following
   the `ThemeToggle` inline-SVG pattern) wired to filtered `cvData.links` with
   accessible names.
3. **Refactor `ThemeToggle`** — depends on step 1. Remove fixed positioning;
   convert handler `is:inline` → bundled `<script>`; compose `<ThemeToggle />`
   into `Header`.
4. **Wire into `Base.astro`** — depends on steps 1–3. Replace `<ThemeToggle />`
   with `<Header />` as the first `<body>` child; keep the inline flash guard.
5. **`global.css`** — depends on step 4 (need final header height). Add
   `#site-header` to the print `display:none` list and `html { scroll-padding-top:
   … }`.
6. **Remove per-page inline navs** — depends on step 4 (header must supply the
   back-link before pages drop theirs). Delete the `<nav>` blocks in `cv`,
   `impact`, `work/index`, `work/[slug]`.
7. **Verify** — depends on all above. `check` + `build` + `linkinator` +
   Lighthouse + print/flash/focus checks.

### Technical Dependencies

None external. All work is within existing files plus one new component; no new
packages, routes, or infrastructure.

## Monitoring and Observability

Not applicable (static site). Operational signal is the Netlify build gate:
`astro check` + build + `linkinator` + Lighthouse budgets fail the deploy if the
header breaks types, links, or the perf/a11y thresholds.

## Technical Considerations

### Key Decisions

- **Decision:** Derive the back-link from `Astro.url.pathname` in `Header`.
  **Rationale:** deterministic at build time; no per-page props. **Trade-off:**
  route hierarchy encoded in one function. **Rejected:** explicit `back` prop
  (ceremony/drift), hybrid override (YAGNI). (ADR-003)
- **Decision:** Keep the inline flash guard; bundle the click handler.
  **Rationale:** best practice + no CSP + protects Lighthouse perf. **Trade-off:**
  one inline script remains. **Rejected:** external blocking script (perf
  anti-pattern), all-bundled (flash), pure-CSS (weakens manual override).
  (ADR-004)
- **Decision:** Identity is a home link, not an `<h1>`. **Rationale:** Hero owns
  the single page `<h1>`; avoids two `<h1>`s. **Trade-off:** on `/cv`, both the
  name (→`/`) and the back-link (`← Overview` →`/`) point home — minor,
  conventional masthead redundancy.

### Known Risks

- **Sticky bar obscuring focus/anchors** (medium). Mitigation: `scroll-padding-top`
  on `html`; keep the bar short; preserve the existing `:focus-visible` outline.
- **Header crowding on narrow viewports** (medium). Mitigation: compact layout;
  PRD Phase 2 covers responsive condensing only if needed.
- **Print/flash regression from moving the toggle** (low–medium). Mitigation:
  `#site-header` print-hidden by id (not element, since Hero shares `<header>`);
  inline guard untouched; both asserted in verification.

## Architecture Decision Records

- [ADR-001: A persistent identity sticky header on every page with a contextual back-link](adrs/adr-001.md) — Shared header on every route; contextual back-link; identity + icons + toggle.
- [ADR-002: Always-visible, pure-CSS sticky behavior](adrs/adr-002.md) — `position: sticky`, no scroll JS; rejects hide-on-scroll/appear-after-fold.
- [ADR-003: A single shared Header component with a pathname-derived contextual back-link](adrs/adr-003.md) — One `Header.astro` in `Base.astro`; back-link from `Astro.url.pathname`; no per-page props.
- [ADR-004: Retain the inline theme flash guard; bundle the click handler](adrs/adr-004.md) — Inline-in-head guard kept (best practice, no CSP, perf budget); handler bundled; toggle composed into header.
