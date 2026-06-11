---
status: completed
title: Add strategic project entries from the documented history
type: docs
complexity: medium
dependencies: []
---

# Task 7: Add strategic project entries from the documented history

## Overview
Deepen the projects breadth with a few more strategic projects drawn from the
owner's documented history (PRD "More strategic projects"). These reinforce the
CTO narrative with real transformation and strategy work, added through the
existing `work` collection as non-featured index entries.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST add a few new markdown entries under `src/content/work/` for strategic projects from the documented history (candidates: eID consolidation at Lunar, DFDS.com, DFDS Way, SCRUM transformation at Ørsted), each satisfying the existing `work` schema.
- MUST set `company`, `featured: false`, real `themes`/`skills`, real `metrics` only (omit where none exist), and a distinct `order` so the `/projects` grouping stays sensible.
- MUST write each body to the standard template (Context, What I did, Outcome), reading quickly, sourced from real material with no invented figures.
- MUST follow the voice rules (no em dashes; no AI tells) and introduce no contact details.
- MUST keep the entries non-featured so they appear on `/projects` (grouped by company) without cluttering the frontpage or `/cv`.
</requirements>

## Subtasks
- [x] 7.1 Choose the strategic projects to add from the documented history.
- [x] 7.2 Create each markdown entry with schema-valid, tagged frontmatter.
- [x] 7.3 Write each Context/What I did/Outcome body from real material.
- [x] 7.4 Set distinct `order` values and confirm grouping under the right company.
- [x] 7.5 Run the voice review on each new entry.

## Implementation Details
Create new files under `src/content/work/`. Match the existing entries (for example
`dfds-platform.md`, `lunar-platform-experience.md`) for structure and tags. Source
from `docs/projekts.html` and `docs/Content/_base/master-CV.md`. See the TechSpec
"System Architecture" (work content). This task is independent of the cv.ts changes.

### Relevant Files
- `src/content/work/*.md` — existing entries to match.
- `src/content.config.ts` — the `work` schema the new files must satisfy.
- `docs/projekts.html`, `docs/Content/_base/master-CV.md` — source material.

### Dependent Files
- `src/pages/projects.astro` — lists the new entries under their company (no edit needed).

### Related ADRs
- [ADR-001: Re-pitch the canonical CV to CTO altitude](adrs/adr-001.md) — strategic projects reinforce the narrative.

## Deliverables
- A few new non-featured strategic project entries, schema-valid and voice-compliant.
- Render and grouping verification evidence **(REQUIRED)**.

## Tests
- Unit tests (content/schema/voice verification):
  - [ ] Each new file validates against the `work` schema (`npx astro check` passes; required `company` present).
  - [ ] Each body contains the three template headings; metrics are present only where real.
  - [ ] Em-dash, AI-tell, and contact-leak greps over the new files return zero hits.
- Integration tests:
  - [ ] `npx astro build` exits 0 and emits a `/work/<slug>` page per new entry.
  - [ ] Each new entry appears under its company on `/projects` and is absent from the featured listing on `/` and `/cv`.
  - [ ] `linkinator` (with `--skip 'joncarlsen.dk'`) resolves the new deep-page links.
- Test coverage target: >=80% (frontmatter, body template, and grouping exercised)
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- A few real strategic projects are live on `/projects`, grouped by company, non-featured.
- No invented metrics; no contact details; no em dashes.
