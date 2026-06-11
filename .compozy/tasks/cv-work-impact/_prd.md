# PRD: Work & Impact — connecting projects, achievements, and companies

## Overview

The site presents the owner's career across a home page, a full `/cv`, a project
index, and per-project case studies. Today three things sit side by side but
disconnected: the **company role blocks** (a description plus achievement
bullets), the **project case studies** (which carry metrics), and a separately
authored **impact highlights** list. A reader who sees an impressive number
cannot click through to the project that produced it, and the word "projects"
undersells leadership achievements such as building an organisation or running a
transformation.

This feature unifies the model around a single insight surfaced in
brainstorming: **impact is attached to a project, and that impact *is* the
achievement.** There is no separate "achievements" entity — an achievement is a
project's measurable outcome, surfaced. The connective unit is the **company
role bullet**, which simultaneously states an achievement, carries its impact
number, and deep-links to the work case study that tells the full story.

From that one spine the site gains a renamed **Work** umbrella (projects +
achievements), a new auto-aggregated **Impact** page (every metric-bearing
bullet, each clickable to its source project), and a home page where impact
numbers and bullets are clickable entry points to learn more.

It is for the site's readers — recruiters, hiring managers, and prospective
clients evaluating a senior technology leader — who want to move quickly from "an
impressive outcome" to "the story behind it." It is valuable because it turns a
flat list of facts into a navigable, evidence-backed track record without
authoring anything twice.

## Goals

- Let a reader move from any impact number or achievement bullet to the project
  that produced it in one click, from the home page, `/cv`, and `/impact`.
- Replace the "Projects" umbrella with "Work" so leadership achievements read at
  the right altitude.
- Surface every notable project impact as an achievement on a single scannable
  **Impact** page, auto-aggregated from the work — no second authoring step.
- Establish the company role bullet as the single source for achievement text,
  impact number, and work link, eliminating duplicate impact content.
- Ship the core impact-to-project loop first; stage the heavier company-page
  surface and theme filtering behind it.

## User Stories

**Primary persona — Recruiter / hiring manager (time-pressed evaluator)**

- As a recruiter scanning the home page, I want to click an impact number so that
  I can immediately read the project behind it and judge whether it is real and
  relevant.
- As a hiring manager reading the full CV, I want each company's bullets to link
  to the detailed work so that I can verify scope and attribution without leaving
  my flow.
- As an evaluator short on time, I want a single Impact page of the strongest
  outcomes so that I can size up the candidate in 30 seconds and dive into any
  one.

**Secondary persona — Prospective client / advisor lead**

- As a prospective client, I want to see outcomes grouped by where they happened
  so that I can assess relevance to my situation.

**Owner persona — Site owner maintaining content**

- As the owner, I want to write each achievement once (as a bullet with its
  number and a link) so that it appears correctly on the home page, `/cv`, and
  `/impact` without duplication.
- As the owner, I want adding a metric to a project to automatically surface it
  on the Impact page so that I never maintain a parallel list.

## Core Features

Grouped by priority. Wave 1 is the MVP.

**1. The connective bullet (Wave 1, foundational)**
Each company role bullet becomes the single connective unit: achievement text, an
optional impact number, and an optional link to a work case study. Bullets with a
backing case study link out; metric-only or plain bullets do not. This one
authored unit powers every surface below.

**2. "Work" umbrella (Wave 1)**
Rename the "Projects" surface to "Work" as the umbrella over projects and
achievements. Preserve reader expectations with an alias/redirect from the old
path. Each work item remains a case study reachable at its own URL.

**3. Auto-aggregated Impact page (Wave 1)**
A new `/impact` page lists every metric-bearing bullet across all companies, each
as an achievement line linking to its source project. Derived ordering and
grouping (by company/theme/existing order) — no hand-curated list. Adding a
project metric automatically adds an Impact line.

**4. Clickable impact on the home page (Wave 1)**
On the home page, impact numbers and achievement bullets are clickable entry
points that lead to the relevant work case study — one consistent "learn more"
destination.

**5. Company role block as the company surface (Wave 1)**
Each role block carries a short company/role description plus its linked bullets,
authored once and reused on home, `/cv`, and `/impact`. This is the company
surface for the MVP.

**6. Dedicated company page (Wave 2, optional)**
An optional `/company/<slug>` page aggregates a company's role(s), the work done
there, and its impacts, reusing the same bullets. Added only for companies with
enough work to justify a dedicated narrative.

**7. Theme/topic filtering (Wave 3)**
Filter Work and Impact by theme (e.g. AI/LLM, platform/dev-ex, org-scaling) so a
reader can narrow to relevant outcomes.

## User Experience

**Reader journey**

1. Lands on the home page and scans a tight set of headline impact numbers and
   role bullets.
2. Clicks an impact number or a bullet → arrives at the work case study with the
   full Context → What I did → Outcome story and its metrics.
3. Optionally opens `/impact` to see the full cross-cut of achievements, each a
   clickable line; or opens `/cv` to read companies in timeline order with the
   same linked bullets.
