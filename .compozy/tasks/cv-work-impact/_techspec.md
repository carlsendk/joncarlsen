# TechSpec: Work & Impact

> Core interfaces below are TypeScript, not Go: this is an Astro + TypeScript
> static site with no backend, so TypeScript types are the real contracts other
> components depend on.

## Executive Summary

This feature connects impact to projects on a static Astro site (near-zero JS,
all work at build time). The canonical source of impact and skills is the **work
case study**, not the CV bullet (ADR-003): `work.metrics[]` and `work.skills[]`
(both already in the schema) own the numbers, while a role's bullets become
descriptions of work done that optionally link to a work entry
(`Bullet { text, work? }`). The curated `cvData.impact` list is removed and its
figures migrate onto the matching work entries' metrics. A shared build-time
module derives every consuming surface from the collection (ADR-004): `/impact`
(new) shows all work metrics grouped by company; the home page and a `/cv` metric
band show the first metric per company. The `/projects` index is hard-renamed to
`/work` with no redirect (ADR-005).

The primary trade-off: sourcing impact from the work collection means impact and
the role's descriptive bullets are distinct things, which removes any
duplication on `/cv` (numbers from work, descriptions from roles) and gives one
source per concern — at the cost of a one-time, breaking change to `Role.bullets`
(`string[]` → `Bullet[]`) that touches `Timeline.astro` and all eight roles'
data, plus the editorial rule that an impact figure without a case study needs a
work entry to host it.

## System Architecture

### Component Overview

**Data layer — `src/data/cv.ts`** (modified)
- New `Bullet` interface (`{ text, work? }`); `Role.bullets` becomes `Bullet[]`.
- `impact: Highlight[]` and the `Highlight` interface are removed; the figures
  migrate onto work entries' `metrics[]`.

**Impact derivation — `src/lib/impact.ts`** (new)
- Build-time module querying the `work` collection.
- `ImpactItem` type plus `impactItems()` (all metrics) and `leadImpactItems()`
  (first metric per company).

**Content schema — `src/content.config.ts`** (unchanged)
- `work.metrics[]` and `work.skills[]` already exist; no change.

**Presentation layer — components** (modified)
- `Impact.astro`: prop changes from `Highlight[]` to `ImpactItem[]`; renders the
  metric + company, linking to `/work/<slug>`.
- `Timeline.astro` (`variant="full"`): renders `bullet.text`, wrapping it in a
  link to `/work/<bullet.work>` when present.

**Page layer — routes**
- `src/pages/index.astro` (modified): feeds `leadImpactItems()` to `Impact.astro`.
- `src/pages/cv.astro` (modified): feeds `leadImpactItems()` to `Impact.astro`;
  the full timeline now renders linked descriptive bullets.
- `src/pages/impact.astro` (new): groups `impactItems()` by company.
- `src/pages/work/index.astro` (moved from `projects.astro`): unchanged grouping.
- `src/pages/work/[slug].astro` (unchanged).

**Config — `netlify.toml`** (unchanged; no redirect per ADR-005).

### Data flow

```
work collection ──metrics[]──►  impactItems()      ──►  /impact (grouped by company)
      │                         leadImpactItems()   ──►  home + /cv metric band (1 per company)
      ├──metrics[]/skills[]──►  CaseStudyCard / [slug] header        (unchanged)
      └──slug──◄─ Bullet.work ── cvData.roles[].bullets ──►  /cv timeline (linked descriptions)
```

Impact (numbers) and bullets (descriptions) come from different sources, so they
never repeat on the same page.

## Implementation Design

### Core Interfaces

The two canonical types other components depend on:

```ts
// src/data/cv.ts — a role bullet is a description with an optional work link
export interface Bullet {
  text: string;    // description of work done, rendered on /cv
  work?: string;   // work-collection slug when a case study backs the bullet
}

export interface Role {
  company: string;
  position: string;
  start: string;
  end: string;
  scope: string;     // job description
  bullets: Bullet[]; // was string[]
  themes?: string[];
  skills?: string[];
}
```

```ts
// src/lib/impact.ts — derived view model for the impact surfaces
export interface ImpactItem {
  company: string;
  metric: string;  // one entry per string in work.metrics[]
  slug: string;    // links to /work/<slug>
  title: string;
  order: number;
}
```

Derivation helpers (build-time, async — they query the collection):

```ts
// src/lib/impact.ts
import { getCollection } from "astro:content";

export async function impactItems(): Promise<ImpactItem[]> {
  const work = (await getCollection("work", ({ data }) => !data.draft))
    .sort((a, b) => a.data.order - b.data.order);
  return work.flatMap((e) =>
    e.data.metrics.map((metric) => ({
      company: e.data.company, metric, slug: e.id, title: e.data.title, order: e.data.order,
    })),
  );
}

export async function leadImpactItems(): Promise<ImpactItem[]> {
  const seen = new Set<string>();
  return (await impactItems()).filter((i) =>
    seen.has(i.company) ? false : (seen.add(i.company), true),
  );
}
```

