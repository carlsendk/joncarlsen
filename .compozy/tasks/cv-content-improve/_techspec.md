# TechSpec: CV Content Depth & Targeted-CV Source

## Executive Summary

This spec extends the shipped `cv-content` architecture rather than replacing it.
Content stays split (cv-content ADR-003): a typed `src/data/cv.ts` spine and a
markdown `work` content collection. We extend the `work` schema so every project
(featured or not) is a tagged markdown entry that renders its own `/work/<slug>`
page, add a `/projects` index that lists all projects grouped by company, add
optional theme/skill tags to `cv.ts` roles and highlights, and add a new
`interests` field rendered as an Interests section on `/cv`. We also deepen the
existing copy (hero, summary, role bullets, the AXON case study) and add a
featured DFDS case study, all under the project's voice rules. Phase 2 targeted
variants are out of scope here; the tag fields are authored now so the model is
ready for them.

Primary trade-off: tags are free-form strings (ADR-004), so authoring stays
flexible and schema-free at the cost of build-time typo protection. The hybrid
store (ADR-003) keeps changes small and low-risk on a live site, at the cost of
two stores (typed + markdown) that must stay coherent — already true today.

## System Architecture

### Component Overview

- **`src/content.config.ts` (`work` schema)** — modified. Adds `company`
  (required), `featured` (bool, default false), `themes` (string[], default []),
  `skills` (string[], default []) to the existing fields. The single source of
  truth for project metadata. Invalid frontmatter fails the build.
- **`src/data/cv.ts`** — modified. `Role` and `Highlight` gain optional `themes`;
  `Role` gains optional `skills`. New `Interest` type and `interests: Interest[]`
  field. Existing content is tagged; deepened copy lands here for the hero,
  summary, and role bullets.
- **`src/content/work/*.md`** — content. `axon-ai-platform.md` deepened and given
  `company`/`featured`/tags. New featured case studies authored to the standard
  template (Context / What I did / Outcome + metrics strip). Each file is a
  project; `featured` controls surfacing only.
- **`src/pages/projects.astro`** — new route `/projects`. Queries the `work`
  collection, drops drafts, groups entries by `company`, renders each as a short
  entry linking to its `/work/<slug>` page.
- **`src/components/CaseStudies.astro`** — modified. Filters to `featured === true`
  for the frontpage and `/cv`, and appends a "See all projects" link to
  `/projects`.
- **`src/components/Interests.astro`** — new section component, rendered on `/cv`
  only, following the established section-wrapper/heading pattern.
- **`src/pages/work/[slug].astro`** — unchanged behaviour; now generates a page
  per non-draft entry (already its behaviour, just more entries).

Data flow: `cv.ts` feeds the spine sections (Hero, Summary, Timeline, Impact,
Expertise, Interests, etc.). The `work` collection feeds CaseStudies (featured
subset), the `/projects` index (all, grouped by company), and the `/work/<slug>`
deep pages. No runtime data flow; everything resolves at build time.

## Implementation Design

### Core Interfaces

This is a TypeScript/Astro project (no Go). The primary contracts are the Zod
schema for `work` and the TypeScript types in `cv.ts`.

Extended `work` collection schema (`src/content.config.ts`):

```ts
const work = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/work" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    role: z.string(),
    period: z.string(),
    company: z.string(),               // NEW: groups the /projects index
    featured: z.boolean().default(false), // NEW: surfaced on / and /cv
    themes: z.array(z.string()).default([]), // NEW: free-form (ADR-004)
    skills: z.array(z.string()).default([]), // NEW: free-form
    metrics: z.array(z.string()).default([]),
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});
```

New and extended types (`src/data/cv.ts`):

```ts
export interface Interest {
  label: string;            // e.g. "Golf (Trackman simulators)"
  themes?: string[];        // optional tags for selection
}

export interface Role {
  /* ...existing fields... */
  themes?: string[];        // NEW: optional tags
  skills?: string[];        // NEW: optional tags
}
// Highlight gains optional `themes?: string[]`; CvData gains `interests: Interest[]`.
```

### Data Models

