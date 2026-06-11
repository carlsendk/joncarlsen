# Task Memory: task_02.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot
- DONE (2026-06-11): Convert 6 prose/label components (Hero, Summary, Approach, Credentials, Expertise, Interests) to cv-* role classes from task_01. PURE no-op conversion (zero drift corrections).

## Important Decisions
- Did NOT author role classes here (global.css is a dependent file, owned by task_01).
- Near-eyebrow labels (`font-mono text-xs uppercase tracking-[0.2em] text-muted`, NO font-medium) on Hero "Scope" + Approach "Writing" left INLINE — match no role (cv-eyebrow has font-medium; adopting it = weight 400→500 visible change AND cross-page inconsistency with work/[slug].astro:26 which task_05 deliberately left inline for the identical string). Enforced by a positive "stays inline" test.
- Hero adopts ONLY cv-body (valueProp + scope text). Header wrapper (one-off padding, no border-t — NOT cv-section), display h1 (text-5xl/6xl inline tier), and text-sm title line all stay inline. No cv-meta used anywhere in this batch (no date/location meta lines exist in these 6) — the task-note "cv-meta" hint did not materialise; the note's role hints are approximate, structural reading wins.
- Expertise chips → cv-badge text-muted (text-muted stays in markup, baked-colour rule).

## Learnings
- This batch was a PURE no-op: every body line already had leading-relaxed, every h2 already matched canonical cv-eyebrow exactly, the expertise chip matched cv-badge exactly. Playwright before/after on /cv byte-identical across all 24 measured elements.
- All 6 render on /cv (single page for the parity capture). Hero `<header>` is NOT the first `<header>` on the page (site nav Header.astro is) — select Hero via `h1.font-display`.closest('header').

## Files / Surfaces
- Converted: src/components/{Hero,Summary,Approach,Credentials,Expertise,Interests}.astro
- Tests: tests/cv-roles-conversion-02.test.mjs + tests/fixtures/cv-roles-computed-02.json (11 tests, all green).

## Errors / Corrections
- (none)

## Ready for Next Run
- task_02 complete. Only task_08 (promote warn→error, gated on Header text-[0.625rem] decision) + task_09 (doc-tidy) remain in the workflow.