### Data Models

- **`Bullet`** (above) replaces the plain `string` bullet. Migration: every
  current bullet string becomes `{ text }`; notable bullets gain a `work` slug.
- **`ImpactItem`** (above) is the derived view model; `/impact` groups items into
  `{ company, items: ImpactItem[] }[]`, companies ordered by lowest `order`.
- **`work` collection schema** (`src/content.config.ts`): **unchanged**
  (`metrics[]`, `skills[]` already present).
- **Removed**: `Highlight` interface and `CvData.impact`.

### API Endpoints

Not applicable — static site, no runtime API. The "surface" is the rendered route
set:

| Route | Method | Description |
|-------|--------|-------------|
| `/` | static | Home; metric band from `leadImpactItems()` |
| `/cv` | static | Full CV; metric band + linked descriptive bullets |
| `/impact` | static (new) | All work metrics grouped by company |
| `/work` | static (moved) | Work index grouped by company (was `/projects`) |
| `/work/<slug>` | static | Case study (unchanged) |

## Integration Points

None outside the codebase. The only external touch-point is the Netlify build
pipeline (`astro check` → `astro build` → `linkinator`), the safety net for
broken internal links introduced by the rename and the new bullet links.

## Impact Analysis

| Component | Impact Type | Description and Risk | Required Action |
|-----------|-------------|----------------------|-----------------|
| `src/data/cv.ts` | modified | `Bullet` added; `Role.bullets` → `Bullet[]`; `Highlight`/`impact` removed. Breaking type change. Medium risk. | Add `Bullet`; migrate all 8 roles' bullets; add `work` slugs; remove `Highlight`/`impact`. |
| `src/lib/impact.ts` | new | Shared derivation over the work collection. Low risk. | Create module with `ImpactItem`, `impactItems()`, `leadImpactItems()`. |
| `src/content/work/*.md` | modified (content) | Migrate former `cvData.impact` figures onto `metrics[]` where missing. Low risk. | Verify/add metric strings; mostly already present. |
| `src/components/Timeline.astro` | modified | Bullets are objects now; render `bullet.text` + optional link. Low risk. | Update full-variant bullet rendering. |
| `src/components/Impact.astro` | modified | Prop `Highlight[]` → `ImpactItem[]`; render metric + company + link. Low risk. | Rewrite props and template. |
| `src/pages/index.astro` | modified | Pass `leadImpactItems()` to `Impact`. Low risk. | Update import/usage (now async). |
| `src/pages/cv.astro` | modified | Pass `leadImpactItems()`; timeline now linked. Low risk. | Update import/usage. |
| `src/pages/impact.astro` | new | Grouped-by-company impact page + backnav. Low risk. | Create page. |
| `src/pages/projects.astro` → `src/pages/work/index.astro` | moved | Index relocates; `/projects` 404s by design (ADR-005). Medium risk if a link is missed. | Move file; verify links. |
| `src/components/CaseStudies.astro` | modified | Links `/projects`; relabel to `/work`; add `/impact` discoverability link. Low risk. | Update href + label. |
| `netlify.toml` | unchanged | No redirect (ADR-005). | None. |

## Testing Approach

This project has no unit-test harness; verification is the build pipeline plus
manual review. The "tests" are build-time and visual checks.

### Unit Tests

- No test runner exists; do not introduce one (YAGNI).
- Treat `astro check` (type checking) as the contract test: the `Bullet[]` change
  must type-check across `Timeline.astro`, `Impact.astro`, and the pages.

### Integration Tests

- **Build pipeline** (`npm run check && npm run build && linkinator`): must pass.
  `linkinator` confirms every `/work/<slug>` bullet link resolves and no stale
  `/projects` reference remains.
- **Lighthouse budgets** (Netlify plugin): performance ≥ 0.90, accessibility ≥
  0.95 must hold on `/`, `/cv`, and the new `/impact`.
- **Manual verification**:
  - Home metric band shows one number per company (~4), each linking to its work.
  - `/impact` lists every work metric, grouped by company, each linking correctly;
    companies with no metric do not appear.
  - `/cv` shows the metric band (numbers) and the full timeline (descriptions) with
    no repeated sentences; bullets link to work only where `work` is set.
  - Print view of `/cv` stays clean — the print rule appends URLs only for
    outbound `http` links (`global.css:219`); internal `/work` bullet links are
    skipped.
  - Every former `cvData.impact` figure appears on a work entry's `metrics[]`
    (migration before/after check).

## Development Sequencing

### Build Order

