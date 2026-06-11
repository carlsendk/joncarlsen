# PRD: Personal CV Site

## Overview

A personal CV website for a leadership/management professional whose primary
purpose is **job hunting**. It exists to give recruiters and hiring managers a
fast, credible picture of the owner's career and impact, then route them to the
owner's established professional profiles.

- **Problem it solves**: There is no single, owner-controlled page that presents
  the owner's leadership track record clearly and links out to vetted profiles.
  LinkedIn alone offers no design control and competes for attention.
- **Who it is for**: Recruiters and hiring managers evaluating the owner for
  leadership/management roles. They scan quickly, often on mobile, and decide in
  seconds whether to dig deeper.
- **Why it is valuable**: It strengthens the owner's job hunt with a fast,
  scannable, professional presence that the owner can confidently include in
  applications — without exposing contact details or creating a spam surface.

## Goals

- Present the owner's leadership experience and quantified impact so a recruiter
  grasps the value proposition within the first scroll.
- Provide an unambiguous path to the owner's existing professional profiles
  (GitHub, LinkedIn, other sites).
- Be a link the owner is proud to put in applications and on LinkedIn.
- Load fast and read well on mobile, where most visits originate.
- Avoid any spam surface: no contact form, no exposed contact details.

## User Stories

**Primary persona — Recruiter / Hiring manager**
- As a recruiter, I want to understand the candidate's current role and value in
  the first few seconds, so I can decide quickly if they fit.
- As a recruiter, I want to see roles, companies, dates, and the scope of teams
  led, so I can gauge seniority and trajectory.
- As a recruiter, I want to see concrete, quantified achievements, so I can
  judge real impact rather than responsibilities.
- As a recruiter, I want obvious links to the candidate's professional profiles,
  so I can follow up through a channel I trust.
- As a recruiter on my phone, I want the page to load fast and read cleanly, so
  I am not forced to pinch, wait, or scroll sideways.

**Secondary persona — The owner (content maintainer)**
- As the owner, I want a single page I can keep current with low effort, so the
  site stays accurate while I job hunt.
- As the owner, I want to share one URL in applications, so my presentation is
  consistent everywhere.

## Core Features

Listed in priority order. All four are MVP.

1. **Hero + summary** (must-have)
   - Above-the-fold name, current title, and a one-line value proposition.
   - Establishes who the owner is and the level they operate at, instantly.

2. **Experience timeline** (must-have)
   - Chronological roles with company, dates, and the scope of teams/orgs led.
   - The backbone of a leadership CV; communicates seniority and trajectory.

3. **Impact highlights** (must-have)
   - A short set of selected achievements framed as outcomes, each led by a
     quantified result (e.g., "scaled team 5→30", "cut delivery time 40%").
   - Differentiates the owner by showing results, not responsibilities.

4. **Outbound links** (must-have)
   - A prominent section linking to GitHub, LinkedIn, and other professional
     sites — the only way to reach or learn more about the owner.
   - Optional downloadable PDF resume (subject to the open question on whether it
     carries contact details).
   - No contact form and no raw contact details on the page (see ADR-002).

**Feature interaction**: The four sections stack vertically on a single page.
The hero hooks; the timeline and impact highlights build credibility; the
outbound links provide the next step. The page funnels a quick scan toward
following the owner on an external, owner-controlled channel.

## User Experience

**Key persona & goal**: A recruiter wants to qualify the candidate in under a
minute and find a way to follow up.

**Primary flow**:
1. Recruiter opens the URL (often from an application or LinkedIn), usually on
   mobile.
2. The hero immediately conveys name, title, and value proposition.
3. They scroll once through the experience timeline to gauge seniority.
4. They scan impact highlights for quantified outcomes.
5. They reach the outbound links and click through to LinkedIn/GitHub (or
   download the PDF resume) to follow up.

**UX considerations**:
- Single page, one continuous scroll, no primary navigation needed.
- Mobile-first; fast load is a first-class requirement.
- Scannable typography and clear visual hierarchy; impact highlights lead with
  the number.
- Accessibility: semantic structure, sufficient color contrast, keyboard- and
  screen-reader-friendly content, descriptive link text.
- Dark mode is a nice-to-have, not MVP (see Non-Goals / Phase 2).

**Onboarding & discoverability**: There is no in-product onboarding. Discovery is
external — the owner shares the URL in applications and on LinkedIn. The page
should present clean metadata so a shared link looks credible.

