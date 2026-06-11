# PRD: CV Content Depth & Targeted-CV Source

## Overview

Turn the CV content from prose into a structured, reusable source of truth, and
raise the quality and depth of what is already on the site. The shipped
`cv-content` feature made the site real (frontpage, full CV, one case study). The
owner now wants that content to behave "like a database I can make target CVs
with": one maintained source from which he can present role-targeted versions of
his CV and reuse the same material for tailored job applications. The focus
throughout is leadership positions.

- **Problem it solves**: The content is good but flat. Projects are thin, the
  text can be deepened, there is no structure to grow roughly twenty projects and
  more achievements, and nothing lets the owner produce a leadership CV tilted
  toward the themes a specific role rewards.
- **Who it is for**: Primary, recruiters and hiring managers evaluating the owner
  for senior engineering-leadership roles. Secondary, the owner, who maintains the
  source and assembles targeted leadership CVs from it.
- **Why it is valuable**: One structured source means every improvement compounds:
  the public site, any targeted leadership version, and offline per-application
  CVs all draw from the same maintained content, tagged so the right subset is a
  selection rather than a rewrite.

## Goals

- Make the content a structured, tagged source: every role, project, achievement,
  skill, and interest carries enough metadata (theme, company, period, skills) to
  be selected for a given leadership role.
- Deepen and improve the existing copy (hero, summary, role bullets, the AXON and
  DFDS case studies) to a higher editorial bar, in the owner's voice.
- Apply one consistent case-study template (Context, what I did, Outcome, with a
  metrics strip) so every project reads consistently and skims in 60 to 90
  seconds.
- Give projects a structure that scales to roughly twenty without bloating the CV:
  a few featured deep case studies plus a projects index grouped by company.
- Add a spare-time / interests section, drawn from the master CV and growable.
- Keep growable achievements in the sections that already exist (Impact metrics,
  Certifications, Publications and Honours).
- Preserve the bar: leadership identity, no contact details, static and
  near-zero-JS, mobile-first, WCAG AA, strong Lighthouse scores.

## User Stories

**Primary persona - Recruiter / Hiring manager**
- As a recruiter, I want each featured project to tell a clear story with numbers,
  so I can judge real impact quickly.
- As a recruiter, I want to see the breadth of work without a wall of text, so I
  can scan the headline projects and open the full list only if I want it.
- As a recruiter, I want the writing to read like a person wrote it, so the CV
  feels credible at a senior level.

**Secondary persona - The owner (content maintainer)**
- As the owner, I want one structured source of truth, so improvements show up
  everywhere they are used.
- As the owner, I want content tagged by theme and company, so I can assemble a
  leadership CV tilted toward a specific role without rewriting.
- As the owner, I want to add a new project or achievement as a small entry over
  time, and promote a project to a featured case study when I have written its
  story.
- As the owner, I want a spare-time / interests section I can include or drop
  depending on the audience.

## Core Features

Grouped by priority. Features 1-5 are MVP; 6 is the targeted-variant capability
(Phase 2).

1. **Structured, tagged content source** (must-have)
   - Every role, project, achievement, skill, and interest carries metadata:
     theme/domain (for example AI and LLM, platform and developer experience,
     organisational scaling and culture, cloud and real-time data, security and
     compliance, transformation), company, period, and skills.
   - This is a content source, not an application: the tags exist so subsets can
     be selected when building a page or a tailored document. There is no
     visitor-facing tag picker and no runtime filtering.

2. **Richer, consistent case studies** (must-have)
   - One template for every featured project: a one-line role and period, a
     metrics strip, then Context, what I did, and Outcome.
   - Each reads in 60 to 90 seconds, leads with metrics, and is written in the
     owner's voice. The existing AXON and DFDS studies are brought to this bar.

3. **Two-tier projects: featured plus a projects index** (must-have)
   - A few featured projects as full deep case-study pages.
   - A projects index page listing every project, grouped by company, each a short
     entry (title, one line, company, period, optional metric). Featured entries
     link to their deep page.
   - The frontpage and full CV show only the top featured projects plus a clear
     link to the projects index.