- **Project** = one `work` entry. Identity = filename slug. Required: title,
  summary, role, period, company. Optional/defaulted: featured, themes, skills,
  metrics, order, draft. Body = markdown (Context / What I did / Outcome).
- **Interest** = `{ label, themes? }`. Held in `cv.ts` `interests[]`.
- **Role / Highlight** = existing entities plus optional `themes`/`skills`.
- No database, no storage layer. All content is files resolved at build.

### API Endpoints

None. Static site; no runtime API. Routes (build-time generated pages):

- `/` — frontpage (existing), featured projects + "See all projects" link.
- `/cv` — full CV (existing), featured projects + new Interests section.
- `/projects` — NEW. All non-draft projects grouped by company.
- `/work/<slug>` — deep page per non-draft project (existing route, more pages).

## Integration Points

None. No external services. Outbound profile links remain the only off-site
references (cv-content ADR-002: no contact details).

## Impact Analysis

| Component | Impact Type | Description and Risk | Required Action |
|-----------|-------------|---------------------|-----------------|
| `src/content.config.ts` | modified | Add `company` (required), `featured`, `themes`, `skills`. Required `company` breaks build until existing entry updated. Low risk. | Add fields; update existing markdown frontmatter in same change. |
| `src/content/work/axon-ai-platform.md` | modified | Add `company`/`featured`/tags; deepen body to template. Low risk. | Update frontmatter + deepen copy under voice rules. |
| `src/content/work/*.md` (DFDS) | new | New featured case study to the standard template. Low risk. | Author from `cv.ts` DFDS roles + real metrics. |
| `src/data/cv.ts` | modified | Add tag fields, `Interest` type, `interests` data; deepen hero/summary/bullets. Type-checked. Low risk. | Extend types, populate tags + interests, rewrite copy. |
| `src/pages/projects.astro` | new | New `/projects` index grouped by company. Low risk. | Build page reusing section pattern + CaseStudyCard or a compact entry. |
| `src/components/CaseStudies.astro` | modified | Filter to featured + add "See all projects" link. Risk: empty featured set hides section. Low. | Filter `featured`; render link; keep empty-state guard. |
| `src/components/Interests.astro` | new | New `/cv` section. Low risk. | Build following section-wrapper/heading pattern; wire into `cv.astro`. |
| `src/pages/cv.astro` | modified | Insert `<Interests />`. Low risk. | Import + place near Personal Details. |
| `src/pages/work/[slug].astro` | unchanged | Generates more pages as projects are added. Low risk. | None (verify thin entries carry real bodies). |

## Testing Approach

This project has no unit-test runner; verification is type-check, build, content
gates, and audits (the cv-content toolchain). "Tests" below are concrete
verification commands and content gates, run fresh before any completion claim.

### Unit Tests

- `npx astro check` — 0 errors, 0 warnings. Proves the extended `cv.ts` types and
  every `work` frontmatter satisfy the schema (e.g. missing `company` fails).
- Schema negative check: a `work` file missing `company` fails `astro build`
  (confirms `company` is required).
- Content gates (grep, expect zero hits) across `src/`:
  - No placeholders (`Lorem`, `TODO`, `placeholder`).
  - No contact leaks (`@icloud.com`, `+45`, `mailto:`, `tel:`).
  - No em dashes in authored copy.
- Voice review of every changed/added copy block against the AI-tells list
  (no "furthermore"/"moreover", no parallel triads, no "it's not X it's Y", no
  buzzword stacking).

### Integration Tests

- `npx astro build` — exit 0; confirm `/projects` and every `/work/<slug>` emit.
- `/projects` renders every non-draft project, grouped by company; featured
  entries link to their deep page; a title-only-but-summarised entry still shows.
- Frontpage and `/cv` show only featured projects and a working "See all
  projects" link to `/projects`.
- `/cv` renders the Interests section near Personal Details.
- Link integrity: `linkinator` over the built site with `--skip 'joncarlsen.dk'`
  resolves all internal links (200), including `/projects` and new deep pages.
- Real Lighthouse (desktop preset) on `/`, `/cv`, `/projects`, and a deep page:
  performance and accessibility hold the project bar in both themes; WCAG AA.
