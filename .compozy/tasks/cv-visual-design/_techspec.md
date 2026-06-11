# TechSpec: CV Site Visual Redesign — "Editorial Refined"

## Executive Summary

This is a **presentation-layer-only** redesign of the existing one-page Astro +
Tailwind 4 CV site. No content model, routing, or data flow changes — `src/data/cv.ts`
and the page composition stay as-is. The work introduces a **semantic design-token
system in CSS** (driving light/dark), **two self-hosted subset webfonts** (Fraunces
display + JetBrains Mono), a **CSS-only film-grain layer**, and **CSS-first
micro-interactions**, with a single tiny inline theme script as the only client JS.

**Primary trade-off:** we accept a small amount of added complexity (hand-maintained
two-theme token tables, committed `woff2` files, one inline `<head>` script) and a
font-load cost in exchange for a distinctive, cohesive editorial identity — while
holding the near-zero-JS posture and the Lighthouse perf/a11y budgets. Theming and
dark mode live in **CSS via Tailwind v4 `@custom-variant` / `@theme inline`** (no JS
config), and animations are **CSS-only** (scroll-driven where supported, gated on
`prefers-reduced-motion`) so the JS surface does not grow beyond the toggle.

## System Architecture

### Component Overview

All components already exist; this redesign re-skins them through a shared token
layer. No new components except the theme toggle.

- **`src/styles/global.css`** *(heavily extended)* — the design system: `@font-face`
  declarations, `:root`/`.dark` semantic tokens, `@theme inline` token→utility
  mapping, `@custom-variant dark`, the grain overlay, base typographic rules, and
  reduced-motion-gated animation utilities. This is the single source of visual truth.
- **`src/layouts/Base.astro`** *(modified)* — adds font `<link rel="preload">`s, the
  `is:inline` theme-flash-guard script in `<head>`, and switches `<body>` from
  hard-coded `bg-white text-slate-900` to semantic token utilities (`bg-bg text-fg`).
