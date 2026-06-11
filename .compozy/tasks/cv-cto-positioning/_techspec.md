# TechSpec: CTO-Altitude CV Positioning

## Executive Summary

This feature re-pitches the existing canonical CV to CTO altitude by extending the
single typed content source (`src/data/cv.ts`) and adding two small section
components, with no new architecture. We add a `scope` line and a `credentials`
list, recast the existing `summary`/`valueProp` copy, and render the already
present but unused `about` (leadership vision) and `talks` (writing) fields. We add
a few strategic project entries through the existing `work` collection, and stage
high-value missing figures with draft-gated `[TODO]` markers that a render guard
keeps off the live site (ADR-003). A `content-gaps.md` checklist tracks what the
owner still needs to supply.

Primary trade-off: the draft-gated placeholder mechanism adds a small render guard
and moves the placeholder leak check from source to built output, in exchange for
letting the owner draft figures in their real sentence context without ever leaking
unfinished text. The reuse-first data model keeps the change small and low-risk on
a shipped site, at the cost of spreading CTO content across a few existing fields
rather than one structured object.

## System Architecture

### Component Overview

- **`src/data/cv.ts`** — modified. Adds `scope: string` and `credentials: string[]`
  to `CvData`; recasts `valueProp` and `summary` to CTO altitude; populates the
  existing optional `about` (vision narrative) and `talks` (writing references).
  Exports a small `isReady(text): boolean` guard (ADR-003).
- **`src/components/Approach.astro`** — new. Renders the `about` vision narrative
  and the `talks` writing references as one section, following the established
  section-wrapper/heading pattern.
- **`src/components/Credentials.astro`** — new. Renders the curated `credentials`
  list (executive signals) as a scannable section.
- **Scope line** — rendered in the hero/summary area of `/cv` and the frontpage
  (in `Hero.astro` or `Summary.astro`), front-loading executive scope.
- **Array-rendering components** (`Timeline`, `Impact`, `Credentials`, `Approach`)
  — modified to filter items through `isReady`, so `[TODO]`-marked drafts never
  render (ADR-003).
- **`src/content/work/*.md`** — content. A few new strategic project entries
  (non-featured), real content only, satisfying the existing `work` schema.
- **`src/pages/cv.astro`, `src/pages/index.astro`** — modified to place the scope
  line, `Approach`, and `Credentials` sections.
- **`.compozy/tasks/cv-cto-positioning/content-gaps.md`** — new planning artifact
  (not part of the built site). The single checklist of figures to supply.

Data flow: `cv.ts` feeds the spine sections and the two new sections; the `work`
collection feeds projects. All resolves at build time; no runtime code beyond the
existing theme toggle.

## Implementation Design

### Core Interfaces

TypeScript/Astro project (no Go). The primary contract is the extended `CvData`
plus the render guard.

```ts
export interface CvData {
  /* ...existing fields... */
  scope: string;            // NEW: hard executive scope line
  credentials: string[];    // NEW: curated executive signals
  about?: string;           // existing: rendered as the vision section
  talks?: string[];         // existing: rendered as writing references
}

// ADR-003: a string is render-ready unless it holds a draft sentinel.
export const TODO_SENTINEL = "[TODO";
export function isReady(text: string): boolean {
  return !text.includes(TODO_SENTINEL);
}
```

### Data Models

- **CvData** gains `scope` (required string) and `credentials` (string array). No
  other shape change. `about`/`talks` move from unused to rendered.
- **Project** = existing `work` entry; new strategic entries reuse the schema
  (`company`, `featured: false`, `themes`, `skills`, real `metrics` only).
- No database or storage; all content is files resolved at build.

### API Endpoints

None. Static site. Routes are unchanged: `/`, `/cv`, `/projects`, `/work/<slug>`.
No new route; the CTO re-pitch is in place on the canonical pages.

## Integration Points

None. No external services. Outbound profile and writing links remain the only
off-site references; no contact details (cv-content ADR-002).

## Impact Analysis

| Component | Impact Type | Description and Risk | Required Action |
|-----------|-------------|---------------------|-----------------|
| `src/data/cv.ts` | modified | Add `scope`, `credentials`, `isReady`; recast `summary`/`valueProp`; populate `about`/`talks`. Type-checked. Low risk. | Extend type, add guard, recast/populate content. |
| `src/components/Approach.astro` | new | Vision + writing section. Low risk. | Build to section pattern; filter via `isReady`. |
| `src/components/Credentials.astro` | new | Executive credentials section. Low risk. | Build to section pattern; filter via `isReady`. |
| `src/components/Hero.astro` or `Summary.astro` | modified | Render the scope line. Low risk. | Add scope prop and markup. |
| `src/components/Timeline.astro`, `Impact.astro` | modified | Filter array items through `isReady`. Low risk. | Apply guard to bullets/highlights. |
| `src/pages/cv.astro` | modified | Place scope line, `Approach`, `Credentials`. Low risk. | Import and order new sections. |
| `src/pages/index.astro` | modified | Front-load executive summary + scope line. Low risk. | Place scope/summary in the scan. |
| `src/content/work/*.md` | new | A few strategic project entries, real content. Low risk. | Author from documented history. |
| `content-gaps.md` | new | Checklist of figures to supply. No site impact. | Create and keep in sync with `[TODO]`s. |

