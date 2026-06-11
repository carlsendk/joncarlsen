# TechSpec: CV Content & Supporting Features

## Executive Summary

This feature replaces placeholder content with the owner's real career material
and grows the site from one page into a hub-and-spoke set of static pages: a
short frontpage (`/`), a full CV (`/cv`), and a growable project deep-dive layer
(`/work/<slug>`), per [ADR-001]. It is a presentation-and-content change on the
existing stack (Astro 6.4.4, Tailwind v4 via PostCSS, Netlify), reusing the
design tokens and components from `cv-visual-design`. No new runtime
dependencies.

The content layer is split ([ADR-003]): all structured CV facts live in the
existing typed data file `src/data/cv.ts` (expanded), single-sourced and
type-checked, while long-form case studies live as markdown in a new Astro
content collection. The primary technical trade-off: introducing a second
content store (a content collection, new to this repo) and several new section
components in exchange for keeping shared facts single-sourced and type-safe
while making project deep-dives first-class, URL-addressable pages an owner can
add by dropping in a markdown file.

## System Architecture

### Component Overview

**Pages (routes)**
- `src/pages/index.astro` (modified) - the frontpage. Imports a subset of
  `cvData`: hero, top-N condensed roles, highlights, expertise, links. Links to
  `/cv`. Optional headshot (Phase 2).
- `src/pages/cv.astro` (new) - the full CV. Imports all of `cvData` and renders
  every section, plus links to case studies. Carries the print stylesheet.
- `src/pages/work/[slug].astro` (new) - dynamic route; one statically rendered
  page per markdown file in the `work` collection via `getStaticPaths`.

**Content stores**
- `src/data/cv.ts` (modified) - expanded `CvData` (the single source of truth
  for structured facts).
- `src/content/work/*.md` (new) - one markdown file per case study.
- `src/content.config.ts` (new) - defines the `work` collection schema (Zod).

**Section components** (`src/components/`)
- Modified (new props/variants): `Hero.astro`, `Timeline.astro` (experience),
  `Impact.astro` (highlights), `Links.astro`.
- New: `Summary.astro`, `Expertise.astro`, `Education.astro`,
  `Certifications.astro`, `Publications.astro`, `PersonalDetails.astro`,
  `TalksWriting.astro` (Phase 2), `About.astro` (Phase 2), `CaseStudyCard.astro`
  (lists/links case studies).
- Reused as-is: `Base.astro` (layout), `ThemeToggle.astro`, `global.css` tokens.

**Data flow**: `cv.ts` -> imported by `index.astro` (subset) and `cv.astro`
(full) -> passed as props to section components. `work` collection ->
`getCollection('work')` in `cv.astro`, `index.astro` (for links) and
`work/[slug].astro` (for full render). No runtime fetching; all static at build.

### Single roles array, two renderings

There is exactly one `roles` array in `cvData`. The frontpage renders a
condensed top-N (company, title, dates, one scope line); `/cv` renders all roles
including achievement bullets. This is a render-time concern, not a data fork:
`Timeline.astro` takes a `variant: "condensed" | "full"` prop (and an optional
`limit`) and decides whether to show `bullets`. The data is never duplicated.

## Implementation Design

### Core Interfaces

Expanded content model in `src/data/cv.ts`. Note `PersonalDetails` has no
`email` or `phone` field by design - the absence is structural so [ADR-002]
cannot be violated by "filling in a blank":

```typescript
export interface CvData {
  name: string;
  title: string;            // leading leadership identity (ADR-002)
  valueProp: string;        // one-line hero positioning
  summary: string;          // 3-4 line professional summary (/cv)
  expertise: string[];      // areas of expertise
  roles: Role[];            // newest first; one array, two renderings
  impact: Highlight[];      // quantified highlights
  education: Education[];
  certifications: string[]; // certs, networks, associations
  publications: string[];   // publications and honours
  links: ProfileLink[];     // outbound profiles (no contact details)
  personalDetails: PersonalDetails; // dob/nationality/marital ONLY
  about?: string;           // Phase 2 narrative; optional
  talks?: string[];         // Phase 2 talks/writing
}

export interface Role {
  company: string; position: string; start: string; end: string;
  scope: string;            // one-line scope (frontpage condensed)
  bullets: string[];        // achievement bullets (/cv full render)
}

export interface PersonalDetails {
  dob: string; nationality: string; maritalStatus: string;
}
```

The `work` collection schema in `src/content.config.ts` is the contract every
case-study file must satisfy (build fails on violation):

