# PRD: CTO-Altitude CV Positioning

## Overview

Re-pitch the canonical public CV so it reads as CTO-ready, enriched from the
owner's own source documents. The site today (frontpage, /cv, /projects) is
strong but reads at Director-of-Engineering altitude: technical activity rather
than executive scope and business outcome. The owner is targeting CTO and senior
engineering-leadership roles and already has the raw material for that level (a
CTO-framed CV, a documented CTO/CTPO positioning angle, investor-pitch and
advisory-board signals, a published leadership framework, a business degree). This
feature mines that material, raises the altitude of the existing content, and
surfaces the executive signals a CTO reader expects.

- **Problem it solves**: A capable executive leader is being presented one level
  too low. The writing leads with what teams built, not with the scope he owned
  and the business outcomes he drove, so a board or executive recruiter does not
  immediately read "CTO".
- **Who it is for**: Primary, executive recruiters, hiring committees, and boards
  evaluating the owner for CTO, CTPO, and VP Engineering roles. Secondary, the
  owner, who maintains the content and needs to know what to supply to reach full
  CTO-grade impact.
- **Why it is valuable**: The substance is already there. Recast at the right
  altitude and enriched with real signals from his documents, the same career
  reads as credible at CTO level, and the remaining high-value gaps become an
  actionable list rather than a vague worry.

## Goals

- Recast the CV spine to CTO altitude: an executive summary and a clear scope
  line, impact framed as business outcomes, role bullets in ownership and outcome
  language.
- Surface the CTO signals already in the owner's material: full CTO remit at
  eSignatur, investor pitch deck at Lunar, Heeplink advisory board, Scalers
  CTO/CPO network, business degree, and the AI strategy and architecture at AXON.
- Add a leadership-approach / technology-vision section that gives a CTO reader
  the vision and operating-model signal that is usually missing.
- Add a prominent CTO credentials grouping and feature the published
  thought-leadership writing as external-brand evidence.
- Add a few more strategic projects from the owner's documented project history.
- Produce a single checklist of high-value information the owner should supply
  (budget, cost savings, SLA figures, board cadence), with source-side
  placeholders, without inventing anything or blocking the re-pitch.
- Hold the existing bar: one canonical leadership identity, no contact details,
  static and near-zero-JS, mobile-first, WCAG AA, strong Lighthouse, the voice
  rules.

## User Stories

**Primary persona - Executive recruiter / hiring committee / board**
- As an executive recruiter, I want to read the scope and business outcomes in the
  first few seconds, so I can place the candidate at CTO level without digging.
- As a board member, I want to see technology vision and strategy, not just
  delivery, so I trust this person to own technology direction.
- As a hiring committee, I want concrete, quantified ownership (org size,
  transformation scale, remit), so the title is backed by demonstrated scope.

**Secondary persona - The owner (content maintainer)**
- As the owner, I want my real CTO signals surfaced from my documents, so my CV
  reflects what I have actually done.
- As the owner, I want a clear list of the figures I still need to supply, so I
  can raise the CV to full CTO-grade when I have them.
- As the owner, I want nothing invented and no placeholder text shown publicly, so
  the CV stays truthful and polished.

## Core Features

Grouped by priority. All are MVP for this feature (Approach A, one pass).

1. **CTO-altitude CV spine** (must-have)
   - An executive summary that leads with technology-executive positioning, and a
     hard scope line (org size, transformation reach, remit owned).
   - Impact recast as business outcomes; role bullets rewritten in ownership and
     outcome language (what was owned and what changed, not what was done).

2. **Surfaced CTO signals** (must-have)
   - The CTO-specific facts already in the owner's material made visible: full CTO
     remit at eSignatur (roadmap, security, compliance, cloud strategy, vendor
     management), Lunar investor pitch deck, Heeplink advisory board, AI function
     and architecture at AXON, the 200+ person Vitruvian-backed context at Scrive,
     the 5 to 25 and 3 to 20 scaling, and the DFDS Horizon selection.

3. **Leadership approach / technology-vision section** (must-have)
   - A short section in the owner's voice: how he leads (purpose, mastery,
     autonomy), building the technology roadmap from business strategy, the
     maturity-stages operating model, and the AI direction. Fills the vision
     signal CTO readers look for.

4. **CTO credentials block and thought-leadership feature** (must-have)
   - A grouped, scannable presentation of executive credentials, and a feature of
     the published tech-leadership writing as external-brand evidence.

5. **More strategic projects** (should-have)
   - A few additional projects from the owner's documented history (for example
     eID consolidation, DFDS.com, DFDS Way, SCRUM transformation), added through
     the existing projects structure, real content only.

6. **Information-to-supply checklist with source placeholders** (must-have)
   - A single checklist of high-value missing items (budget owned, cloud-cost
     reduction, SLA before/after, board/investor cadence, hiring velocity,
     retention), each tied to where it would strengthen the CV. Placeholders live
     in the editable source or the checklist only, never as published text.

**Feature interaction**: All content is drawn from the one structured source and
the owner's documents. The re-pitched spine, the vision section, the credentials
block, and the projects all reinforce a single CTO-ready leadership identity. The
checklist is the bridge from "enriched with what is true today" to "full
CTO-grade when the owner supplies the figures".

## User Experience

**Key persona & goal**: An executive recruiter or board member wants to confirm
CTO-level scope, business impact, and technology vision in the first scan, then
verify depth on demand.

