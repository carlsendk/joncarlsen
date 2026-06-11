# CV Content & Supporting Features — Task List

## Tasks

| # | Title | Status | Complexity | Dependencies |
|---|-------|--------|------------|--------------|
| 01 | Expand CvData model and populate real content in src/data/cv.ts | completed | medium | — |
| 02 | Define the work Astro content collection schema in src/content.config.ts | completed | low | — |
| 03 | Add condensed and full experience rendering to Timeline.astro | completed | medium | task_01 |
| 04 | Build the full-CV section components for /cv | completed | medium | task_01 |
| 05 | Assemble the /cv full-CV page in cv.astro | completed | medium | task_01, task_03, task_04 |
| 06 | Restructure the frontpage index.astro to a condensed scan | completed | medium | task_01, task_03 |
| 07 | Add the /work/[slug] route and seed the first case study | completed | medium | task_02, task_05, task_06 |
| 08 | Add the print stylesheet for /cv | completed | low | task_05 |
| 09 | Add the About narrative and Talks and Writing sections | pending | medium | task_05, task_06 |
| 10 | Author the second case study, the DFDS transformation | pending | low | task_07 |
| 11 | Add the optimized headshot to the Hero via astro:assets | pending | low | task_06 |

## Phasing

- **MVP (Phase 1):** task_01 – task_08. Real content live on `/` and `/cv`, the
  `/work` case-study capability with one seeded study (AXON), and a print-friendly `/cv`.
- **Phase 2:** task_09 – task_11. About/leadership narrative + Talks & Writing,
  the second case study (DFDS), and the optimized headshot.

## Cross-cutting acceptance gates (apply to every task)

- **Authentic voice (ADR-002 source rule):** all authored copy reads as the owner
  wrote it — no em dashes; avoid stock AI phrasing ("furthermore", "moreover"),
  parallel triads, "it's not X, it's Y" constructions, buzzword stacking. Applies
  to task_01, task_07, task_09, task_10 especially.
- **No contact details (ADR-002):** no email or phone rendered anywhere; LinkedIn
  is the only contact route. Verified by grep on built HTML.
- **Quality bar:** `astro check` and `astro build` exit 0; `linkinator` finds no
  broken links; Lighthouse performance and accessibility hold the project bar in
  both themes; WCAG AA contrast holds in both themes.