4. **Deepened and improved existing text** (must-have)
   - Rewrite and tighten the hero, summary, role achievement bullets, and the
     existing case studies to a higher bar. Plain, human, leadership-level voice:
     no em dashes; avoid stock AI phrasing, parallel triads, "it's not X, it's Y"
     constructions, and buzzword stacking. Concrete facts over adjectives.

5. **Spare-time / interests section** (must-have)
   - A short interests section drawn from the master CV (golf and Trackman,
     soccer, NFL and flag football, home automation and hobby coding, running,
     coaching and mentoring, family and outdoors), growable, and tagged so it can
     be included or dropped per audience.

6. **Targeted leadership CV versions** (Phase 2)
   - A small, deliberate set of pre-built static variant pages, each a leadership
     CV that leads with a different theme (for example an AI-leadership cut and a
     platform-engineering cut), assembled at build time by selecting on tags.
   - Built without any runtime app: no query UI, no client-side filtering. The
     default full CV stays the single canonical leadership identity; variants are
     shared alternates.

**Feature interaction**: One tagged source feeds the public site, the projects
index, and the featured case studies. The same tags later assemble the Phase 2
targeted variants and support offline per-job tailoring. Achievements grow inside
the existing CV sections; projects grow through the index and get promoted to
featured when written.

## User Experience

**Key persona & goal**: A recruiter wants to judge a senior engineering leader
fast, see real project depth on demand, and trust that the writing is genuine.

**Primary flow**:
1. Recruiter opens the frontpage, scans identity, headline metrics, expertise,
   recent roles, and the top featured projects.
2. They open the full CV for the complete history, or a featured case study for
   depth, or the projects index for breadth.
3. They follow an outbound link to verify and follow up.

**Owner flow**:
1. Owner edits the one structured source to add or improve a role, project,
   achievement, or interest, with tags.
2. The site reflects it everywhere it is used. To target a specific leadership
   role, the owner selects the relevant tagged subset, on-site (a pre-built
   variant) or offline (a tailored document).

**UX considerations**:
- The CV stays short and scannable; projects index carries breadth; case studies
  carry depth. Consistent design system across all of it.
- Mobile-first, WCAG AA in both themes, descriptive link text, print-friendly CV.
- Targeted variants, when added, are deliberately shared alternates; the default
  full CV is the canonical link.

**Onboarding & discoverability**: None in-product. The owner shares the frontpage
or the full CV URL. Each page presents clean metadata.

## High-Level Technical Constraints

- **Static and near-zero-JS**: No runtime CV builder, tag filtering, or query UI.
  Targeting is done by selecting tags at build time (pre-built pages) or by the
  owner offline.
- **Leadership identity**: Every presentation is a leadership CV; the default
  `/cv` is canonical.
- **Privacy / anti-spam**: No contact details; outbound profile links only.
- **Quality bar**: Mobile-first, WCAG AA in both themes, Lighthouse performance
  and accessibility at the project bar; the print-friendly CV is preserved.
- **Content ownership & truth**: All content derives from the owner's material;
  real figures only; no invented metrics.

(Tag vocabulary, metadata fields, and routing are deferred to the TechSpec.)

## Non-Goals (Out of Scope)

- **No interactive CV builder**: no visitor- or owner-facing tag picker, no
  runtime/client-side filtering, no on-the-fly CV generation. The "database" is a
  structured content source, not an app.
- **No auto-export / document-generation pipeline**: offline per-job tailoring is
  enabled by the structured source, not built here. The owner (or an assistant)
  selects the subset by hand.
- **No bulk import of the roughly fifteen further projects this round**: the
  structure is built and the existing content deepened now; the owner adds further
  projects over time, writing each as he goes.
- **No multi-track identity**: leadership only. No consulting, product, or program
  career identities on the site.
- **No contact form or contact details.**
- **No blog/CMS, analytics, or visitor tracking.**

## Phased Rollout Plan

