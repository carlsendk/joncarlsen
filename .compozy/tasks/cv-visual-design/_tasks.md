# CV Site Visual Redesign — "Editorial Refined" — Task List

## Tasks

| # | Title | Status | Complexity | Dependencies |
|---|-------|--------|------------|--------------|
| 01 | Establish CSS design-token foundation and dark variant in `global.css` | completed | medium | — |
| 02 | Self-host and subset Fraunces + JetBrains Mono; wire `@font-face` and preload | completed | medium | task_01 |
| 03 | Add theme-flash guard and token-based body in `Base.astro` | completed | low | task_01, task_02 |
| 04 | Build accessible `ThemeToggle.astro` (persisted, keyboard-operable) | completed | medium | task_03 |
| 05 | Restyle the four sections to the token and type system | completed | medium | task_01, task_02 |
| 06 | Add CSS-only film-grain overlay | completed | low | task_01 |
| 07 | Add reduced-motion-gated micro-interactions | completed | medium | task_05 |
| 08 | Cross-theme a11y/perf hardening and launch verification | completed | medium | task_04, task_05, task_06, task_07 |