```typescript
import { defineCollection, z } from "astro:content";
const work = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),       // one-line teaser for cards
    role: z.string(),          // e.g. "Director of Engineering & AI"
    period: z.string(),        // e.g. "2023-Present"
    metrics: z.array(z.string()).default([]),
    order: z.number().default(0), // sort for listings
    draft: z.boolean().default(false),
  }),
});
export const collections = { work };
```

### Data Models

- `CvData` / `Role` / `Highlight` / `Education` / `PersonalDetails` /
  `ProfileLink` - typed entities in `src/data/cv.ts` (above).
- `work` collection entries - markdown body + typed frontmatter (schema above).
  Slug derives from filename (`axon-ai-platform.md` -> `/work/axon-ai-platform`).

### API Endpoints

Not applicable. The site is fully static (no server, no API). "Endpoints" are
build-time routes only: `/`, `/cv`, `/work/<slug>` (one per non-draft
collection entry).

## Integration Points

No external services at runtime (preserves the no-tracking, no-contact stance).
Build- and deploy-time only:
- **Netlify** ([ADR-007] of `cv-site`) - existing push-to-deploy; build runs
  `astro check && astro build` then `linkinator`; `@netlify/plugin-lighthouse`
  enforces perf/a11y. New routes are covered automatically.
- **astro:assets / sharp** - build-time image optimization for the headshot
  (built into Astro; no new dependency).

## Impact Analysis

| Component | Impact Type | Description and Risk | Required Action |
|-----------|-------------|---------------------|-----------------|
| `src/data/cv.ts` | modified | Expand `CvData` with full structured fields; fill with real content. Low risk, type-checked. | Extend interfaces; replace placeholder data. |
| `src/pages/index.astro` | modified | Restructure to condensed frontpage; import subset; link to `/cv`. Medium. | Rework section composition. |
| `src/pages/cv.astro` | new | Full CV page + print CSS. Medium. | Create page and section layout. |
| `src/pages/work/[slug].astro` | new | Dynamic case-study route via `getStaticPaths`. Medium. | Create route + layout. |
| `src/content.config.ts` | new | `work` collection Zod schema. Low. | Define collection. |
| `src/content/work/*.md` | new | Seeded case study/studies. Low. | Author 1 (MVP) + 1 (Phase 2). |
| `Timeline.astro` | modified | Add `variant`/`limit`; render `bullets` in full. Medium. | Add props + bullet markup. |
| `Hero.astro` | modified | Real content; optional photo slot (Phase 2). Low. | Update; add optional image. |
| `Impact.astro`, `Links.astro` | modified | Real content; Links may add writing/KB link. Low. | Update content/props. |
| `Summary/Expertise/Education/Certifications/PersonalDetails.astro` | new | `/cv` sections. Low each. | Create components. |
| `About/TalksWriting/CaseStudyCard.astro` | new | Phase 2 (About, Talks) + card (MVP for listing). Low. | Create components. |
| `global.css` | modified | Add `@media print` rules for `/cv`. Low. | Add print block. |

## Testing Approach

Reuses the project's established verification pipeline; no test framework is
added for a static content site.

### Unit / build-level checks
- `astro check` passes (TypeScript valid across expanded `CvData` and all
  pages/components).
- `astro build` succeeds and emits `/`, `/cv`, and one `/work/<slug>/` page per
  non-draft collection entry (assert files exist in `dist/`).
- Invalid case-study frontmatter fails the build (Zod schema enforced) - verify
  by a deliberate bad-field check during development.
- No placeholder strings remain: grep `dist/` for "Your Name", "Company A",
  "TODO(owner)" returns nothing.
- No contact-detail leak: grep rendered HTML for an `@`-email pattern and the
  phone number returns nothing on any page ([ADR-002]).

### Integration / end-to-end checks
- `linkinator` passes on the built site (frontpage -> `/cv` -> `/work/<slug>`
  and outbound links resolve; no broken internal links).
- Real Lighthouse (system Chrome, `--preset=desktop`) on `/` and `/cv` in both
  themes: performance and accessibility hold at the project bar.
- Playwright: frontpage "View full CV" navigates to `/cv`; a case-study link
  from `/cv` opens `/work/<slug>`; print emulation (`emulateMedia screen=print`)
  on `/cv` hides toggle/grain and renders light-on-white.
- Voice-rule check (manual gate): all authored copy reviewed against the
  `about-me.md` rules (no em dashes; none of the listed AI tells). This is an
  acceptance criterion enforced by review, not automatable.

## Development Sequencing

### Build Order

1. **Expand `CvData` in `src/data/cv.ts`** - no dependencies. Add the new
   interfaces (`summary`, `expertise`, `education`, `certifications`,
   `publications`, `personalDetails`, `Role.bullets`) and replace placeholder
   data with real content from `docs/Content/_base/master-CV.md`.
