---
status: completed
title: CI workflow — build, quality gate, and deploy to Pages
type: infra
complexity: medium
dependencies:
  - task_04
---

# Task 5: CI workflow — build, quality gate, and deploy to Pages

## Overview
Add a GitHub Actions workflow that builds the site, enforces a quality gate
(type check, Lighthouse performance/accessibility budgets, and a link check),
and deploys the static output to GitHub Pages on push. This automates the
PRD's fast-load and accessibility guarantees and makes publishing a single push.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST run `astro build` and `astro check` in CI; a type error MUST fail the job.
- MUST run Lighthouse against the built site and fail the job when the performance or accessibility budget is not met.
- MUST run a link check that fails the job when any outbound profile link or the PDF path returns an error.
- MUST deploy the built `dist/` to GitHub Pages on success on the default branch.
- MUST preserve the `public/CNAME` binding in the deployed artifact (per ADR-006).
- SHOULD pin action and tool versions for reproducible builds.
</requirements>

## Subtasks
- [x] 5.1 Add a workflow that installs dependencies and builds the site.
- [x] 5.2 Add type-check, Lighthouse-budget, and link-check gate steps.
- [x] 5.3 Wire the gate so any failing check blocks deploy.
- [x] 5.4 Deploy `dist/` to GitHub Pages on the default branch. *(Performed on owner authorization: commit `fa4c329` pushed to `master`, Pages switched to source=GitHub Actions, run #27207255612 deployed `dist/`. Live at https://carlsendk.github.io/joncarlsen/.)*
- [x] 5.5 Verify the deployed artifact includes the CNAME. *(Built+deployed artifact `dist/CNAME` = `joncarlsen.dk`, uploaded verbatim by `actions/upload-pages-artifact`. Binding the domain at the Pages level + DNS repoint is task_06 — see note.)*

## Implementation Details
Add `.github/workflows/deploy.yml` (and a Lighthouse budget config if needed).
Use the official GitHub Pages deploy actions. See TechSpec "Testing Approach"
(the pre-deploy quality gate) and "Development Sequencing" step 6 for the
required gate steps and their order.

### Relevant Files
- `.github/workflows/deploy.yml` — build, gate, and deploy pipeline (created here).
- `lighthouserc`/budget config — performance/accessibility budgets (created here if used).

### Dependent Files
- `astro.config.mjs` — build output and `site`/`base` consumed by the workflow.
- `public/CNAME` — must survive into the deployed artifact.
- Task 06 — custom-domain go-live depends on this working deploy.

### Related ADRs
- [ADR-004: Host on GitHub Pages via GitHub Actions](../adrs/adr-004.md) — deploy mechanism.
- [ADR-006: Custom domain joncarlsen.dk](../adrs/adr-006.md) — CNAME must persist.

### Implementation Notes (as-built)
- **Delivered:** `.github/workflows/deploy.yml` and `lighthouserc.json`; `.gitignore` gains `.lighthouseci/`.
- **Workflow shape:** one `build` job (checkout → `setup-node@v4` Node **22** LTS w/ npm cache → `npm ci` → `npm run check` → `npm run build` → CSS-size budget → Lighthouse-CI → link check → `upload-pages-artifact@v3`) and a `deploy` job that `needs: build` and runs `actions/deploy-pages@v4`. The `needs:` dependency means **any failing gate step blocks deploy**. Actions and tools are version-pinned (`@v4`, `@lhci/cli@0.14.0`, `linkinator@6.1.2`).
- **Gate details:**
  - *Type check* — `npm run check`; non-zero exit fails the job.
  - *Lighthouse* — `@lhci/cli autorun` with `lighthouserc.json` (`staticDistDir: ./dist`, desktop preset, assertions `categories:performance >= 0.9`, `categories:accessibility >= 0.95`; upload target `filesystem` so reports are **not** uploaded to public storage — honors the PRD no-tracking stance). Budgets match task_04's recorded numbers.
  - *CSS budget* — plain `wc -c` step, fail if `> 20480` bytes (current 9.8 KB). Kept in bash rather than an lhci resource-summary assertion (simpler, more robust).
  - *Link check* — `linkinator ./dist --recurse`, strictly enforcing internal/asset paths, the PDF path (when `resumePdf` is set), and GitHub. Skips `linkedin.com` (returns HTTP 999 for everyone, real handle or not — undetectable) and the site's own `joncarlsen.dk` origin (a self-canonical reference that won't resolve until task_06 DNS go-live; checking it would deadlock deploy↔DNS).
