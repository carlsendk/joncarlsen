# Task Memory: task_05.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot
Timeline `variant="full"` (/cv): keep first `collapseConfig.recentRoles` (4) roles visible, collapse the remaining 6 (10 roles total) behind ONE bulk `<button aria-expanded>` "Show earlier roles (N)". All roles stay in the DOM; default SSR expanded; a bundled deferred script collapses the tail on load + toggles. Print/no-JS show all. `variant="condensed"` (home) unchanged. STATUS: DONE.

## Important Decisions (as built)
- Tail in a SECOND `<ol id="experience-tail">`; JS toggles plain class `cv-collapsed` (`display:none`). Default SSR has NO collapse class (expanded). Governs display, not opacity → expanded roles resolve to opacity 1 (browser-verified); reveal lives only on the `<section>`, not the tail.
- `.cv-collapsed` defined OUTSIDE `@layer components` (like `.reveal`) so the style-spec test (scans inside the layer only) needn't document it. Never in markup (JS-added) → eslint `no-unknown-classes` ERROR rule never sees it.
- Button: `class="cv-pill mt-10 text-muted"` (cv-pill is a known @layer component), `id="experience-expander"`, `aria-controls="experience-tail"`, `data-count={hiddenCount}`, `hidden` (revealed by JS). SSR `aria-expanded="true"`. Native `<button>` → keyboard-operable for free.
- Collapse gated on `variant === "full" && shown.length > collapseConfig.recentRoles`. recent = `shown.slice(0,recentRoles)`, earlier = `shown.slice(recentRoles)` — a split, never a drop. Condensed renders one `<ol>` exactly as before.
- Toggle logic EXTRACTED to `src/scripts/collapse.ts` (`initCollapse(doc=document)`); component `<script type=module>` imports + calls it. Deliberate deviation from the task's literal "inline IIFE" wording — reconciled by techspec lines 45-47 ("a tiny shared module") and REQUIRED to make the behavioral toggle test execute under `node --test` (no JSDOM/Playwright in deps). Still bundled+deferred; Astro INLINES it (no separate dist/_astro/*.js).

## Learnings
- 10 roles (`cvData.roles.length`), recentRoles=4 → 6 collapsed. Tests compute counts dynamically (techspec's 11/7 text is stale).
- `id="experience"` was ALREADY on the section (task 02 is done — shared MEMORY was right; this file's earlier "task 02 pending" note was stale). Task 05 did not touch it.
- Astro inlines the module `<script>` on EVERY page (no-ops without the ids), so the script's id-strings (`getElementById("experience-tail")`, the `Show earlier roles (${count})` template literal) appear in the home page's inlined script. Condensed-unchanged test asserts absence of the ATTRIBUTE form `id="experience-tail"`/`id="experience-expander"`, NOT bare strings.
- Plain `node --test` cannot import `.astro` (no Vite) → Astro Container API NOT usable for in-process render; integration tests must `astro build` + read dist (repo convention).

## Files / Surfaces
- `src/components/Timeline.astro` — split recent/earlier, tail `<ol>`, button, module `<script>`. Imports `collapseConfig`.
- `src/scripts/collapse.ts` — NEW. `initCollapse()` toggle module.
- `src/styles/global.css` — `.cv-collapsed { display:none }` (outside layer) + `@media print` neutralize (`display:revert!important`) + hide `#experience-expander`.
- `tests/cv-structure-05.test.mjs` — NEW. 15 tests: unit/source + module-behavioural (DOM stub) + built-HTML integration.
- `tests/cv-structure-02.test.mjs` — UPDATED one forward-guard (see Corrections).

## Errors / Corrections
- cv-structure-02's `experience: role rendering is untouched` was a task-02 forward-guard ("collapse is task 05") asserting `shown.map`. Task 05 split that into `recent.map`/`earlier.map`; UPDATED the test to accept `(shown|recent|earlier).map((role)` (intent: roles still render as <li>, not dropped). Expected, in-scope.
- THREE concurrent `astro build` runs race on Tailwind's ESM cache loader (`@tailwindcss/node`) at finalization, regardless of separate outDir → intermittent build failure (the shared-MEMORY "just pick another outDir" guidance is insufficient at 3 builds). cv-structure-05's `before()` retries the build (4 attempts, backoff) so it runs in the clear window after 02/03 finish. Full suite green 3× in a row.

## Ready for Next Run
- Task 05 DONE. Full pipeline: lint 0 errors; tests 222 pass / 4 fail (the 4 are the pre-existing cv-roles-conversion Hero/Header baseline, proven failure-neutral by stash); build OK. Browser-verified collapse-on-load, click-expand opacity 1, print neutralization. NOT committed (auto-commit disabled).