- **`src/components/ThemeToggle.astro`** *(new)* — the accessible light/dark toggle
  button (the page's only interactive control beyond links). Vanilla inline handler;
  no framework island.
- **`src/components/{Hero,Timeline,Impact,Links}.astro`** *(modified)* — restyled to
  the token system and the Fraunces/JetBrains-Mono type scale; structure and props
  unchanged.
- **`public/fonts/`** *(new)* — committed subset `woff2` files.

**Data flow:** unchanged. `cv.ts` → `index.astro` props → components. The redesign
only changes the classes/markup-presentation those components emit and the CSS they
resolve against.

## Implementation Design

### Core Interfaces

The primary contract every component depends on is the **semantic token set**
(Tailwind v4, CSS-driven). Components reference `*-fg`, `*-bg`, `*-accent`,
`*-muted`, `font-display`, `font-mono` — never raw `slate-*` — so a theme switch is
a single class flip on `<html>`:

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

:root {                      /* light */
  --bg: #ffffff;  --fg: #0f172a;  --muted: #475569;
  --accent: #1d4ed8;         /* cobalt, AA on white */
  --border: #e2e8f0;
}
.dark {                      /* soft near-black, not pure black */
  --bg: #0f1115;  --fg: #e7e7ea;  --muted: #a1a1aa;
  --accent: #60a5fa;         /* lightened cobalt, AA on dark */
  --border: #26262b;
}
@theme inline {
  --color-bg: var(--bg);     --color-fg: var(--fg);
  --color-accent: var(--accent); --color-muted: var(--muted);
  --color-border: var(--border);
  --font-display: "Fraunces", Georgia, serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
```

The **theme-flash guard** (the only blocking JS), inlined in `<head>` so it runs
before first paint:

```html
<script is:inline>
  const t = localStorage.getItem("theme")
    ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.classList.toggle("dark", t === "dark");
</script>
```

The **toggle** writes `localStorage.theme` and flips `.dark` on click; it reflects
state via `aria-pressed` and is fully keyboard-operable.

### Data Models

No new data model. `CvData` and its sub-types (`Role`, `Highlight`, `ProfileLink`)
in `src/data/cv.ts` are unchanged. The only "model" introduced is the CSS token set
above, which is presentation state, not content.

### API Endpoints

Not applicable — static, single-page, no server or client API.

## Integration Points

- **Netlify build + Lighthouse gate** (cv-site ADR-007): the existing `netlify.toml`
  pipeline (`astro check && astro build && linkinator`, `@netlify/plugin-lighthouse`
  perf≥0.9 / a11y≥0.95) continues to gate deploys. New fonts/CSS must keep it green.
  The Lighthouse plugin scores the **default-rendered theme only**; dark-theme +
  text-over-grain contrast are verified out-of-band (see Testing).
- **No third-party runtime integrations** — fonts are self-hosted (ADR-002); the
  no-tracking stance holds.

## Impact Analysis

| Component | Impact Type | Description and Risk | Required Action |
|-----------|-------------|----------------------|-----------------|
| `src/styles/global.css` | modified (major) | Becomes the design system (tokens, fonts, grain, motion). Risk: contrast/perf regressions. | Build token layer; verify AA both themes + Lighthouse. |
| `src/layouts/Base.astro` | modified | Font preloads, inline theme script, token body classes. Risk: theme flash, FOUT. | Add `is:inline` guard + preloads; test no-flash. |
| `ThemeToggle.astro` | new | Only interactive control beyond links. Risk: a11y/keyboard. | Build accessible button; keyboard + `aria-pressed` test. |
| `Hero/Timeline/Impact/Links.astro` | modified | Restyle to tokens + type scale; structure/props unchanged. | Re-skin; confirm content contract still holds. |
| `public/fonts/*.woff2` | new | Committed subset fonts. Risk: weight bloat. | Subset to Latin + used weights; re-check budget. |
| `src/data/cv.ts`, `index.astro` props | unchanged | — | None. |

## Testing Approach

### Unit Tests

- **Content contract intact:** re-run the existing dist-HTML assertion suite (heading
  IDs, metric-before-summary order, external-link `rel`, conditional PDF button) after
  restyle — markup contract must not regress.
- **Token usage:** assert components emit semantic classes (`text-fg`/`bg-bg`/
  `text-accent`), not hard-coded `slate-*`, so theming is complete.
- **Toggle behavior:** button toggles `.dark` on `<html>`, persists to `localStorage`,
  restores on reload, exposes `aria-pressed`, and is reachable/operable by keyboard.
- **No-flash guard:** `<head>` inline script sets the class before first paint (verify
  dark loads dark with no white flash).

### Integration Tests

- **Both themes verified, not just one:** run **Lighthouse twice** (light and forced
  `.dark`), each meeting perf ≥ 90 / a11y ≥ 95.
- **AA contrast over grain, both themes:** verify fg/muted/accent against bg *with the
  grain overlay composited* (axe/manual sampling) in light and dark — closes the gate's
  single-theme blind spot.
- **Reduced-motion:** with `prefers-reduced-motion: reduce`, reveal/underline/theme-
  transition animations are suppressed (content fully visible, no movement).
- **Mobile reflow:** no horizontal overflow at 320–414px; hero clear above the fold.
- **Build gate green:** `astro check` + `astro build` + `linkinator` + Lighthouse
  plugin pass in CI.

## Development Sequencing

### Build Order

1. **Token + dark-variant foundation in `global.css`** — `@custom-variant`,
   `:root`/`.dark` tokens, `@theme inline` mapping. No dependencies.
2. **Self-host fonts** — subset Fraunces + JetBrains Mono into `public/fonts/`, add
   `@font-face` + preloads. Depends on step 1 (registers `--font-*` tokens).
3. **Theme-flash guard + token body in `Base.astro`** — inline `<head>` script,
   preloads, `bg-bg text-fg`. Depends on steps 1, 2.
4. **`ThemeToggle.astro`** — accessible button + persistence; mount in layout/hero.
   Depends on step 3 (relies on the class/localStorage contract).
5. **Restyle sections** — Hero (display type), Timeline, Impact (metric-forward),
   Links — to the token + type system. Depends on steps 1, 2.
6. **Film-grain overlay** — CSS-only SVG-noise layer site-wide. Depends on step 1.
7. **CSS micro-interactions** — reveal-on-scroll (scroll-driven, progressively
   enhanced), animated underlines, hover/theme transitions, all
   `prefers-reduced-motion`-gated. Depends on step 5.
8. **Verify** — content-contract suite, dual-theme Lighthouse, AA-over-grain,
   reduced-motion, mobile reflow. Depends on steps 1–7.

### Technical Dependencies

- Subset `woff2` files for the two faces (generated locally; committed).
- Confirm Tailwind v4 `@theme inline` + `@custom-variant` resolve through the
  project's PostCSS pipeline (no Vite-plugin path).

## Monitoring and Observability

No runtime telemetry (no-tracking stance). Operational visibility is the **Netlify
Lighthouse gate** (perf/a11y thresholds block deploy) plus the owner's qualitative
review (premium/senior read, dark-mode intentionality). Build logs surface font/CSS
size; watch the CSS-size budget step.

## Technical Considerations

### Key Decisions

- **CSS-driven theming (Tailwind v4), not JS config** — v4 here runs via PostCSS with
  no config file; `@custom-variant` + `@theme inline` is the idiomatic path.
  Trade-off: tokens are hand-maintained per theme. (ADR-003)
- **Self-hosted subset fonts** — privacy + perf + control over a CDN. Trade-off:
  committed font files to maintain. (ADR-002)
- **CSS-only animation** — keeps the JS surface at just the toggle; scroll-driven CSS
  with graceful no-op fallback. Trade-off: scroll-driven timelines aren't universal,
  so reveals must be progressive (content visible without them).
- **CSS-only grain via SVG data URI** — zero extra requests, no contrast shift.
  (ADR-004)

### Known Risks

- **Single accent fails AA on one theme** (high likelihood if unmanaged) → per-theme
  accent pair, both verified. (ADR-003)
- **Font weight regresses perf** (medium) → subset to Latin + used weights, preload
  only above-fold faces, re-run Lighthouse.
- **Theme flash / wrong initial theme** (medium) → blocking `is:inline` guard before
  paint.
- **Over-polish reads gimmicky** (low–medium) → restraint; subtle motion; senior-tone
  review pass.
- **Grain harms contrast** (low) → cap opacity ~3–5%; verify AA composited over grain.

## Architecture Decision Records

- [ADR-001: "Editorial refined" visual direction via a full disciplined refresh](adrs/adr-001.md) — editorial type + single cobalt accent + texture + light/dark + quiet motion; alternatives rejected.
- [ADR-002: Self-hosted subset webfonts (Fraunces + JetBrains Mono), system-sans body](adrs/adr-002.md) — self-host over CDN for privacy/perf; body on system stack.
- [ADR-003: Class-based theming with per-theme accent tokens and an inline flash-guard](adrs/adr-003.md) — Tailwind v4 `@custom-variant`, semantic tokens, AA accent pair, inline no-flash script as the only JS.
- [ADR-004: CSS-only faint film-grain texture (no image assets)](adrs/adr-004.md) — inline SVG-noise overlay at low opacity; no requests, no contrast shift.