## Testing Approach

No unit-test runner; verification is type-check, build, content gates, and audits
(the established toolchain), run fresh before any completion claim.

### Unit Tests

- `npx astro check` reports 0 errors and 0 warnings with the extended `CvData`.
- `isReady` returns false for a string containing `[TODO` and true otherwise
  (exercised by a ready item and a TODO item in `cv.ts`).
- A `cv.ts` array item containing `[TODO` is absent from the rendered component
  output (guard applied).

### Integration Tests

- `npx astro build` exits 0; `/`, `/cv`, `/projects`, and new `/work/<slug>` emit.
- **Built-output placeholder gate (ADR-003)**: grep `dist/**/*.html` for the
  sentinel `[TODO` and for `lorem`/`placeholder`; expect zero hits even though
  `cv.ts` source contains `[TODO` markers.
- Contact-leak gate over `src/` (`@icloud.com|+45|mailto:|tel:`) returns zero
  (the source docs contain contact details; none reach the site).
- Em-dash and AI-tell gates over changed `src/` content return zero.
- `/cv` renders the scope line, the `Approach` vision section, and the
  `Credentials` block; the frontpage front-loads the executive summary and scope.
- Voice review of every recast/added copy block against the AI-tells list.
- `linkinator` (with `--skip 'joncarlsen.dk'`) resolves internal and writing links;
  real Lighthouse on `/`, `/cv`, and a deep page holds performance and
  accessibility in both themes; WCAG AA; print-friendly CV preserved.

## Development Sequencing

### Build Order

1. **Extend `cv.ts` types and guard** — add `scope` and `credentials` to `CvData`
   and export `isReady`/`TODO_SENTINEL`. No dependencies.
2. **Apply the render guard** — filter array items through `isReady` in
   `Timeline` and `Impact`. Depends on step 1.
3. **Add the two sections** — `Approach.astro` (`about` + `talks`) and
   `Credentials.astro` (`credentials`), each filtering via `isReady`. Depends on
   step 1 (fields/guard).
4. **Render the scope line** — extend `Hero` or `Summary` to show `scope`. Depends
   on step 1.
5. **Wire pages** — place the scope line, `Approach`, and `Credentials` in
   `cv.astro`, and front-load the executive summary + scope on `index.astro`.
   Depends on steps 3 and 4.
6. **Recast and populate content** — rewrite `valueProp`/`summary` to CTO altitude,
   author `scope`, `credentials`, `about`, `talks`; add a few strategic `work`
   entries; seed `[TODO]` markers where high-value figures are missing. Depends on
   steps 1-5 so all fields and sections exist.
7. **Create `content-gaps.md`** — enumerate every `[TODO]` and the figures to
   supply. Depends on step 6.
8. **Verification pass** — run the full Testing Approach toolchain, including the
   built-output placeholder gate. Depends on all prior steps.

### Technical Dependencies

- No infrastructure or external service dependencies.
- Owner content: recast copy and the new projects draw from the owner's documents
  and existing `cv.ts`; missing figures become `[TODO]` markers plus checklist
  entries, never invented.

## Monitoring and Observability

Not applicable. Static site, no runtime. Build-time signals are the verification
toolchain, with the built-output placeholder gate as the leak guard.

## Technical Considerations

### Key Decisions

- **Decision**: Reuse the existing data model with minimal new fields (`scope`,
  `credentials`) and render the existing `about`/`talks`.
  - **Rationale**: Smallest, lowest-risk change; keeps one typed source.
  - **Trade-offs**: CTO content spreads across a few fields rather than one object.
  - **Alternatives rejected**: A single `executiveProfile` object (larger refactor
    for no new capability).
- **Decision**: Two small section components plus a scope line in the hero/summary
  (not one combined Executive Profile block).
  - **Rationale**: Matches the existing section pattern; composable; low risk.
- **Decision**: Draft-gated placeholders via a sentinel and render guard, verified
  against built output (ADR-003).
  - **Rationale**: Lets the owner draft figures in context with no leak.
  - **Trade-offs**: A small guard and a change to the placeholder gate's target.

### Known Risks

- **A component skips the guard, leaking a `[TODO]`** (low): Mitigation: the
  built-output gate fails the build on any sentinel in `dist/`.
- **Copy drifts into executive buzzwords / AI tells** (medium): Mitigation: voice
  gate on every block.
- **Contact details from source docs leak** (low): Mitigation: contact-leak gate;
  no contact field exists structurally.
- **Over-claiming without figures** (medium): Mitigation: truth-first enrichment;
  gaps become `[TODO]`s and checklist items, never invented (ADR-002).

## Architecture Decision Records

- [ADR-001: Re-pitch the canonical CV to CTO altitude in one pass](adrs/adr-001.md)
  — Enrich from the owner's documents and recast the existing site to executive
  altitude as a single content feature.
- [ADR-002: Truth-first enrichment with a supply-list and source placeholders](adrs/adr-002.md)
  — Real content only; high-value gaps tracked as a checklist; nothing invented;
  no contact details.
- [ADR-003: Draft-gated placeholders via a sentinel and a render guard](adrs/adr-003.md)
  — `[TODO]` markers in `cv.ts` are filtered out by `isReady` and verified absent
  from the built HTML.