### MVP (Phase 1) - Structured source and deepened content

- Features 1-5: the tagged content source, the consistent case-study template
  applied to the existing studies, the two-tier projects with a live projects
  index, deepened existing text, and the interests section.
- **Success criteria to proceed**: the tagging metadata is defined and populated
  for all current content; the existing copy is deepened to the new bar and passes
  the voice rules; AXON and DFDS use the standard template; the projects index is
  live and grouped by company; the interests section is live; no contact details;
  Lighthouse and AA bars hold.

### Phase 2 - Targeted leadership variants

- Feature 6: a small set of pre-built static variant pages, each a theme-led
  leadership CV, plus validation that they earn their keep.
- **Success criteria**: variants build statically from tags with no runtime JS;
  the default `/cv` remains canonical; variants are consistent with the source and
  pass the quality bar.

### Phase 3 - Growth (ongoing, owner-driven)

- The owner adds the further projects and achievements over time and assembles
  offline per-job tailored CVs from the structured source.
- **Long-term success**: the source stays current; targeted CVs are a selection,
  not a rewrite.

## Success Metrics

(MVP metrics are about the source and existing content, not the Phase 2 variants.)

- Every current role, project, achievement, skill, and interest carries its
  tagging metadata.
- The existing copy (hero, summary, role bullets, AXON, DFDS) is deepened to the
  new bar and conforms to the voice rules (no em dashes; none of the listed AI
  tells).
- AXON and DFDS render with the standard case-study template (metrics strip plus
  Context, what I did, Outcome).
- The projects index is live, grouped by company, with every project present as at
  least a one-line entry; featured projects link to deep pages.
- The interests section is live and tagged.
- Lighthouse performance and accessibility hold the project bar in both themes;
  WCAG AA holds; the CV stays scannable and print-friendly.

## Risks and Mitigations

- **Scope creep toward a builder app** (the "database" word). Mitigation: Non-Goals
  forbid runtime filtering, query UI, and auto-export; on-site targeting is
  pre-built static pages only.
- **Targeted variants dilute or compete** with the canonical CV, or create
  duplicate-content/SEO and maintenance cost. Mitigation: keep variants few and
  deliberate; default `/cv` is canonical; Phase 2 with an explicit value check
  first.
- **Thin project stubs** make the index read as unfinished. Mitigation: index
  entries require at least a one-line description; bare titles are not published.
- **Generated copy reads as AI-written**. Mitigation: the voice rules are an
  explicit acceptance gate on every piece of copy.
- **Owner content gaps** (about eleven projects are title-only; some metrics
  missing). Mitigation: deepen what exists now; the owner fills the rest over time;
  gaps tracked in Open Questions.

## Architecture Decision Records

- [ADR-001: Structured, tagged content source for leadership CVs](adrs/adr-001.md)
  - One tagged source of truth feeds the public site, pre-built targeted
  leadership variants, and offline tailoring; amends cv-content ADR-002 while
  keeping the default `/cv` canonical.
- [ADR-002: Two-tier project model](adrs/adr-002.md) - A few featured deep case
  studies plus a projects index grouped by company, scaling to roughly twenty
  projects without bloating the CV.

## Open Questions

- **Do the on-site targeted variants earn their keep?** Does a recruiter ever see
  more than one, and do near-identical `/cv` variants create duplicate-content/SEO
  or maintenance cost worth the value? Validate before building Phase 2.
- **Which projects are featured?** Confirm the featured set (candidates: DFDS
  500+ microservices, Ørsted PowerHub / Virtual Power Plant, Ørsted DMS, AXON data
  platform).
- **Title-only projects**: about eleven projects from `projekts.html` have no
  narrative. The owner needs to write Context / what I did / Outcome for each
  before it can become featured; until then they live as index entries.
- **Theme tag vocabulary**: confirm the set of themes used for tagging and for the
  Phase 2 variants.
- **Missing metrics**: some projects (Scrive SLA/cost, AXON adoption) lack figures;
  use only what exists.