4. (Wave 2) Follows a company to its `/company/<slug>` page to see everything
   done there in one place.

**Owner journey**

1. Adds or edits a project case study and its metrics.
2. Writes/edits the company role bullets — each with text, an optional number,
   and an optional link to the case study.
3. The home page, `/cv`, and `/impact` reflect the change on the next build; no
   parallel impact list to update.

**UI/UX considerations**

- Clickable numbers/bullets must be visibly interactive and keyboard-accessible;
  non-linking bullets must not look broken.
- Keep `/cv` readable — link only bullets that have a real destination; avoid
  link clutter.
- Labels must use "Work" and "Impact" consistently, treating "impact" and
  "achievement" as the same idea for the reader.
- Maintain the existing print-friendly `/cv` behavior.

## High-Level Technical Constraints

- The site is static with near-zero JavaScript; all linking, aggregation,
  ordering, and grouping must resolve at build time, not at runtime.
- Reuse the existing single content source and case-study collection; do not
  introduce a runtime database or query layer.
- Preserve existing reader-facing performance and the print-friendly `/cv`.
- Maintain backward-compatible URLs (alias/redirect the old projects path).

## Non-Goals (Out of Scope)

- No separate "achievements" content type — an achievement is a project's impact.
- No hand-curated, hand-ordered impact list (the page is derived; see ADR-002).
- No runtime filtering, search, or personalization in Wave 1.
- No required dedicated company pages in the MVP (optional, Wave 2).
- No new visual redesign beyond what these surfaces require (visual system is
  owned by cv-visual-design).
- No CMS or authoring UI; content stays in the existing source files.

## Phased Rollout Plan

### MVP (Phase 1 / Wave 1)

- The connective bullet (text + optional number + optional work link).
- "Work" umbrella with alias/redirect from the old projects path.
- Auto-aggregated `/impact` page, each line linking to its project.
- Clickable impact numbers/bullets on the home page.
- Company role block (description + linked bullets) as the company surface.
- Migrate existing standalone impact entries onto their source projects.
- **Success criteria to proceed**: every home-page impact number and CV bullet
  with a backing case study links correctly; `/impact` is fully derived with no
  standalone list remaining; owner confirms single-source authoring works.

### Phase 2 (Wave 2)

- Optional `/company/<slug>` pages reusing the same bullets, for companies with
  enough work to warrant a dedicated narrative.
- **Success criteria to proceed**: at least one company page in use and reading
  well; no content duplicated between the role block and the company page.

### Phase 3 (Wave 3)

- Theme/topic filtering across Work and Impact.
- **Long-term success**: readers can narrow to a theme and still traverse from
  impact → project seamlessly.

## Success Metrics

- **Traversal coverage**: 100% of metric-bearing bullets with a backing case
  study link to it; 0 dead or duplicated impact entries after migration.
- **Single-source authoring**: an impact number is authored exactly once and
  appears on home, `/cv`, and `/impact` (owner-verified).
- **Scan-to-depth**: a reader can reach any project's full story from a home-page
  number in one click.
- **Coverage of impacts**: every notable project metric appears on `/impact`.
- **Engagement (qualitative)**: readers report they could quickly verify an
  outcome's story and attribution.

## Risks and Mitigations

- **Naming confusion** — readers expect "Projects". *Mitigation*: alias/redirect
  the old path; use "Work"/"Impact" labels consistently.
- **Diluted Impact page** — weak or vanity metrics crowd the derived list.
  *Mitigation*: authoring discipline — 1–3 strong, business-outcome metrics per
  project; derived grouping/ordering keeps it scannable.
- **Link clutter on `/cv`** — too many linked bullets reduce readability.
  *Mitigation*: only bullets with a real destination link out.
- **Scope creep on company pages** — "both surfaces" tempts building heavy pages
  early. *Mitigation*: company pages are optional Wave 2; the role block is the
  MVP company surface.
- **Migration gaps** — moving the standalone impact list onto projects could drop
  or duplicate entries. *Mitigation*: explicit migration step with a
  before/after check that every prior highlight maps to a project metric.

## Architecture Decision Records

- [ADR-001: "Work" + "Impact" naming with the bullet as the connective unit](adrs/adr-001.md) — Adopt "Work"/"Impact" and make the company role bullet the single unit carrying achievement, impact number, and work link.
- [ADR-002: The Impact page is auto-aggregated from work, not separately curated](adrs/adr-002.md) — Derive `/impact` from project metrics; retire the standalone impact list as the source of truth.

## Open Questions

- Should the old `/projects` path 301-redirect to `/work`, or keep both as
  aliases during a transition window?
- On `/impact`, what is the default grouping/ordering — by company, by theme, or
  by the existing `order` field?
- Should plain bullets with no metric and no case study still appear on `/cv`
  (context-setting), and should they be visually distinct from linked ones?
- For Wave 2, what threshold of work justifies a dedicated `/company/<slug>` page
  versus relying on the role block?
- Does a metric ever belong to more than one project, and if so how should it be
  attributed on `/impact`?
