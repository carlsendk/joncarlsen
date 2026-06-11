# PRD: CV Content & Supporting Features

## Overview

Replace the placeholder content on the personal CV site with the owner's real
career material, and add the site capabilities needed to hold it well. The
existing site (`cv-site`, `cv-visual-design`) is a single page with four
sections carrying dummy text ("Your Name", "Company A/B", "5 -> 30"). All the
real content already exists in `docs/Content/_base/` (master CV, leadership
narrative, about-me).

- **Problem it solves**: The site looks finished but says nothing real. A
  recruiter who opens it today learns nothing about the owner. At the same time,
  the owner's actual career is too rich for the current four sections, and the
  owner wants room to add more depth over time.
- **Who it is for**: Recruiters and hiring managers evaluating the owner for
  senior engineering-leadership roles, who scan in seconds (usually on mobile)
  and decide whether to dig deeper. Secondary: the owner, who maintains it.
- **Why it is valuable**: It turns a credible-looking shell into a credible
  page the owner can confidently paste into applications and on LinkedIn, with
  a fast frontpage for the scan and a deeper full CV for serious evaluation.

## Goals

- A recruiter grasps who the owner is and the level he operates at within the
  first screen of the frontpage (target: name, leadership identity, and at least
  one quantified proof point above the fold).
- A recruiter who wants more can reach the complete CV in one click, and drill
  into a specific project for depth.
- Every public claim is real, specific, and quantified where a number exists
  (team/org size, scale figures, certifications), with zero placeholder text
  remaining.
- All public copy reads as written by the owner, not by an AI (see the writing
  voice requirement in Core Features).
- The owner can add a new project deep-dive over time without a redesign.
- Preserve the inherited bar: no contact details, mobile-first, fast load,
  WCAG AA, strong Lighthouse scores in both themes.

## User Stories

**Primary persona - Recruiter / Hiring manager**
- As a recruiter, I want the frontpage to tell me the candidate's leadership
  level and headline impact in seconds, so I can decide fast whether to read on.
- As a recruiter, I want to open the full CV from the frontpage in one click,
  so I can evaluate the complete career history when the candidate looks
  relevant.
- As a recruiter, I want each role to show quantified achievements rather than
  duties, so I can judge real impact.
- As a recruiter evaluating depth, I want to drill into a specific project to
  see the situation, what the candidate did, and the outcome.
- As a recruiter, I want to reach the candidate's trusted profiles (LinkedIn,
  GitHub, writing), so I can follow up and verify.

**Secondary persona - The owner (content maintainer)**
- As the owner, I want all content to come from my existing material in
  `docs/Content/`, so the site matches my master CV.
- As the owner, I want one place to edit shared facts, so the frontpage and full
  CV never disagree.
- As the owner, I want to add a new project write-up over time without touching
  the layout, so the site's depth can grow with my work.

## Core Features

Grouped by priority. Features 1-4 are MVP; 5-8 are the agreed extras (Phase 2).

1. **Real frontpage content (the scan)** (must-have)
   - Hero with the owner's real name, a single leadership identity (engineering
     leader: GenAI + real-time data + platform engineering at scale), and a
     one-line value proposition.
   - A small set of quantified highlights drawn from the strongest real numbers
     (e.g. ~50,000 datapoints/sec/device at AXON; scaled a department 3 -> 20;
     500+ microservices on Kubernetes; ISO 27001 and ISAE 3000).
   - Areas of expertise as a scannable block.
   - A condensed list of recent roles (company, title, dates, one line of scope).
   - Outbound links and one clear path to the full CV.

2. **Full CV page (deep evaluation)** (must-have)
   - A single, complete CV reachable in one click from the frontpage and
     shareable as its own URL.
   - Carries the full real content: a short professional summary; complete
     career history (every role with its achievement bullets, newest first,
     including earlier roles); areas of expertise; education; certifications,
     networks and associations; publications and honours.
   - Includes a compact personal-details line (date of birth, nationality,
     marital status) consistent with Danish CV norms and the owner's existing
     CV; placed only on the full CV, not the frontpage.

