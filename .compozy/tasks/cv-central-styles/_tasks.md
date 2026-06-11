# Central Style System — Task List

## Tasks

| # | Title | Status | Complexity | Dependencies |
|---|-------|--------|------------|--------------|
| 01 | Define role-class layer in global.css and collapse drift to canonical values | completed | medium | — |
| 02 | Convert prose and label components to role classes | completed | medium | task_01 |
| 03 | Convert entry and list components to role classes | completed | medium | task_01 |
| 04 | Convert card, impact and link components plus index pages | completed | medium | task_01 |
| 05 | Convert case-study detail layout and remaining pages | completed | medium | task_01 |
| 06 | Add ESLint toolchain with stock Tailwind plugin | completed | medium | task_01 |
| 07 | Add custom canonical-scale ESLint rule | completed | medium | task_06 |
| 08 | Wire lint into the build gate and verify no regression site-wide | pending | medium | task_02, task_03, task_04, task_05, task_07 |
| 09 | Write the style spec | pending | low | task_01 |
