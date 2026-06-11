# Task Memory: task_02.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

Relocate ThemeToggle into the header, wire `<Header />` into `Base.astro`, add chrome CSS. Implementation was already present in the working tree on entry (carried with task_01/03 edits); this run produced fresh verification evidence and updated tracking (status was lagging at `pending`).

## Important Decisions

- `scroll-padding-top: 4.5rem` chosen (header ≈ py-3 + size-10 toggle + 1px border ≈ 4rem, with clearance). Lives in `global.css` `@layer base html`.

## Learnings

- Astro emits a small processed `<script>` as an **inline `<script type="module">`** in the HTML (minified, hoisted), not always an external hashed file. This still satisfies "bundled, not `is:inline`" — `is:inline` is left verbatim and keeps no `type`; the processed handler shows `type="module"`. Verified: 0 `is:inline` attrs in output, handler under `<script type="module">`.
- The inline flash guard renders as the **first** `<script>` (no `type`, blocking) → runs before paint. Playwright reload after setting dark showed `.dark` already set with no flash.
- Print correctness proven via Playwright `emulateMedia({media:'print'})`: `#site-header` → display:none, Hero `<header>` (no id) → display:block.

## Files / Surfaces

- `src/components/ThemeToggle.astro` — fixed positioning gone; handler is bundled `<script>`.
- `src/layouts/Base.astro` — `<Header />` first `<body>` child; inline flash guard intact in `<head>`.
- `src/styles/global.css` — print rule `#site-header,#theme-toggle,nav` (id-scoped); `scroll-padding-top:4.5rem`.
- `src/components/Header.astro` — composes one `<ThemeToggle />`.

## Errors / Corrections

- None. Pre-existing favicon.ico 404 console error is unrelated to this task.

## Ready for Next Run

- task_02 complete and verified. No follow-up. Lighthouse budgets remain CI-only (Netlify), not locally runnable.
