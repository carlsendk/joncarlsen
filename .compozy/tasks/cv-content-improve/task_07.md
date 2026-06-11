---
status: completed
title: Add the DFDS featured case study
type: docs
complexity: medium
dependencies:
  - task_01
---

# Task 7: Add the DFDS featured case study

## Overview
Add a second featured deep case study for the DFDS platform transformation
(500+ microservices on Kubernetes from zero, scaling 3 to 20, ~200 engineers
moved cloud-native), authored to the standard template (ADR-002, ADR-003). This
gives the projects tier a strong second story and exercises the `/projects`
index and featured surfacing with more than one entry.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST create a new markdown file under `src/content/work/` for the DFDS case study, satisfying the extended schema (task_01): `title`, `summary`, `role`, `period`, `company: "DFDS"`, `featured: true`, real `themes`/`skills`, `metrics`, and `order`.
- MUST write the body to the standard template (Context, What I did, Outcome), reading in roughly 60 to 90 seconds, with the metrics strip leading.
- MUST use only real figures from the owner's DFDS history (500+ microservices, 3 to 20 scaling, ~200 engineers, internal developer platform); invent nothing.
- MUST follow the voice rules: no em dashes; no AI-tell phrasing; concrete facts over adjectives.
- MUST set a distinct `order` so the AXON and DFDS featured cards sort sensibly, and introduce no contact details (ADR-002).
</requirements>

## Subtasks
- [x] 7.1 Create the DFDS markdown file with schema-valid, tagged frontmatter.
- [x] 7.2 Write the Context/What I did/Outcome body from real DFDS figures.
- [x] 7.3 Set `featured: true` and a distinct `order` relative to AXON.
- [x] 7.4 Run the voice review against the AI-tells list.
- [x] 7.5 Confirm it appears as featured on `/` and `/cv` and on `/projects` under DFDS.

## Implementation Details
Create `src/content/work/<dfds-slug>.md` (for example `dfds-platform.md`).
Source the content from the DFDS roles already in `src/data/cv.ts` and the
owner's material. Reference the TechSpec "System Architecture" (work content) and
the existing `axon-ai-platform.md` as the template to match.

### Relevant Files
- `src/content/work/axon-ai-platform.md` — the template and metrics-strip pattern to match.
- `src/data/cv.ts` — DFDS roles supply the factual basis (companies, metrics).
- `src/content.config.ts` — the schema the new file must satisfy (task_01).

### Dependent Files
- `src/components/CaseStudies.astro` (task_05) — will surface this featured entry.
- `src/pages/projects.astro` (task_04) — will list it under DFDS.

### Related ADRs
- [ADR-002: Two-tier project model](adrs/adr-002.md) — featured deep case studies.
- [ADR-003: Hybrid content model](adrs/adr-003.md) — projects as `work` entries; `featured` surfaces.

## Deliverables
- A new featured DFDS case study markdown file in the standard template.
- Schema-valid, tagged frontmatter with real metrics and a distinct `order`.
- Render and voice verification evidence **(REQUIRED)**.

## Tests
- Unit tests (content/schema/voice verification):
  - [x] The DFDS file validates against the `work` schema (`npx astro check` passes; required `company` present).
  - [x] The body contains the three template headings and leads with the metrics strip.
  - [x] Em-dash and AI-tell greps over the new file return zero hits; contact-leak grep returns zero hits.
- Integration tests:
  - [x] `npx astro build` exits 0 and emits the new `/work/<dfds-slug>` page.
  - [x] The DFDS card shows as featured on `/` and `/cv`, and the entry appears under "DFDS" on `/projects`.
  - [x] `linkinator` (with `--skip 'joncarlsen.dk'`) resolves the new deep-page links; real Lighthouse on the new page holds the bars in both themes.
- Test coverage target: >=80% (frontmatter, body template, and surfacing exercised)
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- A second featured case study (DFDS) is live, schema-valid, voice-compliant.
- It surfaces on `/` and `/cv` and lists under DFDS on `/projects`; no invented metrics; no contact details.
