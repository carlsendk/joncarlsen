# Task Memory: task_04.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

Render `cvData.scope` as a scannable executive scope line in the hero (supporting text, not a heading), AA in both themes, single h1 preserved, no client JS, no contact details. Capability only — real-page wiring (passing `scope` to index/cv) is task_05.

## Important Decisions

- Rendered in `Hero.astro` (not `Summary.astro`) so scope front-loads on both `/` and `/cv` (TechSpec step 4; task preferred).
- `scope?: string` made OPTIONAL + conditional render, so Hero stays safe before task_05 wires the prop. Real pages NOT edited (would be task_05 scope creep; task_05 explicitly "MUST pass cvData.scope to the hero/summary on both cv.astro and index.astro").
- Markup: `<p>` with a mono uppercase "Scope" eyebrow `<span>` (text-muted) + a block `<span>` sentence (text-fg, text-base). Spans, never a heading, so the single h1 (Hero name) is preserved. text-fg gives the hard-fact line max contrast vs the muted valueProp above it.

## Learnings

- Built-output + AA evidence follows the task_03 precedent: throwaway harness pages render the changed component, build, grep dist, run Lighthouse. Created `src/pages/scope-harness.astro` (light) + `scope-harness-dark.astro` (dark), each rendering `Hero` with `scope={cvData.scope}`. Hero supplies the harness's single h1.
- AA verified two ways: computed WCAG ratios — light fg/bg 17.85:1, label muted/bg 7.58:1; dark fg/bg 15.31:1, label muted/bg 7.37:1 (all >> 4.5) — AND real Lighthouse accessibility = 1.0 with color-contrast audit passing on both harness pages.

## Files / Surfaces

- `src/components/Hero.astro` — added optional `scope?` prop + conditional scope render (the task change).
- `src/pages/scope-harness.astro`, `src/pages/scope-harness-dark.astro` — NEW throwaway verification harnesses (untracked, same convention as task_03's a11y-harness; delete before final build).

## Errors / Corrections

- Initial plan was to also wire index.astro/cv.astro to pass `scope`; corrected — that is task_05's explicit requirement. Kept the optional prop, deferred page wiring.

## Ready for Next Run

- task_05 must pass `cvData.scope` to `<Hero>` on `src/pages/index.astro` and `src/pages/cv.astro` (and front-load summary+scope on the frontpage). Hero already accepts `scope?`.
- Harness cleanup: `scope-harness*.astro` (this task) and `a11y-harness*.astro` (task_03) are throwaway routes to remove before the final production build (task_08 verification pass).
