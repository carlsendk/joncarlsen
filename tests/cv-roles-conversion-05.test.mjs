// Tests for task 05 — converting the case-study detail layout and the remaining
// page-level files to the cv-* role classes from task 01 (work/[slug].astro,
// index.astro, and the orphaned shared Header.astro where the nav links now
// live). cv.astro + Base.astro are composition-only (no role utilities in markup)
// and ThemeToggle is a one-off control, so none is edited.
//
// Two layers, matching the repo's static node:test pattern (mirrors
// cv-roles-conversion.test.mjs / -04):
//
//   * Unit (markup + grep): each surface references the expected role classes,
//     the recurring duplicated utility strings are gone, the off-scale h1 drift is
//     cleared, and link target/structural attributes are preserved.
//   * Integration (computed-style parity): a static class-expansion guard reads the
//     SHIPPED role layer from global.css and proves each converted element's
//     compiled utility set equals its pre-conversion set (the ADR-002
//     pixel-identical guarantee). One drift element — the case-study h1 — collapses
//     from the off-scale display tier (text-4xl/sm:text-5xl) to the canonical
//     display tier (text-5xl/sm:text-6xl); the live Playwright before/after
//     measurement in fixtures/cv-roles-computed-05.json proves every other element
//     is byte-identical and the article body still reads at the canonical 16px.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(path.join(projectRoot, rel), "utf8");

const SURFACES = {
  Slug: read("src/pages/work/[slug].astro"),
  Index: read("src/pages/index.astro"),
  Header: read("src/components/Header.astro"),
  // Reviewed-but-unchanged shells, asserted to stay composition-only.
  Cv: read("src/pages/cv.astro"),
  Base: read("src/layouts/Base.astro"),
  ThemeToggle: read("src/components/ThemeToggle.astro"),
};

// ---------------------------------------------------------------------------
// Role-layer parsing (same brace-match convention as cv-roles-conversion.test.mjs).
// ---------------------------------------------------------------------------

function layerComponentsBody(source) {
  const at = source.indexOf("@layer components");
  if (at === -1) return "";
  const open = source.indexOf("{", at);
  if (open === -1) return "";
  let depth = 0;
  for (let i = open; i < source.length; i++) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}") {
      depth--;
      if (depth === 0) return source.slice(open + 1, i);
    }
  }
  return "";
}

