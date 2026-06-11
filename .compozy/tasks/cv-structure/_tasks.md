# CV Structure — Task List

## Tasks

| # | Title | Status | Complexity | Dependencies |
|---|-------|--------|------------|--------------|
| 01 | Add `sectionLeadIns`, `navGroups`, `CollapseConfig` to `cv.ts` and the `.cv-lead` base style to `global.css` | completed | medium | — |
| 02 | Section anchors + lead-ins, batch 1 (Summary, Credentials, Impact, Expertise, Timeline, CaseStudies, Approach) | completed | medium | task_01 |
| 03 | Section anchors + lead-ins, batch 2 (Education, Certifications, Publications, VoluntaryLeadership, PersonalDetails, Interests, Links) | completed | medium | task_01 |
| 04 | Reorder `cv.astro` to the PRD section order and wire `leadIn` props to every section | pending | low | task_02, task_03 |
| 05 | Timeline long-tail collapse — keep recent roles, collapse the rest behind one bulk button (class-toggle script + print rule) | completed | medium | task_01, task_02 |
| 06 | `CvNav.astro` right-margin rail + mobile dropdown + scroll-spy, rendered in `cv.astro`; final whole-page verification | pending | high | task_01, task_04, task_05 |