- **Publish safety:** `on: [push:master, workflow_dispatch]`; the `deploy` job is guarded to `github.event_name == 'push' && ref == master`, so a manual `workflow_dispatch` (or any non-master context) runs the **gate only and never publishes** — a safe pipeline smoke test.
- **Validation:** `actionlint@1.7.12` → 0 issues. All gate steps proven locally against the built `dist/`, each failing gate proven red-green (lhci tripwire, broken link / missing PDF, injected type error). `dist/CNAME` = `joncarlsen.dk`.
- **Live deploy (performed on owner authorization):** committed the site as `fa4c329`, switched Pages to source=GitHub Actions (`gh api -X PUT .../pages -f build_type=workflow`; it had been `legacy`/branch), and pushed to `master`. Run #27207255612 ran the full gate (all green on the runner, incl. real Lighthouse) and deployed. **Site is live at https://carlsendk.github.io/joncarlsen/** serving the placeholder CV.
- **Findings handed to task_06 (custom-domain go-live):**
  1. **`joncarlsen.dk` currently points to Netlify**, NOT GitHub Pages (A records `63.176.8.218`/`35.157.26.135`, `server: Netlify`, still the old Gatsby site). Task_06 must repoint apex DNS to GitHub Pages IPs (`185.199.108.153`/`.109.153`/`.110.153`/`.111.153`) and bind the domain in Pages settings (`cname` is currently null).
  2. **Styling at the project URL is broken by design:** `base: '/'` (per ADR-006, for the custom domain) makes assets resolve at the domain root, so at `carlsendk.github.io/joncarlsen/` the CSS 404s (it's served at the `/joncarlsen/` subpath). Binding `joncarlsen.dk` at root fixes this — the styled view comes with task_06.
- **Minor (non-blocking):** the run logged a deprecation notice (Node 20 actions → Node 24 forced after 2026-06-16; `checkout`/`setup-node`/`upload-artifact` still run fine), and GitHub flagged 3 Dependabot vulnerabilities in the dependency graph — both are follow-ups, not gate failures.

### UPDATE — hosting moved to Netlify (ADR-007, 2026-06-09)
The GitHub Pages deploy recorded above was superseded the same day. joncarlsen.dk
turned out to already be served by an existing **repo-connected Netlify site** with
the custom domain + HTTPS bound — the old site was just stuck on a stale `gatsby build`
config. Switching to Netlify needed zero DNS work, so it replaced the Pages path (ADR-007).
- **Delivered:** committed `netlify.toml` (build `astro check && astro build && linkinator …`,
  publish `dist`, Node 22, `@netlify/plugin-lighthouse` perf≥0.9 / a11y≥0.95); removed
  `.github/workflows/deploy.yml`, `lighthouserc.json`, and `public/CNAME`; disabled GitHub Pages.
- **Live & verified:** https://joncarlsen.dk serves the new styled CV (HTTP 200, CSS resolves
  at root); Netlify build for commit `57a344e` reached state=ready.
- **Gate status (accurate):** `astro check` and the link check **hard-block** the deploy
  (build-command `&&` → non-zero exit fails the build; both fail-modes proven red-green).
  The Lighthouse budget runs via `@netlify/plugin-lighthouse@6.0.1` (auto-installs) and is
  **trusted on its documented fail-on-miss design but was NOT independently red-tested live**
  (owner accepted; local `netlify build` did not score Lighthouse, and no real failing build
  was run). The deterministic gates remain the guaranteed blockers.

## Deliverables
- A GitHub Actions workflow that builds, gates, and deploys to Pages.
- Failing-gate behavior wired so bad builds never deploy.
- Workflow-behavior tests **(REQUIRED)**.
- A verified end-to-end deploy on a test run **(REQUIRED)**.

## Tests
- Unit tests (job/step behavior):
  - [x] A deliberate type error makes the `astro check` step fail the job. **Verified locally: injecting `name={42}` made `npm run check` exit 1 (`ts(2322)`); reverting → exit 0. The job runs `npm run check`, so a non-zero exit fails it.**
  - [x] A page that misses the Lighthouse performance or accessibility budget fails the job. **Verified red-green: `@lhci/cli autorun` exits 0 with the real config (perf/a11y both 100 ≥ budgets); a tripwire config (`first-contentful-paint maxNumericValue: 1`) exits 1 with an assertion failure.**
  - [x] A broken outbound link or a missing PDF path (404) fails the link-check step. **Verified red-green: `linkinator ./dist` exits 0 clean; injecting a broken internal link AND a `/resume.pdf` link with no file → both 404, exit 1.**
  - [x] On a green run on the default branch, the deploy step publishes `dist/` to Pages. **Observed: run #27207255612 — build+gate job 58s all green, deploy job 8s success; site live at https://carlsendk.github.io/joncarlsen/ (HTTP 200, serves the CV HTML).**
  - [x] The deployed artifact contains `CNAME` with `joncarlsen.dk`. **`dist/CNAME` = `joncarlsen.dk` (Astro copies `public/CNAME`); uploaded verbatim by `upload-pages-artifact`.**
- Integration tests:
  - [x] A push to the default branch produces an updated GitHub Pages deployment (observed on a test run). **Observed: pushing `fa4c329` to `master` triggered run #27207255612, which built, gated, and deployed to Pages end-to-end (exit success).**
- Test coverage target: >=80% of the gate steps exercised (build, type check, Lighthouse, link check, deploy).
- All tests must pass.

## Success Criteria
- All tests passing
- Test coverage >=80% (each gate step exercised)
- Pushing to the default branch builds, gates, and deploys automatically.
- A failing quality check blocks the deploy.
- The deployed artifact preserves the CNAME.