## High-Level Technical Constraints

Boundaries that shape the product without prescribing implementation:
- **Performance (user-perceived)**: The page should be usable within ~1 second
  and not risk the 3-second mobile abandonment threshold.
- **Mobile-first**: Must read and perform well on phones, which dominate traffic.
- **Privacy / anti-spam**: No contact form and no exposed contact details; no
  collection of visitor personal data.
- **Content ownership**: All content lives on a surface the owner controls and
  can update independently.

(Framework, hosting, and architecture are intentionally deferred to the
TechSpec.)

## Non-Goals (Out of Scope)

- **Contact form or contact details** — deliberately excluded in v1 (ADR-002).
- **Analytics / visitor tracking** — not in v1; success is judged qualitatively.
- **Blog, articles, or a writing section.**
- **Deep multi-page case studies** — impact stays as concise highlights (ADR-001).
- **Multi-language / internationalization.**
- **CMS or admin UI** for editing content.
- **Testimonials, recommendations, or third-party embeds** in v1.
- **Project/code demos** — the owner links out to GitHub instead.

## Phased Rollout Plan

### MVP (Phase 1)
- Hero + summary, Experience timeline, Impact highlights, Outbound links.
- Mobile-first, fast-loading, single scrolling page.
- No contact form, no contact details.
- **Success criteria to proceed**: The owner judges the live site accurate and
  polished enough to include in real job applications.

### Phase 2 (only if the owner wants more)
- Dark mode.
- Optional lightweight, privacy-respecting analytics to learn what recruiters
  view (revisits the no-tracking stance only if the owner opts in).
- Subtle motion / micro-interactions for polish.
- **Success criteria to proceed**: The owner wants richer presentation or
  insight after using v1 in their job hunt.

### Phase 3 (optional, longer term)
- Deeper impact case studies (would revisit ADR-001's single-page decision).
- A safe, spam-resistant contact option if the owner later wants inbound contact
  (would revisit ADR-002).

## Success Metrics

Success in v1 is qualitative and owner-judged (no on-site tracking):
- The owner confidently includes the URL in applications and on LinkedIn.
- The site accurately and compellingly represents the owner's leadership track
  record.
- The outbound links work and route visitors to the owner's profiles.
- The page loads fast and reads cleanly on mobile.
- (Deferred, opt-in) If analytics are added in Phase 2: section views and
  click-through on outbound links / PDF downloads.

## Risks and Mitigations

- **Thin content risk**: A leadership CV without quantified outcomes reads as
  generic. *Mitigation*: require each impact highlight to lead with a number.
- **No inbound path risk**: Removing contact options could cost a follow-up from
  a recruiter unwilling to leave the page. *Mitigation*: make outbound links
  prominent and unambiguous; the owner accepts this trade-off to avoid spam.
- **Staleness risk**: A CV site loses value when out of date. *Mitigation*: keep
  it a single, low-friction page the owner can update quickly.
- **Undifferentiated presentation risk**: Many CV sites look alike.
  *Mitigation*: clear hierarchy, strong hero value proposition, outcome-led
  highlights.
- **Discoverability risk**: With no analytics and no SEO program, reach depends
  on the owner sharing the link. *Mitigation*: accepted in v1; the site's job is
  to convert visitors the owner directs to it, not to attract traffic.

## Architecture Decision Records

- [ADR-001: Single-page scrolling CV as the v1 product shape](adrs/adr-001.md) —
  Build v1 as one mobile-first scrolling page rather than a multi-page portfolio
  or a static resume mirror.
- [ADR-002: No contact form or contact details in v1 — outbound links only](adrs/adr-002.md) —
  Avoid a spam surface by linking to existing professional profiles instead of
  collecting contact on the site.

## Open Questions

- **PDF resume**: Should a downloadable PDF resume be included in v1, and if so,
  should it carry direct contact details given the anti-spam stance? (Including a
  PDF with an email reintroduces the exact exposure ADR-002 avoids.)
- **Which "other sites"** beyond GitHub and LinkedIn should the links section
  include?
- **Hero value proposition**: What single line should anchor the hero (the
  owner's positioning statement)?
- **Impact highlights content**: Which specific quantified achievements should
  appear, and how many?
- **Domain / URL**: What address will the site live at (affects how it is shared
  and perceived)?
