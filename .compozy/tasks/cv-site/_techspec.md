# TechSpec: Personal CV Site

## Executive Summary

The CV site is a single static page built with **Astro**, styled with
**Tailwind CSS**, and deployed to **GitHub Pages** via a **GitHub Actions**
workflow, served at the custom domain **https://joncarlsen.dk** (Astro
`site: 'https://joncarlsen.dk'`, `base: '/'`; see ADR-006). All CV content lives
in one typed data file (`src/data/cv.ts`); four
presentational components (`Hero`, `Timeline`, `Impact`, `Links`) render it,
composed in `src/pages/index.astro`. Astro ships near-zero client JavaScript, so
the page is static HTML plus a small purged Tailwind stylesheet — directly
serving the PRD's mobile-first, sub-1s-load goal. A downloadable
`public/resume.pdf` (no contact details) is linked from the Links section. There
is no backend, no API, no database, and no contact form (per ADR-002).

**Primary technical trade-off:** choosing Astro + Tailwind over plain HTML/CSS
adds a build step and a small toolchain in exchange for content/presentation
separation, type safety on the content shape, and fast responsive development.
For a page the owner must keep current with low effort, that trade favors
maintainability over zero-tooling minimalism.

## System Architecture

### Component Overview

All components are build-time Astro components; nothing runs on the client beyond
static HTML/CSS.

- **`src/data/cv.ts`** — single source of truth for all CV content. No
  presentation logic. Consumed by every component.
- **`Hero.astro`** — renders name, current title, and the one-line value
  proposition (above the fold). Maps to PRD *Hero + summary*.
- **`Timeline.astro`** — renders the chronological list of roles (company, dates,
  team scope). Maps to PRD *Experience timeline*.
- **`Impact.astro`** — renders selected achievements, each led by a quantified
  result. Maps to PRD *Impact highlights*.
- **`Links.astro`** — renders outbound profile links and the PDF download. The
  only path off the page. Maps to PRD *Outbound links* (and ADR-002).
- **`src/pages/index.astro`** — composes the four components in order; owns page
  metadata (title, description, social/OG tags) for credible link sharing.
- **`astro.config`** — sets `site: 'https://joncarlsen.dk'` and `base: '/'` for
  the custom domain on GitHub Pages; registers the Tailwind integration.
- **`public/CNAME`** — single line `joncarlsen.dk`; preserves the custom-domain
  binding on every Pages deploy (see ADR-006).

**Data flow:** `cv.ts` → imported by `index.astro` → passed to each component as
props → rendered to static HTML at build time. One direction, no runtime state.

**External interactions:** none at runtime. The only external references are
outbound hyperlinks (GitHub, LinkedIn, other profiles) and the static PDF.

## Implementation Design

### Core Interfaces

This project is TypeScript/Astro, not Go; per the template's "omit/adapt" license,
the canonical Go-interface requirement is satisfied by the equivalent TypeScript
content interface below. This single type is the contract every component depends
on and is also the project's only data model (see Data Models).

```ts
// src/data/cv.ts
export interface CvData {
  name: string;
  title: string;        // current role/title
  valueProp: string;    // one-line hero positioning statement
  roles: Role[];        // experience timeline, newest first
  impact: Highlight[];  // selected quantified achievements
  links: ProfileLink[]; // outbound profile links
  resumePdf?: string;   // path to public/resume.pdf, omit to hide download
}

export interface Role {
  company: string;
  position: string;
  start: string;        // e.g. "2021"
  end: string;          // e.g. "Present"
  scope: string;        // team/org scope, e.g. "Led 30 across 4 teams"
}

export interface Highlight {
  metric: string;       // the number, shown first, e.g. "5 → 30"
  summary: string;      // what the metric means
}

export interface ProfileLink {
  label: string;        // e.g. "LinkedIn"
  url: string;
}
```

Components accept their slice of `CvData` as typed props; a missing or malformed
field is a build-time type error, not a runtime failure.

### Data Models

The `CvData` interface above is the complete domain model. There is no database
and no persistent storage — content is compiled into static HTML at build time.
Editing the site means editing the `cv.ts` literal that satisfies `CvData`.