// role name -> Set of @apply'd utility tokens, read from the shipped global.css.
function shippedRoleUtilities() {
  const body = layerComponentsBody(read("src/styles/global.css"));
  const roles = new Map();
  const re = /\.(cv-[a-z-]+)\s*\{\s*@apply\s+([^;]+);/g;
  let m;
  while ((m = re.exec(body)) !== null) {
    roles.set(m[1], new Set(m[2].trim().split(/\s+/)));
  }
  return roles;
}

const ROLE_UTILS = shippedRoleUtilities();

// Expand a markup class string into its compiled utility SET: every cv-* token is
// replaced by the utilities it @applies; every other token (layout, per-instance
// colour, plain CSS classes like reveal/link-underline, arbitrary [&_…] variants)
// passes through.
function expand(classString) {
  const out = new Set();
  for (const token of classString.trim().split(/\s+/)) {
    if (token.startsWith("cv-") && ROLE_UTILS.has(token)) {
      for (const u of ROLE_UTILS.get(token)) out.add(u);
    } else {
      out.add(token);
    }
  }
  return out;
}

const setEq = (a, b) => a.size === b.size && [...a].every((x) => b.has(x));

// ---------------------------------------------------------------------------
// Conversion model. Every element here is a PURE no-op — expand(after) must equal
// the before set. The one drift element (the case-study h1) is NOT a role
// expansion (the display tier stays inline, no cv-display role), so it is asserted
// separately against the computed-style fixture below.
//
// Baked-in invariant colours are not relevant here; the per-instance text-muted on
// cv-badge stays in markup. cv-link only @applies the interaction cluster
// (transition-colors + hover:text-accent + focus ring) that all three converted
// nav links already carried, so adopting it is byte-identical.
// ---------------------------------------------------------------------------

const ELEMENTS = [
  {
    comp: "Slug",
    after: "cv-badge text-muted",
    before: "rounded-full border border-border px-3 py-1 font-mono text-xs text-muted",
  },
  {
    comp: "Slug",
    after: "prose-cv cv-body mt-10 text-muted [&_h2]:mt-8 [&_h2]:font-mono [&_h2]:text-xs [&_h2]:font-medium [&_h2]:uppercase [&_h2]:tracking-[0.2em] [&_h2]:text-muted [&_p]:mt-4 [&_p]:text-fg",
    before: "prose-cv mt-10 leading-relaxed text-muted [&_h2]:mt-8 [&_h2]:font-mono [&_h2]:text-xs [&_h2]:font-medium [&_h2]:uppercase [&_h2]:tracking-[0.2em] [&_h2]:text-muted [&_p]:mt-4 [&_p]:text-fg",
  },
  {
    comp: "Index",
    after: "cv-pill-solid",
    before: "inline-flex items-center rounded-full bg-accent px-5 py-2.5 font-mono text-sm font-medium text-bg motion-safe:transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  },
  {
    comp: "Header",
    after: "cv-link link-underline shrink-0 font-mono text-xs uppercase tracking-wider text-muted",
    before: "link-underline shrink-0 font-mono text-xs uppercase tracking-wider text-muted motion-safe:transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  },
  {
    comp: "Header",
    after: "cv-link inline-flex size-9 items-center justify-center rounded-full text-muted hover:bg-fg/5",
    before: "inline-flex size-9 items-center justify-center rounded-full text-muted motion-safe:transition-colors hover:bg-fg/5 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  },
];

// The canonical display tier the case-study h1 collapses to — byte-identical to
// the /work and /impact page h1s. Stays inline (there is no cv-display role).
const CANONICAL_H1 = "font-display text-5xl font-semibold tracking-tight text-fg sm:text-6xl";
const OFFSCALE_H1 = "font-display text-4xl font-semibold tracking-tight text-fg sm:text-5xl";

// Recurring duplicated utility strings the role classes replace. None may survive
// in the three converted surfaces. NOTE: the meta cluster
// "font-mono text-xs uppercase tracking-wider" is intentionally NOT forbidden —
// the Header back-link is a cv-link CTA that keeps that typography inline. The
// "tracking-[0.2em]" cluster is also NOT forbidden — the case-study role·period
// line and the [&_h2] prose rule deliberately keep it.
const FORBIDDEN_LITERALS = [
  "rounded-full border border-border px-3 py-1 font-mono text-xs",
  "inline-flex items-center rounded-full bg-accent px-5 py-2.5 font-mono text-sm font-medium text-bg",
  "hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
];

// ---------------------------------------------------------------------------
// Unit: markup adopts role classes; duplicated literals and the off-scale h1 gone.
// ---------------------------------------------------------------------------

test("every converted element's class string is present in its surface", () => {
  for (const { comp, after } of ELEMENTS) {
    assert.ok(
      SURFACES[comp].includes(`"${after}"`),
      `${comp}: expected class="${after}" in markup`,
    );
  }
});

test("the case-study h1 collapses to the canonical display tier (off-scale text-4xl gone)", () => {
  assert.ok(SURFACES.Slug.includes(`"${CANONICAL_H1}"`), "h1 must use the canonical text-5xl/sm:text-6xl tier");
  assert.ok(!SURFACES.Slug.includes(OFFSCALE_H1), "the off-scale text-4xl/sm:text-5xl h1 string must be gone");
  assert.ok(!/\btext-4xl\b/.test(SURFACES.Slug), "no text-4xl token may remain in work/[slug].astro");
});

test("no recurring utility string survives in the three converted surfaces", () => {
  for (const name of ["Slug", "Index", "Header"]) {
    for (const literal of FORBIDDEN_LITERALS) {
      assert.ok(
        !SURFACES[name].includes(literal),
        `${name} still contains the duplicated utility string "${literal}"`,
      );
    }
  }
});

test("each converted surface references its required role classes", () => {
  const expected = {
    Slug: ["cv-badge", "cv-body"],
    Index: ["cv-pill-solid"],
    Header: ["cv-link"],
  };
  for (const [comp, roles] of Object.entries(expected)) {
    for (const role of roles) {
      assert.ok(
        new RegExp(`\\b${role}\\b`).test(SURFACES[comp]),
        `${comp}: expected role class ${role}`,
      );
    }
  }
});

// ---------------------------------------------------------------------------
// Unit: composition-only shells stay free of role utilities and one-off controls
// keep their inline styling (scope discipline — no role forced where none recurs).
// ---------------------------------------------------------------------------

test("cv.astro and Base.astro carry no role classes (composition-only shells)", () => {
  for (const name of ["Cv", "Base"]) {
    assert.ok(!/\bcv-[a-z]/.test(SURFACES[name]), `${name} should remain composition-only (no cv-* role classes)`);
  }
});

test("ThemeToggle keeps its one-off control styling inline (no role adopted)", () => {
  assert.ok(!/\bcv-[a-z]/.test(SURFACES.ThemeToggle), "ThemeToggle must not adopt a role class");
  assert.match(SURFACES.ThemeToggle, /rounded-full border border-border/, "ThemeToggle keeps its bordered control styling inline");
});

// ---------------------------------------------------------------------------
// Unit: link target/structural attributes preserved through the conversion.
// ---------------------------------------------------------------------------

test("Header nav link target attributes and the contextual back-link survive", () => {
  assert.match(SURFACES.Header, /target="_blank"/, "Header keeps target=_blank for the profile links");
  assert.match(SURFACES.Header, /rel="noopener noreferrer"/, "Header keeps rel=noopener noreferrer");
  assert.match(SURFACES.Header, /href=\{back\.href\}/, "Header keeps the contextual back-link href");
  assert.match(SURFACES.Header, /aria-label=\{link\.label\}/, "Header keeps the icon-link aria-labels");
});

test("the case-study deep page keeps its content slot, header and metrics structure", () => {
  assert.match(SURFACES.Slug, /<Content \/>/, "article still renders the rendered markdown body");
  assert.match(SURFACES.Slug, /metrics\.length > 0/, "metrics list is still conditionally rendered");
  // The role·period meta line is deliberately left inline (matches no role; its
  // tracking-[0.2em] is documented page language, not drift).
  assert.match(SURFACES.Slug, /tracking-\[0\.2em\] text-muted">\{role\}/, "role·period meta line preserved inline");
});

// ---------------------------------------------------------------------------
// Integration: static class-expansion parity against the SHIPPED role layer.
// ---------------------------------------------------------------------------

test("global.css ships the role classes these surfaces consume", () => {
  for (const role of ["cv-body", "cv-badge", "cv-pill-solid", "cv-link"]) {
    assert.ok(ROLE_UTILS.has(role), `global.css missing @apply role ${role}`);
  }
});

test("every converted element expands to exactly its pre-conversion utility set", () => {
  for (const { comp, after, before } of ELEMENTS) {
    const got = expand(after);
    const want = new Set(before.trim().split(/\s+/));
    assert.ok(
      setEq(got, want),
      `${comp} "${after}": expanded {${[...got].sort()}} != baseline {${[...want].sort()}}`,
    );
  }
});

test("cv-link only adds the interaction cluster the nav links already carried", () => {
  for (const u of ["motion-safe:transition-colors", "hover:text-accent", "focus-visible:outline-2", "focus-visible:outline-offset-2", "focus-visible:outline-accent"]) {
    assert.ok(ROLE_UTILS.get("cv-link").has(u), `cv-link must @apply ${u}`);
  }
});

// ---------------------------------------------------------------------------
// Integration: computed-style parity over the live before/after measurement.
// Pure no-op everywhere except the documented h1 drift; the article body still
// reads at the canonical 16px.
// ---------------------------------------------------------------------------

const COMPUTED = JSON.parse(read("tests/fixtures/cv-roles-computed-05.json"));

test("task 05 declares exactly one drift element (the case-study h1)", () => {
  assert.deepEqual(COMPUTED.driftElements, ["cs_h1"], "task 05 must declare only cs_h1 as drift");
});

test("computed styles are identical before/after except the documented h1 drift", () => {
  const drift = new Set(COMPUTED.driftElements);
  for (const [key, before] of Object.entries(COMPUTED.before)) {
    const after = COMPUTED.after[key];
    assert.ok(after, `fixture missing after-measurement for ${key}`);
    const changed = Object.keys(before).filter((p) => after[p] !== before[p]);
    if (drift.has(key)) {
      // The display-tier collapse moves font-size, line-height (rides the size) and
      // the tracking-tight letter-spacing (proportional to the larger size).
      assert.deepEqual(
        changed.sort(),
        [...COMPUTED.driftProps[key]].sort(),
        `${key}: drift element may only change ${COMPUTED.driftProps[key].join(", ")}`,
      );
    } else {
      assert.deepEqual(changed, [], `${key}: non-drift element must be byte-identical`);
    }
  }
});

test("the case-study h1 lands on the canonical display tier shared with the page h1s", () => {
  const h1 = COMPUTED.after.cs_h1;
  assert.match(h1.fontFamily, /^Fraunces/, "h1 uses the Fraunces display face");
  assert.equal(h1.fontSize, "60px", "h1 is text-6xl (60px) at the sm+ viewport");
  assert.equal(h1.fontWeight, "600", "h1 stays font-semibold");
  // The off-scale starting point must really have been off-scale (the drift is real).
  assert.equal(COMPUTED.before.cs_h1.fontSize, "48px", "h1 started at the off-scale text-5xl (48px) tier");
});

test("the case-study article body renders at the canonical cv-body size (16px, leading-relaxed)", () => {
  for (const key of ["cs_body", "cs_p"]) {
    const m = COMPUTED.after[key];
    assert.equal(m.fontSize, "16px", `${key}: article body is the canonical 16px`);
    assert.equal(m.lineHeight, "26px", `${key}: article body keeps cv-body leading-relaxed (26px)`);
    assert.match(m.fontFamily, /Hanken Grotesk/, `${key}: article body uses the body face`);
    // Already 16px at HEAD — binding cv-body is computed-identical (no size regression).
    assert.equal(COMPUTED.before[key].fontSize, "16px", `${key}: body was already 16px before conversion`);
  }
});

test("the article h2 prose rule (structural) keeps its eyebrow-tier styling inline", () => {
  // The conversion preserves the [&_h2] structural concerns the task calls out.
  for (const cls of ["[&_h2]:mt-8", "[&_h2]:font-mono", "[&_h2]:text-xs", "[&_h2]:tracking-[0.2em]", "[&_p]:mt-4", "[&_p]:text-fg"]) {
    assert.ok(SURFACES.Slug.includes(cls), `article body keeps the structural rule ${cls}`);
  }
});