- Print check: `/projects` and the Interests section print cleanly under the
  existing `@media print` rules (no contact details introduced).

## Development Sequencing

### Build Order

1. **Extend the `work` schema** (`content.config.ts`) and update
   `axon-ai-platform.md` frontmatter (`company`, `featured: true`, tags) so the
   build stays green. No dependencies.
2. **Extend `cv.ts` types and tags** — add `themes`/`skills` to `Role`, `themes`
   to `Highlight`, the `Interest` type and `interests` field; populate tags for
   existing roles/impact and author the interests content. Depends on nothing in
   this list but is independent of step 1; can run in parallel.
3. **Interests section** (`Interests.astro` + wire into `cv.astro`). Depends on
   step 2 (the `interests` data and type).
4. **`/projects` index** (`projects.astro`). Depends on step 1 (the `company`
   field) and reuses the section pattern.
5. **Surface featured + link** — update `CaseStudies.astro` to filter `featured`
   and add the "See all projects" link. Depends on steps 1 and 4 (the `/projects`
   route exists and `featured` is populated).
6. **Deepen existing copy + add the DFDS featured case study** — rewrite hero,
   summary, role bullets in `cv.ts`; deepen `axon-ai-platform.md`; author the
   DFDS case study to the standard template. Depends on steps 1-2 (schema + types
   in place) so new frontmatter and tags validate.
7. **Verification pass** — run the full Testing Approach toolchain. Depends on all
   prior steps.

### Technical Dependencies

- No infrastructure or external service dependencies.
- Owner content: deepened copy and the DFDS case study need real figures from the
  owner's material; missing metrics are omitted, not invented.

## Monitoring and Observability

Not applicable. Static site, no runtime. Build-time signals are the verification
toolchain (type-check, build, gates, Lighthouse, linkinator).

## Technical Considerations

### Key Decisions

- **Decision**: Hybrid store — projects in the `work` collection, tags added to
  the `cv.ts` spine (ADR-003).
  - **Rationale**: Smallest, lowest-risk change on a shipped site; reuses the
    route and components.
  - **Trade-offs**: Two stores to keep coherent; tag vocabulary spans two schemas.
  - **Alternatives rejected**: Move everything into collections (big refactor, no
    new capability); keep everything in `cv.ts` (loses markdown bodies).
- **Decision**: Every non-draft project renders a `/work/<slug>` page; `featured`
  controls surfacing only (refines ADR-002).
  - **Rationale**: Owner wants every project addressable.
  - **Trade-offs**: Risk of thin pages; mitigated by requiring real summary+body
    before publishing.
- **Decision**: Free-form string tags, no enum (ADR-004).
  - **Rationale**: Flexible authoring while the vocabulary settles.
  - **Trade-offs**: No build-time typo protection; documented recommended set.
- **Decision**: Interests on `/cv` only.
  - **Rationale**: Keep the frontpage scan tight.

### Known Risks

- **Thin project stubs** (medium): every project gets a page. Mitigation: publish
  only with a real summary and body; keep incomplete ones `draft: true`.
- **Tag drift** (medium): free-form tags can diverge. Mitigation: documented
  recommended vocabulary near the fields; an enum remains an easy later add.
- **Copy reads AI-written** (medium): Mitigation: voice gate on every block.
- **`/projects` + deep pages SEO/maintenance** (low for MVP): the Phase 2 variants
  are where duplicate-content risk lives; deferred and gated by a value check.

## Architecture Decision Records

- [ADR-001: Structured, tagged content source for leadership CVs](adrs/adr-001.md)
  — One tagged source feeds the site, future variants, and offline tailoring;
  amends cv-content ADR-002, keeps `/cv` canonical.
- [ADR-002: Two-tier project model](adrs/adr-002.md) — Featured deep case studies
  plus a `/projects` index grouped by company.
- [ADR-003: Hybrid content model](adrs/adr-003.md) — Projects in the `work`
  collection (every project gets a page; `featured` surfaces); tags on the
  `cv.ts` spine; interests on `/cv`. Refines ADR-002.
- [ADR-004: Free-form theme and skill tags](adrs/adr-004.md) — String tags, no
  enforced enum, with a documented recommended vocabulary.