### API Endpoints

**Not applicable.** The site is fully static with no backend or API surface.

## Integration Points

**Not applicable.** No external services are integrated at runtime. Outbound
links are plain hyperlinks; the PDF is a static asset. The only build/deploy
integration is GitHub Pages (see ADR-004).

## Impact Analysis

| Component | Impact Type | Description and Risk | Required Action |
|-----------|-------------|---------------------|-----------------|
| Repository (`carlsendk/joncarlsen`) | new | Greenfield Astro project added to an empty repo. Low risk. | Scaffold Astro + Tailwind. |
| `src/data/cv.ts` | new | Single content source; errors here surface at build. Low risk. | Define `CvData` and populate content. |
| `Hero/Timeline/Impact/Links` components | new | Presentational only. Low risk. | Implement and style per section. |
| `astro.config` (`site`/`base`) | new | Set to `https://joncarlsen.dk` / `/` (ADR-006). Low risk. | Set the resolved values. |
| `public/CNAME` | new | Holds `joncarlsen.dk`; missing file drops the custom domain on deploy. Low risk. | Commit the CNAME file. |
| DNS + Pages settings | external config | Apex DNS records + "Enforce HTTPS" for joncarlsen.dk. Medium risk (one-time). | Configure registrar DNS; enable Pages + HTTPS. |
| `public/resume.pdf` | new | Owner-provided file, no contact details. Low risk. | Owner supplies the PDF. |
| GitHub Actions workflow | new | Build + quality gate + Pages deploy. Low risk. | Add workflow; enable Pages (source: Actions). |

## Testing Approach

### Unit Tests

**Minimal by design.** The site has no interactive logic or runtime branching, so
component unit tests would test the framework, not our code (YAGNI). The
build-time type check on `CvData` is the primary correctness guard: malformed
content fails the build.

### Integration Tests

**Not applicable** in the traditional sense (no integrated services). Replaced by
a pre-deploy **quality gate** in CI that exercises the built site end-to-end:

- **Build + type check** — `astro build` and `astro check` must pass.
- **Lighthouse** — performance and accessibility budgets run against the built
  output; the deploy fails if a budget is missed (guards the PRD's fast-load and
  accessibility goals).
- **Link check** — verify outbound links and the PDF path resolve (guards the
  PRD success metric "the outbound links work").

## Development Sequencing

### Build Order

1. **Scaffold the Astro project** — initialize Astro in the repo, add the
   Tailwind integration, set `site: 'https://joncarlsen.dk'` and `base: '/'` in
   `astro.config`, and commit `public/CNAME` (`joncarlsen.dk`). No dependencies.
2. **Define `CvData` and seed `src/data/cv.ts`** — author the interface and a
   content literal (placeholder content acceptable initially). Depends on step 1.
3. **Build the section components** (`Hero`, `Timeline`, `Impact`, `Links`) and
   compose them in `index.astro`; add page/OG metadata. Depends on step 2 (props
   typed against `CvData`).
4. **Apply Tailwind styling** — mobile-first responsive layout, visual hierarchy,
   accessible contrast and semantics. Depends on step 3.
5. **Add `public/resume.pdf` and wire the Links download** — depends on step 3
   (Links component) and the owner providing the file.
6. **Add the GitHub Actions workflow** — build, quality gate (build/type check +
   Lighthouse + link check), deploy to Pages. Depends on step 1 (buildable
   project) and steps 3–5 for a meaningful quality-gate run.
7. **Configure DNS + custom domain and go live** — set the apex DNS records for
   `joncarlsen.dk` at the registrar to point at GitHub Pages, enable Pages
   (source: GitHub Actions) with the custom domain and "Enforce HTTPS", then
   deploy and verify the live URL. Depends on steps 1 and 6.

### Technical Dependencies

Blocking items that must be resolved before or during implementation:

- **Domain/URL — RESOLVED:** custom domain `https://joncarlsen.dk` on GitHub
  Pages, so Astro `site: 'https://joncarlsen.dk'`, `base: '/'`, plus a
  `public/CNAME` file (ADR-006). No longer blocking.