2. **Define the `work` content collection** (`src/content.config.ts`) - no code
   dependency on step 1; do early so authoring can begin.
3. **Update experience rendering** (`Timeline.astro` add `variant`/`limit` +
   bullets) - depends on step 1 (`Role.bullets`).
4. **Build `/cv` page and its new section components** (Summary, Expertise,
   Education, Certifications, PersonalDetails; full Timeline/Impact/Links) -
   depends on steps 1 and 3.
5. **Restructure the frontpage** (`index.astro`) to condensed form + "View full
   CV" link - depends on steps 1 and 3 (shares the same data/components).
6. **Add the `/work/[slug]` route + `CaseStudyCard`, seed one real case study** -
   depends on step 2; wire listing into `/cv` (step 4) and frontpage (step 5).
7. **Add the `@media print` stylesheet for `/cv`** - depends on step 4.
   *(Steps 1-7 complete the MVP, features 1-4.)*
8. **Phase 2 extras**: `About.astro` narrative + `TalksWriting.astro` (depends on
   steps 4-5); second seeded case study (depends on step 6); headshot via
   `astro:assets` in `Hero` (depends on step 5, and on the owner supplying a file).

### Technical Dependencies

- Owner-supplied assets gate two items only: the headshot (step 8) and any
  missing figures (e.g. Scrive SLA/cost). MVP (steps 1-7) needs neither and
  proceeds on existing `docs/Content/` material.
- No infrastructure or external-service changes; Netlify build already covers
  new routes.

## Monitoring and Observability

Not applicable beyond existing deploy-time gates. The Netlify build (astro
check, build, linkinator, Lighthouse plugin) is the operational signal; a failed
gate blocks the deploy. No runtime telemetry by design (no tracking, [ADR-002]).

## Technical Considerations

### Key Decisions

- **Decision**: Expand the typed `src/data/cv.ts` for structured facts; use an
  Astro `work` content collection for case studies ([ADR-003]).
  **Rationale**: single-sourced, type-checked facts; markdown for prose
  deep-dives with first-class URLs. **Trade-offs**: a second content store and a
  schema to maintain. **Rejected**: all-markdown (loses typing) and
  single-file-only (awkward long prose, no per-project URL).
- **Decision**: One `roles` array rendered two ways via a `variant` prop.
  **Rationale**: no data duplication between frontpage and `/cv`. **Trade-offs**:
  slightly more logic in `Timeline.astro`. **Rejected**: separate condensed/full
  data arrays (drift risk).
- **Decision**: Headshot via `astro:assets` `<Image>`, frontpage only.
  **Rationale**: build-time optimization protects the Lighthouse budget; `/cv`
  stays clean for parsing/print. **Trade-offs**: source must live in
  `src/assets/`. **Rejected**: plain `public/` image (no optimization).
- **Decision**: `@media print` stylesheet on `/cv` instead of a PDF feature.
  **Rationale**: delivers a clean downloadable CV with zero new tooling.
  **Trade-offs**: print fidelity depends on the browser. **Rejected**:
  PDF-generation (sync/contact-detail problems, per [ADR-001]).
- **Decision**: `PersonalDetails` type omits email/phone entirely.
  **Rationale**: makes the [ADR-002] no-contact-details rule structural, not a
  comment. **Trade-offs**: none. **Rejected**: optional fields (invite filling).

### Known Risks

- **Frontpage/`/cv` content drift** (low) - mitigated by the single `cvData`
  source; both pages read the same array.
- **Generated copy reads as AI-written** (medium) - mitigated by the explicit
  voice-rule acceptance gate in Testing.
- **Bundle/asset growth from new pages/photo** (low) - mitigated by static
  output, `astro:assets` optimization, and the Lighthouse deploy gate.
- **Content collection is new to the repo** (low) - mitigated by Astro's
  built-in support and a small Zod schema; build fails fast on bad frontmatter.

## Architecture Decision Records

- [ADR-001: Hub-and-spoke information architecture](adrs/adr-001.md) - Short
  frontpage + full CV page + growable project deep-dive layer, all static and
  link-navigated.
- [ADR-002: Single public leadership identity](adrs/adr-002.md) - Public site
  presents one leadership identity; multi-track tailoring stays offline; no
  contact details.
- [ADR-003: Content layer](adrs/adr-003.md) - Expanded typed `src/data/cv.ts`
  for structured facts plus an Astro `work` content collection for case studies.

[ADR-001]: adrs/adr-001.md
[ADR-002]: adrs/adr-002.md
[ADR-003]: adrs/adr-003.md
[ADR-007]: ../cv-site/adrs/adr-007.md