**Primary flow**:
1. Reader lands on the frontpage or /cv and reads the executive summary and scope
   line: who he is at executive level and the scope he has owned.
2. They scan impact framed as business outcomes, the leadership-approach section,
   and the CTO credentials.
3. They open a project or the projects index for depth, or follow the writing link
   for external-brand evidence.

**Owner flow**:
1. Owner reviews the enriched CV, all sourced from his documents.
2. He works the information-to-supply checklist, dropping real figures into the
   marked source placeholders to raise the CV to full CTO-grade over time.

**UX considerations**:
- Executive summary and scope line are front-loaded and scannable; the site stays
  mobile-first and fast.
- One canonical CTO-ready identity; consistent design system; print-friendly CV
  preserved.
- No contact details; outbound profile and writing links only.

**Onboarding & discoverability**: None in-product. The owner shares the frontpage
or /cv URL.

## High-Level Technical Constraints

- **Builds on the existing site and structured source**: no new architecture; the
  frontpage, /cv, /projects, and the tagged content model are reused.
- **One canonical leadership identity**: CTO-ready; no separate public variant in
  this feature.
- **Truth and privacy**: real content only, no invented figures, no contact
  details on the site (source docs contain email and phone; excluded).
- **Quality bar**: mobile-first, WCAG AA both themes, Lighthouse at the project
  bar, print-friendly CV, and the voice rules (no em dashes, no AI tells).

## Non-Goals (Out of Scope)

- **No invented or estimated figures**: missing financials are tracked in the
  checklist, not fabricated.
- **No placeholder text on the live site**: placeholders exist only in the
  editable source or the checklist.
- **No contact details**: no email, phone, or contact form, even though the source
  documents contain them.
- **No separate CTO variant page** in this feature: the canonical CV is re-pitched
  in place. A targeted variant remains the deferred Phase-2 idea from
  cv-content-improve.
- **No multi-track identity**: leadership / CTO only; not consulting, product, or
  program tracks on the site.
- **No offline document generation pipeline**: the existing CTO CV PDF is a
  reference input, not a build target.
- **No bulk import of all remaining projects**: only a few strategic additions.

## Phased Rollout Plan

### MVP (single pass, Approach A)

- Features 1 to 6: the CTO-altitude spine, surfaced CTO signals, the
  leadership-vision section, the credentials block and writing feature, a few more
  strategic projects, and the information-to-supply checklist with source
  placeholders.
- **Success criteria**: /cv and the frontpage lead with an executive summary and
  scope line; impact and bullets read as business outcomes; the vision section,
  credentials block, and writing feature are live; the added projects are present;
  the checklist exists; no invented figures, no placeholder text on live pages, no
  contact details; the quality bar holds.

### Follow-up (owner-driven, ongoing)

- The owner supplies the checklist figures; each real number replaces its
  placeholder and sharpens the CV. Optionally, a dedicated CTO variant page
  (cv-content-improve Phase 2) can follow once the canonical re-pitch is proven.

## Success Metrics

- The executive summary and a hard scope line appear at the top of the CV.
- Impact entries and role bullets are framed as business outcomes and ownership,
  not technical activity, and pass the voice rules.
- The real CTO signals from the owner's documents are surfaced (eSignatur remit,
  investor pitch deck, advisory board, AI strategy, scaling figures, Horizon).
- The leadership-approach / vision section, CTO credentials block, and
  thought-leadership feature are live.
- A few additional strategic projects are present, sourced from real material.
- The information-to-supply checklist exists and is specific and prioritised.
- No invented figures; no placeholder text on live pages; no contact details;
  Lighthouse and AA bars hold in both themes.

## Risks and Mitigations

- **Over-claiming at CTO altitude without hard numbers**. Mitigation: truth-first
  enrichment (ADR-002); gaps go to the checklist; nothing invented.
- **Copy drifts into executive buzzwords or AI-tell phrasing**. Mitigation: the
  voice rules are an acceptance gate on every block.
- **Placeholders leak to the published site**. Mitigation: placeholders only in
  the editable source or checklist; the existing no-placeholder content gate.
- **Contact details leak from the source documents**. Mitigation: explicit
  exclusion; the existing contact-leak content gate.
- **Identity dilution between CTO and VP framing**. Mitigation: one canonical
  CTO-ready leadership identity; the dual-track hedging in the owner's notes stays
  offline.

## Architecture Decision Records

- [ADR-001: Re-pitch the canonical CV to CTO altitude in one pass](adrs/adr-001.md)
  - Enrich from the owner's documents and recast the existing site to executive
  altitude with the four selected additions, as a single content feature.
- [ADR-002: Truth-first enrichment with a supply-list and source placeholders](adrs/adr-002.md)
  - Enrich from real content only, surface high-value gaps as a checklist with
  source-side placeholders, invent nothing, and keep contact details off the site.

## Open Questions

- **Which figures can the owner supply, and when?** Budget owned, cloud-cost
  reduction, SLA before/after at Scrive, board/investor cadence, hiring velocity,
  retention. These drive how quickly the CV reaches full CTO-grade.
- **Which additional projects to include?** Confirm the strategic set from the
  project history (candidates: eID consolidation, DFDS.com, DFDS Way, SCRUM
  transformation).
- **How prominent should the executive summary be** relative to the current hero,
  on both the frontpage and /cv? (Resolved at design time within the voice and
  scan constraints.)
- **CTO vs CTPO emphasis**: lead purely as CTO, or keep a light CTPO / product-tech
  alignment note given the CSPO and product-owner background?