1. **Data model in `cv.ts`** — add `Bullet`; change `Role.bullets` to `Bullet[]`;
   migrate all 8 roles' bullets to objects; add `work` slugs to notable bullets;
   remove `Highlight` and `CvData.impact`. No dependencies.
2. **Migrate impact figures onto work** — ensure each former `cvData.impact`
   figure exists in the matching work entry's `metrics[]`. Depends on step 1 (so
   the source of truth is gone and work is authoritative).
3. **`src/lib/impact.ts`** — `ImpactItem`, `impactItems()`, `leadImpactItems()`.
   Depends on step 2 (reads the finalized work metrics).
4. **`Timeline.astro`** — render `bullet.text` and wrap in `/work/<bullet.work>`
   link when present. Depends on step 1 (new `Bullet` shape).
5. **`Impact.astro`** — change prop to `ImpactItem[]`; render metric + company +
   link. Depends on step 3 (`ImpactItem`).
6. **`index.astro` and `cv.astro`** — feed `leadImpactItems()` to `Impact`.
   Depends on steps 3 and 5; `cv.astro` also depends on step 4.
7. **`impact.astro` (new)** — group `impactItems()` by company; render sections;
   backnav to `/cv`. Depends on steps 3 and 5.
8. **Rename `projects.astro` → `work/index.astro`** and update the link/label in
   `CaseStudies.astro` to `/work`; add an Impact discoverability link
   (home/`cv` band → `/impact`). Depends on step 7 (so `/impact` exists to link
   to); independent of steps 4–6.
9. **Full build verification** — `npm run check && npm run build && linkinator`;
   manual checks from the Testing Approach. Depends on steps 1–8.

### Technical Dependencies

- No infrastructure, external services, or shared components required.
- Node 22 build toolchain already present (`netlify.toml`).

## Monitoring and Observability

Static site — no runtime telemetry. Operational visibility is limited to:
- **Netlify deploy logs**: `astro check` errors, `linkinator` broken-link report.
- **Lighthouse report artifact** (`reports/lighthouse.html`): performance and
  accessibility budgets per deploy.

## Technical Considerations

### Key Decisions

- **Decision**: The work collection is the canonical source of impact and skills
  (ADR-003).
  - **Rationale**: Owner placed impact on the work; bullets are descriptions. This
    removes `/cv` duplication and gives one source per concern.
  - **Trade-offs**: One-time breaking `Role.bullets` change; an impact figure
    without a case study needs a work entry.
  - **Alternatives rejected**: metric on the bullet; dual-source with dedup.

- **Decision**: Derive surfaces from the collection — `/impact` all metrics by
  company; home and `/cv` band first metric per company (ADR-004).
  - **Rationale**: Deterministic, no curation; fair across employers; `featured`
    is too sparse and first-N over-weights recent work.
  - **Trade-offs**: A company without a work metric contributes nothing.
  - **Alternatives rejected**: featured-only; first-N-overall; theme grouping.

- **Decision**: Hard rename `/projects` → `/work`, no redirect (ADR-005).
  - **Rationale**: Route is days old with no inbound links; `linkinator` guards
    internal references.
  - **Trade-offs**: Supersedes the PRD's backward-compatible-URL constraint.
  - **Alternatives rejected**: 301 redirect; serve both as aliases.

### Known Risks

- **Migration mis-mapping** (medium): a former `cvData.impact` figure is dropped.
  Mitigation: explicit before/after check of all figures against work `metrics[]`.
- **Stale `/projects` reference** (low): a missed internal link 404s. Mitigation:
  `linkinator` fails the deploy.
- **`astro:content` import scope** (low): `src/lib/impact.ts` imports
  `astro:content`; keep it consumed only by `.astro` files in the build graph.
- **Sparse impact for some companies** (low): Ørsted entries carry no metric.
  Mitigation: add metrics to those entries if desired; not code-enforced.

## Architecture Decision Records

- [ADR-001: "Work" + "Impact" naming with the bullet as the connective unit](adrs/adr-001.md) — Product: adopt Work/Impact; the role bullet links the role to its work (metric-location note superseded by ADR-003).
- [ADR-002: The Impact page is auto-aggregated from work, not separately curated](adrs/adr-002.md) — Product: derive `/impact` from work; retire the curated impact list.
- [ADR-003: The work collection is the canonical source of impact and skills](adrs/adr-003.md) — Impact/skills live on the work entry; bullets are descriptions `{ text, work? }`; remove `cvData.impact`.
- [ADR-004: Impact derivation from the work collection](adrs/adr-004.md) — `impactItems()`/`leadImpactItems()` in `src/lib/impact.ts`; `/impact` all-by-company, band first-per-company.
- [ADR-005: Hard rename `/projects` → `/work` with no redirect](adrs/adr-005.md) — Move the index to `/work`; no redirect; `linkinator` guards links.
