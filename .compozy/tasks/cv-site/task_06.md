---
status: completed
title: Custom-domain go-live (DNS + Pages + HTTPS)
type: infra
complexity: low
dependencies:
  - task_05
---

# Task 6: Custom-domain go-live (DNS + Pages + HTTPS)

## Overview
Point the `joncarlsen.dk` domain at GitHub Pages, enable the custom domain with
enforced HTTPS, and verify the site is live at its production URL. This is the
final step that makes the CV site reachable at the address the owner shares in
applications.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST configure registrar DNS so `joncarlsen.dk` resolves to GitHub Pages (apex `A`/`AAAA` records; add a `www` `CNAME` to `carlsendk.github.io` if a `www` host is wanted).
- MUST set the custom domain to `joncarlsen.dk` in repository Pages settings with Pages source = GitHub Actions.
- MUST enable "Enforce HTTPS" so HTTP redirects to HTTPS.
- MUST verify the live site serves correctly at `https://joncarlsen.dk` with all assets and the PDF loading from the root.
- SHOULD decide and document the apex-vs-`www` policy (which is canonical, with the other redirecting).
</requirements>

## Subtasks
- [x] 6.1 Add the documented GitHub Pages apex DNS records at the registrar.
- [x] 6.2 Set the custom domain in repository Pages settings.
- [x] 6.3 Enable "Enforce HTTPS" and wait for certificate issuance.
- [x] 6.4 Decide and apply the apex-vs-`www` canonical/redirect policy.
- [x] 6.5 Verify the live URL, assets, PDF, and HTTPS redirect.

## Implementation Details
This task is primarily external configuration (registrar DNS and GitHub repo
settings) plus a live verification pass; the only repo artifact is the already
committed `public/CNAME` from task 01. See TechSpec "Development Sequencing"
step 7, "Technical Dependencies" (DNS + HTTPS), and ADR-006 for the exact values.

### Relevant Files
- `public/CNAME` — already holds `joncarlsen.dk`; confirm it ships in the deploy.
- (No new repository code; configuration lives in the registrar and GitHub settings.)

### Dependent Files
- `.github/workflows/deploy.yml` — the deploy whose output the custom domain serves.

### Related ADRs
- [ADR-006: Custom domain joncarlsen.dk on GitHub Pages](../adrs/adr-006.md) — exact DNS/CNAME/HTTPS decisions.
- [ADR-004: Host on GitHub Pages](../adrs/adr-004.md) — underlying hosting.

## Deliverables
- DNS configured so `joncarlsen.dk` resolves to GitHub Pages.
- Custom domain set in Pages settings with Enforce HTTPS on.
- Documented apex-vs-`www` policy.
- Live verification checklist passing **(REQUIRED)**.
- An end-to-end deploy-to-live confirmation **(REQUIRED)**.

## Tests
- Unit tests (live smoke verification):
  - [x] `https://joncarlsen.dk` returns HTTP 200 and the deployed page over a valid TLS certificate (no browser warning).
  - [x] An `http://joncarlsen.dk` request redirects to `https://` (Enforce HTTPS active).
  - [x] The apex domain serves the site; the `www` host behaves per the documented policy (serves or redirects, not a dead end).
  - [x] CSS and the resume PDF load from the root with no 404s on the live domain.
  - [x] Repository Pages settings show `joncarlsen.dk` as the verified custom domain.
- Integration tests:
  - [x] End-to-end: a content change pushed to the default branch is visible at `https://joncarlsen.dk` after the deploy completes.
- Test coverage target: >=80% of the live-verification checks above pass (no unit-testable code; verification is the coverage equivalent).
- All tests must pass.

### UPDATE — completed via Netlify (ADR-007, 2026-06-09)
Go-live was achieved on **Netlify**, not GitHub Pages (see ADR-007). DNS already
pointed `joncarlsen.dk` at Netlify, so no registrar work was needed — the
apex-`A`/Pages-records requirement is moot. Verified live:
- `https://joncarlsen.dk` → **HTTP 200** over valid TLS (HSTS `max-age=31536000`).
- `http://joncarlsen.dk` → **301 → https** (force_ssl on).
- `www.joncarlsen.dk` → **301 → apex** (apex is canonical; www redirects — documented policy).
- CSS/assets load from the root (no 404s). PDF: `resumePdf` still omitted, so no PDF link (N/A until owner adds one).
- Netlify `custom_domain = joncarlsen.dk`, `ssl=true`, `force_ssl=true`. Push-to-`master` propagates to the live site (verified with commit `57a344e`).
- The original GitHub-Pages-worded requirements (apex A/AAAA records, Pages settings, public/CNAME) are superseded by the Netlify equivalents above.
**Remaining for a real go-live the owner shares in applications:** real `cv.ts` content
(and optional `public/resume.pdf`) — owner-provided, the open PRD content questions; not an infra item.

## Success Criteria
- All tests passing
- Test coverage >=80% (all live-verification checks pass)
- The site is reachable at `https://joncarlsen.dk` over enforced HTTPS.
- All assets and the PDF load correctly on the live domain.
- A pushed content change propagates to the live site automatically.