3. **Project deep-dive capability** (must-have, structural)
   - A visitor can open a dedicated page for a specific project to read its full
     story (context, what the owner did, measurable outcome).
   - The owner can add a new project deep-dive over time without changing the
     site layout. Project pages are linked from the full CV and, where relevant,
     the frontpage.
   - (At least one real project ships in MVP so the capability is exercised; see
     Feature 6 for the seeded set.)

4. **Authentic writing voice** (must-have, content constraint)
   - All public copy must read as written by the owner, in plain human language.
   - Hard rules from `about-me.md`: no em dashes; avoid stock AI phrasing
     ("furthermore", "moreover", "in today's fast-paced world"); avoid parallel
     triads, "it's not X, it's Y" constructions, buzzword stacking, and
     over-polished symmetry. Vary sentence length. Prefer concrete facts over
     adjectives.
   - This applies to every piece of generated copy and is an acceptance
     criterion, not a style preference.

5. **About / leadership narrative** (Phase 2 extra)
   - A short prose section in the owner's voice (philosophy, the "why me" story,
     the maturity-stage arc), sourced from `leadership-narrative.md`. Sits
     between hero and experience to add a human layer. Subject to Feature 4.

6. **Seeded project case studies** (Phase 2 extra)
   - Two real deep-dives written at launch: the AXON AI platform on real-time
     telemetry, and the DFDS 3 -> 20 / 500+ microservices transformation, so the
     project capability is populated rather than empty.

7. **Talks & writing** (Phase 2 extra)
   - A thought-leadership section linking the owner's tech-leadership knowledge
     base and notable talks (e.g. Microsoft TechEd Barcelona, SmartGrid/CIM user
     groups). A genuine differentiator per the owner's own guide.

8. **Professional photo** (Phase 2 extra)
   - A headshot on the frontpage (optional under Danish norms), with the full CV
     kept clean and parseable. Depends on the owner supplying a photo file (see
     Open Questions).

**Feature interaction**: The frontpage hooks and routes; the full CV satisfies
deep evaluation; project deep-dives provide proof; links route to trusted
external profiles. Shared facts come from one owner-edited source so the tiers
never disagree.

## User Experience

**Key persona & goal**: A recruiter wants to qualify a senior engineering leader
in under a minute, then dig in if interested.

**Primary flow**:
1. Recruiter opens the frontpage URL (from an application or LinkedIn), usually
   on mobile.
2. The hero conveys name, leadership identity, and value proposition; a
   highlight or two gives immediate proof.
3. They skim expertise and the condensed recent roles.
4. If interested, they click through to the full CV and read the complete
   history, education, certifications, and publications.
5. If they want depth on a specific achievement, they open a project deep-dive.
6. They follow an outbound link (LinkedIn / GitHub / writing) to verify and
   follow up.

**UX considerations**:
- Frontpage stays short and scannable; the full CV is a longer, well-structured,
  anchored read; project pages are focused single-topic reads.
- Mobile-first; fast load is a first-class requirement on every page.
- Clear visual hierarchy; impact figures lead. Consistent design/token system
  across all pages (reuse `cv-visual-design`).
- Accessibility: semantic structure, AA contrast in both themes, keyboard and
  screen-reader friendly, descriptive link text.
- The full CV should be print-friendly so a recruiter can save it as a PDF from
  the browser, giving a downloadable artifact without a separate PDF feature.

**Onboarding & discoverability**: No in-product onboarding. Discovery is
external; the owner shares the frontpage and/or full-CV URL. Each page presents
clean metadata so a shared link looks credible.

## High-Level Technical Constraints

- **Privacy / anti-spam**: No contact form and no exposed contact details (no
  email, no phone), preserved from `cv-site` ADR-002, even though the source
  material in `docs/Content/` contains them. LinkedIn is the contact route.
- **Performance (user-perceived)**: Each page usable within ~1 second; do not
  risk the 3-second mobile abandonment threshold.
- **Mobile-first**: Reads and performs well on phones.
- **Accessibility & quality bar**: WCAG AA in both themes; maintain the existing
  Lighthouse targets (performance and accessibility) the project already holds.
- **Content ownership & truth**: All public content derives from the owner's
  material in `docs/Content/`; the owner controls and can update it; no
  invented facts or figures.

(Routing, content modelling, and architecture are deferred to the TechSpec.)