- **DNS + HTTPS** — apex DNS records for `joncarlsen.dk` must point at GitHub
  Pages and "Enforce HTTPS" must be enabled (registrar + repo settings).
  Required before step 7 go-live.
- **GitHub Pages enabled** for the repo with source set to GitHub Actions.
- **Owner-provided content** — real values for `cv.ts` (hero value prop, roles,
  impact numbers, which profile links) and the `resume.pdf` file. These are open
  PRD content questions; placeholders unblock build but not go-live.
- **Node/Astro toolchain** available in CI (provided by the workflow).

## Monitoring and Observability

**Not applicable for v1.** The PRD excludes analytics/visitor tracking; success
is judged qualitatively. Operational visibility is limited to GitHub Actions
build/deploy status (success/failure of each push) and the Lighthouse report
produced by the quality gate. Optional privacy-respecting analytics are deferred
to PRD Phase 2.

## Technical Considerations

### Key Decisions

- **Decision:** Astro static-site generator with a single typed content file.
  **Rationale:** near-zero JS for speed, component structure, content/markup
  separation for low-effort updates. **Trade-offs:** adds a build step vs plain
  HTML. **Alternatives rejected:** plain HTML/CSS (no content/type separation),
  Next.js/React (excess JS and tooling). See ADR-003.
- **Decision:** GitHub Pages via GitHub Actions. **Rationale:** free, no new
  accounts, matches existing repo/remote, push-to-deploy. **Trade-offs:** no
  deploy previews; base-path care needed. **Alternatives rejected:** Cloudflare
  Pages/Netlify (new account), Firebase (more setup). See ADR-004.
- **Decision:** Tailwind CSS. **Rationale:** fast mobile-first responsive work,
  small purged output. **Trade-offs:** build dependency, class verbosity.
  **Alternatives rejected:** plain scoped CSS (slower), classless frameworks
  (too little design control). See ADR-005.
- **Decision:** PDF resume without contact details, owner-provided static file.
  **Rationale:** gives recruiters the expected artifact while honoring ADR-002.

### Known Risks

- **Custom-domain/DNS misconfiguration** (one-time, medium likelihood): wrong DNS
  records or a missing `public/CNAME` drop the custom domain or break HTTPS.
  *Mitigation:* commit `public/CNAME`, set the documented GitHub Pages apex DNS
  records, enable "Enforce HTTPS", and verify the live URL after first deploy;
  the CI link check catches broken asset/PDF paths.
- **Content staleness** (the PRD's standing risk): *Mitigation:* the single typed
  `cv.ts` makes updates a one-file, low-risk edit.
- **PDF/page divergence:** the PDF can drift from the page content. *Mitigation:*
  treat `cv.ts` as the source of truth and refresh the PDF when content changes;
  keep it optional via the `resumePdf` field.

## Architecture Decision Records

- [ADR-001: Single-page scrolling CV as the v1 product shape](adrs/adr-001.md) —
  One mobile-first scrolling page over a multi-page portfolio or resume mirror.
- [ADR-002: No contact form or contact details in v1 — outbound links only](adrs/adr-002.md) —
  Avoid a spam surface by linking to existing profiles instead of collecting
  contact on the site.
- [ADR-003: Astro as the static-site stack with a single content-data file](adrs/adr-003.md) —
  Astro + a typed `cv.ts` for near-zero JS and low-effort content updates.
- [ADR-004: Host on GitHub Pages with push-to-deploy via GitHub Actions](adrs/adr-004.md) —
  Free, account-free, push-to-deploy hosting matching the existing repo.
- [ADR-005: Style with Tailwind CSS](adrs/adr-005.md) —
  Utility-first, mobile-first styling with small purged output.
- [ADR-006: Serve the site at custom domain joncarlsen.dk on GitHub Pages](adrs/adr-006.md) —
  Custom domain at the root (`base: '/'`) via a `public/CNAME` file + DNS;
  resolves ADR-004's base-path fork.
