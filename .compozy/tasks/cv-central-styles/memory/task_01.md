# Task Memory: task_01.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot
- DONE: `@layer components` role layer added to `src/styles/global.css` (after `@layer base`, before the film-grain rule). All 12 canonical roles defined via `@apply`, with per-role in-file comments. Classes defined, NOT yet applied in markup (conversion is tasks 02-05). Build/lint/check/test all green.

## Important Decisions
- Colour conflict (task-req "keep text-fg/text-muted OUT" vs techspec/style-spec showing text-muted in cv-eyebrow/cv-meta): RESOLVED in favour of techspec + docs/style-spec.md (both source-of-truth, both list these values as FINAL). Rationale: the rule targets *per-instance* colour so a role serves both fg+muted contexts; eyebrow/meta are invariantly muted (never fg), so baking text-muted in does not violate the rule and *reduces* the duplication the task exists to remove. Not a blocking contradiction — recorded per cy-execute-task.
- Colour rule applied uniformly: bake colour in ONLY where (a) the style-spec fixes it as final (cv-eyebrow, cv-meta → text-muted) or (b) it is intrinsic to the role identity (cv-metric → text-accent; cv-pill-solid → text-bg on accent fill; cv-link → hover:text-accent interaction colour). All other roles keep per-instance colour in markup: cv-body, cv-entry-title, cv-detail, cv-badge, cv-pill.
- `@apply reveal` / `@apply link-underline` (shown in techspec Core Interfaces) NOT used: in Tailwind v4 `@apply` resolves only utilities/@utility, and `reveal`/`link-underline` are plain CSS classes defined only inside @media/@supports — they would fail the build. cv-section/cv-link omit them; the `reveal` and `link-underline` hooks stay in markup beside the role class in tasks 02-05. Cross-check test does not require them.

## Subtask 1.4 — eyebrow vs meta occurrence mapping
- cv-eyebrow (mono text-xs font-medium uppercase tracking-[0.2em]): all section `h2#*-heading` labels (Summary, Expertise, Timeline, Education, CaseStudies, Voluntary, Links, Certifications, Credentials, PersonalDetails, Impact, Approach, Publications, Interests), the company `h2`s in impact.astro:62 + work/index.astro:60, and the in-prose label Approach.astro:61. Hero.astro:29 scope label (text-xs tracking-[0.2em]) is also eyebrow-tier.
- cv-meta (mono text-xs uppercase tracking-wider): dates/period/scope labels — Timeline role dates, Education degree dates, CaseStudyCard role·period, work/[slug] role·period, impact group item.title, Impact.astro company hover line.
- Awkward cases (drift to fix during conversion, NOT here): Hero.astro:24 h1 subtitle uses text-sm+tracking-[0.2em] (eyebrow styling at off-tier size — stays inline, hero is inline-styled); Header.astro:57 h1 subtitle uses off-scale text-[0.625rem]+tracking-[0.2em] (off-scale, flagged by canonical-scale lint). The "See all"/CTA links (CaseStudies:30, impact:46) use uppercase-mono-tracking-wider but are LINKS → map to cv-link, not cv-meta.

## Learnings
- Author CSS rules in `@layer components` are NOT content-purged by Tailwind v4 (only on-demand *utilities* are content-scanned). All 12 cv-* classes appear in dist even though unapplied — verified by grepping dist/_astro/*.css.
- Cross-check test (tests/style-spec.test.mjs) reads SOURCE global.css, not dist; it requires literal size tokens per role (cv-entry-title→text-xl, cv-metric→text-2xl AND text-3xl via sm:text-3xl, cv-eyebrow/cv-meta→text-xs, cv-detail→text-sm; cv-body skipped as implicit default). Does NOT check colour. Now GREEN.
- `npm run lint` is scoped to `src/**/*.astro`; CSS-only edits to global.css are invisible to lint. The 48 lint warnings are pre-existing markup class-order warnings (tasks 02-05/08), unaffected here.

## Files / Surfaces
- `src/styles/global.css` — added `@layer components` block (12 roles + header/per-role comments). Only file changed.

## Errors / Corrections
- none.

## Ready for Next Run
- task_01 complete. Unblocks conversion tasks 02-05 (consume cv-* roles) and finalisation of task_09 (style-spec values now all canonical). When converting, remember: keep `reveal` on cv-section and `link-underline` on cv-link in markup; supply per-instance text-fg/text-muted in markup for the colour-less roles.
- Auto-commit disabled for this run: diff left staged-ready for manual review, no commit created.
