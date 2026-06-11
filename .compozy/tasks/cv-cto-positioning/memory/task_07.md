# Task Memory: task_07.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

Add a few non-featured strategic `work/*.md` entries from documented history. Candidates per task: eID@Lunar, DFDS.com, DFDS Way, SCRUM@Ørsted. DFDS.com is ALREADY covered by `dfds-responsive-web-platform.md`, so the 3 remaining candidates are exactly the new entries.

## Important Decisions

- Three new entries (each distinct company, non-featured):
  1. `orsted-agile-scrum-transformation.md` — org-wide SCRUM "way of working", offshore teams in Asia, Story Points model, LEAN/DEEP change mgmt. Company "Ørsted", order 8, themes transformation/org-scaling. No real metric → omit metrics.
  2. `dfds-way-of-working.md` — "DFDS Way", dev mission rolled out via roadshows, flow/DevOps. Company "DFDS", order 9, role "Head of Department, Customer Experience (CMS & Booking)". No metric → omit.
  3. `lunar-eid-consolidation.md` — eID broker consolidation under continuous compliance. Company "Lunar A/S", order 10, themes security-compliance/transformation. No metric → omit.
- Existing orders in use: 1-7. New: 8/9/10 (distinct, group sensibly under each company).
- Source: master-CV.md (DFDS Way, SCRUM, eID lines) + projekts.html ("The way we work (SCRUM)" 2013-14; "Consolidations of eID brokers" Aug-Nov 2022). No invented figures.

## Learnings

- Voice gate is a MANUAL read (per cv-content-improve memory), not a grep: em-dash + furthermore/moreover pass at baseline. Discriminating tell = parallel triads-for-rhythm. Match existing entries: plain prose, British spelling (organisation/optimise), Context/What I did/Outcome headings.

## Files / Surfaces

- New: `src/content/work/orsted-agile-scrum-transformation.md`, `dfds-way-of-working.md`, `lunar-eid-consolidation.md`.
- No code edits: `projects.astro` groups by company automatically; `[slug].astro` renders each page.

## Errors / Corrections

- ugrep (the `grep` alias) mishandles an unquoted multi-file shell var as one arg; pass explicit filenames to greps.
- linkinator on a static `dist` directory does NOT recurse non-featured /work pages (only homepage-linked featured ones). To exercise the new deep links, crawl a LIVE `astro preview` URL with `--recurse` (`npx astro preview --port N` then `linkinator http://localhost:N/projects --recurse --skip 'joncarlsen.dk'`). All 3 new pages 200.

## Ready for Next Run

- DONE. 3 entries added, all gates PASS (astro check 0/0, build 0, dist leak 0, voice/contact 0, grouping + featured + linkinator verified). Not committed (--auto-commit=false). task_08 (content-gaps) is independent and unaffected.