## Non-Goals (Out of Scope)

- The offline job-application tailoring workflow (`docs/Content/` job folders,
  per-role tailored CVs and cover letters) stays offline; the site does not
  generate or host it.
- Multi-track public positioning (consulting / product / program). The public
  site is single-identity leadership only (ADR-002); track tailoring stays in
  the offline documents.
- No contact form and no contact details on the site.
- No PDF-generation feature or hosted PDF download. The print-friendly full CV
  covers the "save as PDF" need.
- No blog/CMS, no analytics or visitor tracking, no interactive widgets beyond
  the existing theme toggle.

## Phased Rollout Plan

### MVP (Phase 1) - Real content live

- Features 1-4: real frontpage content, the full CV page, the project deep-dive
  capability (with at least one real project so it is exercised), and the
  authentic-voice constraint applied to all copy.
- All placeholder text removed; site reflects the owner's real career.
- **Success criteria to proceed**: frontpage and full CV carry only real,
  verified content; one project deep-dive is live; no contact details present;
  Lighthouse and AA bars hold in both themes; copy passes the voice rules.

### Phase 2 - Agreed extras

- Features 5-8: about/leadership narrative, the second seeded case study, the
  talks & writing section, and the professional photo (once supplied).
- **Success criteria**: extras live and consistent with the design system; photo
  present without harming load or the full CV's clean parse; narrative and case
  studies pass the voice rules.

### Phase 3 - Growth (ongoing, owner-driven)

- Owner adds further project deep-dives and missing figures over time.
- **Long-term success**: the site stays current and accurate throughout the job
  hunt with low maintenance effort.

## Success Metrics

- Zero placeholder strings remain anywhere on the site.
- Above-the-fold frontpage conveys identity + at least one quantified proof
  point.
- Full CV reachable from the frontpage in one click; at least one project
  deep-dive reachable from the full CV.
- Lighthouse performance and accessibility scores stay at or above the project's
  current bar in both light and dark themes.
- WCAG AA contrast holds in both themes on all pages.
- All copy conforms to the writing-voice rules (no em dashes; none of the listed
  AI tells).
- The owner can add a new project deep-dive by editing content only, with no
  layout change.

## Risks and Mitigations

- **Content dilutes the scan**: piling the full CV onto the frontpage would kill
  the 7-8s scan. Mitigation: the hub-and-spoke split (ADR-001) keeps the
  frontpage short.
- **Generated copy reads as AI-written**, undermining credibility with senior
  readers. Mitigation: the voice rules are an explicit acceptance criterion
  checked per piece of copy.
- **Stale or contradictory content** between tiers. Mitigation: single
  owner-edited content source for shared facts.
- **Owner-supplied assets missing** (photo, some figures) could stall the build.
  Mitigation: phase the extras; ship MVP on existing material; track gaps in
  Open Questions.
- **Identity feels too narrow** for non-leadership roles. Mitigation: track
  tailoring lives in the offline documents (ADR-002); the site stays the
  credible leadership anchor.

## Architecture Decision Records

- [ADR-001: Hub-and-spoke information architecture](adrs/adr-001.md) - Short
  frontpage + full CV page + a growable project deep-dive layer, all static and
  link-navigated, instead of one heavy page or a PDF.
- [ADR-002: Single public leadership identity](adrs/adr-002.md) - The public
  site presents one leadership identity; multi-track tailoring stays offline.

## Open Questions

- **Headshot asset**: No photo file exists in `docs/` yet (only company logos).
  The owner must supply a headshot before Feature 8 (photo) can ship.
- **Missing figures**: The owner's notes flag missing numbers (e.g. the Scrive
  SLA improvement and cost reduction). Use only figures that exist; the owner
  can add these later. Which, if any, are available now?
- **Knowledge-base link exposure**: Confirm the tech-leadership site
  (carlsendk.github.io/tech-leadership) should be a public outbound link on the
  site.
- **Contact route**: Confirmed assumption is no email/phone, LinkedIn as the
  only contact route. Flagged for explicit owner confirmation since the source
  CV does list email and phone.
- **Second theme/identity tweaks**: none expected, but confirm the single-line
  value proposition wording with the owner before launch.
