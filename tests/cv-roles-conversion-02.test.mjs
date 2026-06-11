// Tests for task 02 — converting the six prose/label components to the cv-* role
// classes from task 01 (Hero, Summary, Approach, Credentials, Expertise,
// Interests).
//
// Two layers, matching the repo's static node:test pattern (mirrors
// cv-roles-conversion-04.test.mjs):
//
//   * Unit (markup + grep): each component references the expected role classes,
//     the recurring duplicated utility strings are gone, and the deliberately
//     inline near-eyebrow labels (text-sm hero title, the font-medium-less Scope
//     and Writing labels) are preserved inline.
//   * Integration (computed-style parity): a static class-expansion guard reads
//     the SHIPPED role layer from global.css and proves each converted element's
//     compiled utility set equals its pre-conversion set (the ADR-002
//     pixel-identical guarantee). This batch is a PURE no-op — no drift elements —
//     so a second integration test asserts byte-identity over the live Playwright
//     before/after measurement on /cv captured in fixtures/cv-roles-computed-02.json.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(path.join(projectRoot, rel), "utf8");

const COMPONENTS = {
  Hero: read("src/components/Hero.astro"),
  Summary: read("src/components/Summary.astro"),
  Approach: read("src/components/Approach.astro"),
  Credentials: read("src/components/Credentials.astro"),
  Expertise: read("src/components/Expertise.astro"),
  Interests: read("src/components/Interests.astro"),
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
// replaced by the utilities it @applies; every other token (layout utilities,
// per-instance colour, plain CSS classes like reveal/link-underline) passes through.
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
// Conversion model: for each converted element, the class string now in markup
// (`after`) and the exact utility string it carried before (`before`). Every
// element in this task is a PURE no-op — expand(after) must equal the before set.
// Each `after` string is also asserted to literally appear in its component, so
// the model cannot silently drift from the source.
//
// Baked-in invariant colour (text-muted on cv-eyebrow) is dropped from markup —
// task 01 baked it into the role; expand() still re-supplies it, so the utility
// set is identical. Per-instance colours (text-fg, text-muted on body/badge) stay
// in markup.
// ---------------------------------------------------------------------------

const ELEMENTS = [
  // Hero — only the two body lines adopt a role; header/h1/title/scope-label stay inline.
  { comp: "Hero", after: "cv-body mt-6 max-w-prose text-fg", before: "mt-6 max-w-prose leading-relaxed text-fg" },
  { comp: "Hero", after: "cv-body mt-1.5 block text-fg", before: "mt-1.5 block leading-relaxed text-fg" },
  // Summary
  { comp: "Summary", after: "reveal cv-section", before: "reveal mx-auto max-w-2xl border-t border-border px-6 py-14" },
  { comp: "Summary", after: "cv-eyebrow", before: "font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted" },
  { comp: "Summary", after: "cv-body mt-8 max-w-prose text-fg", before: "mt-8 max-w-prose leading-relaxed text-fg" },
  // Approach
  { comp: "Approach", after: "reveal cv-section", before: "reveal mx-auto max-w-2xl border-t border-border px-6 py-14" },
  { comp: "Approach", after: "cv-eyebrow", before: "font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted" },
  { comp: "Approach", after: "cv-body mt-8 max-w-prose text-fg", before: "mt-8 max-w-prose leading-relaxed text-fg" },
  { comp: "Approach", after: "cv-body mt-4 space-y-2 text-muted", before: "mt-4 space-y-2 leading-relaxed text-muted" },
  { comp: "Approach", after: "cv-link link-underline text-fg", before: "link-underline text-fg motion-safe:transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" },
  // Credentials
  { comp: "Credentials", after: "reveal cv-section", before: "reveal mx-auto max-w-2xl border-t border-border px-6 py-14" },
  { comp: "Credentials", after: "cv-eyebrow", before: "font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted" },
  { comp: "Credentials", after: "cv-body mt-8 space-y-2 text-muted", before: "mt-8 space-y-2 leading-relaxed text-muted" },
  // Expertise
  { comp: "Expertise", after: "reveal cv-section", before: "reveal mx-auto max-w-2xl border-t border-border px-6 py-14" },
  { comp: "Expertise", after: "cv-eyebrow", before: "font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted" },
  { comp: "Expertise", after: "cv-badge text-muted", before: "rounded-full border border-border px-3 py-1 font-mono text-xs text-muted" },
  // Interests
  { comp: "Interests", after: "reveal cv-section", before: "reveal mx-auto max-w-2xl border-t border-border px-6 py-14" },
  { comp: "Interests", after: "cv-eyebrow", before: "font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted" },
  { comp: "Interests", after: "cv-body mt-8 space-y-2 text-muted", before: "mt-8 space-y-2 leading-relaxed text-muted" },
];

// The recurring duplicated utility strings the role classes replace. None may
// survive verbatim in any of the six converted components. NOTE: the near-eyebrow
// cluster "font-mono text-xs uppercase tracking-[0.2em]" (no font-medium) is
// intentionally NOT forbidden — it matches no role and is kept inline on the Scope
// and Writing labels (same call task 05 made for work/[slug].astro's role-period
// line). Bare "leading-relaxed" must be gone: every body line now carries it via
// cv-body, and no frontmatter/comment in these files mentions it.
const FORBIDDEN_LITERALS = [
  "mx-auto max-w-2xl border-t border-border px-6 py-14",
  "font-mono text-xs font-medium uppercase tracking-[0.2em]",
  "rounded-full border border-border px-3 py-1 font-mono text-xs",
  "hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  "leading-relaxed",
];

// ---------------------------------------------------------------------------
// Unit: markup adopts role classes; duplicated literals are gone.
// ---------------------------------------------------------------------------

test("every converted element's class string is present in its component", () => {
  for (const { comp, after } of ELEMENTS) {
    assert.ok(
      COMPONENTS[comp].includes(`"${after}"`),
      `${comp}: expected class="${after}" in markup`,
    );
  }
});

test("no recurring utility string survives in the six components", () => {
  for (const [name, source] of Object.entries(COMPONENTS)) {
    for (const literal of FORBIDDEN_LITERALS) {
      assert.ok(
        !source.includes(literal),
        `${name} still contains the duplicated utility string "${literal}"`,
      );
    }
  }
});

test("each component references its required role classes", () => {
  const expected = {
    Hero: ["cv-body"],
    Summary: ["cv-section", "cv-eyebrow", "cv-body"],
    Approach: ["cv-section", "cv-eyebrow", "cv-body", "cv-link"],
    Credentials: ["cv-section", "cv-eyebrow", "cv-body"],
    Expertise: ["cv-section", "cv-eyebrow", "cv-badge"],
    Interests: ["cv-section", "cv-eyebrow", "cv-body"],
  };
  for (const [comp, roles] of Object.entries(expected)) {
    for (const role of roles) {
      assert.ok(
        new RegExp(`\\b${role}\\b`).test(COMPONENTS[comp]),
        `${comp}: expected role class ${role}`,
      );
    }
  }
});

// ---------------------------------------------------------------------------
// Unit: deliberately-inline labels stay inline (no role forced where none recurs).
// ---------------------------------------------------------------------------

test("the near-eyebrow labels are preserved inline (no role adopted)", () => {
  // The hero title sits one tier up at text-sm and matches no role.
  assert.match(
    COMPONENTS.Hero,
    /class="mt-3 font-mono text-sm uppercase tracking-\[0\.2em\] text-muted"/,
    "Hero keeps its text-sm title line inline",
  );
  // The Scope and Writing labels are font-medium-less near-eyebrows: adopting
  // cv-eyebrow would add font-medium (weight 400 -> 500), a visible change and a
  // cross-page inconsistency with work/[slug].astro. They stay inline.
  assert.match(
    COMPONENTS.Hero,
    /font-mono text-xs uppercase tracking-\[0\.2em\] text-muted">Scope/,
    "Hero keeps the Scope label inline (no font-medium)",
  );
  assert.match(
    COMPONENTS.Approach,
    /class="mt-10 font-mono text-xs uppercase tracking-\[0\.2em\] text-muted"/,
    "Approach keeps the Writing label inline (no font-medium)",
  );
});

test("Hero keeps its display title and one-off header layout inline", () => {
  assert.match(COMPONENTS.Hero, /<h1 class="font-display text-5xl font-semibold tracking-tight text-fg sm:text-6xl">/, "Hero h1 display tier stays inline");
  assert.match(COMPONENTS.Hero, /<header class="mx-auto max-w-2xl px-6 pt-20 pb-12 sm:pt-28">/, "Hero header keeps its one-off padding (not cv-section)");
});

// ---------------------------------------------------------------------------
// Unit: structure and link attributes preserved.
// ---------------------------------------------------------------------------

test("list/section semantics and the Approach link target survive the conversion", () => {
  assert.match(COMPONENTS.Summary, /aria-labelledby="summary-heading"/, "Summary keeps its labelled section");
  assert.match(COMPONENTS.Credentials, /<ul[\s\S]*<li>/, "Credentials keeps ul/li");
  assert.match(COMPONENTS.Interests, /<ul[\s\S]*interest\.label/, "Interests keeps its list of labels");
  assert.match(COMPONENTS.Expertise, /<ul[\s\S]*<li class="cv-badge text-muted">/, "Expertise renders badge chips");
  assert.match(COMPONENTS.Approach, /target="_blank"/, "Approach writing link keeps target=_blank");
  assert.match(COMPONENTS.Approach, /rel="noopener noreferrer"/, "Approach writing link keeps rel=noopener noreferrer");
});

// ---------------------------------------------------------------------------
// Integration: static class-expansion parity against the SHIPPED role layer.
// ---------------------------------------------------------------------------

test("global.css ships the role classes these components consume", () => {
  for (const role of ["cv-section", "cv-eyebrow", "cv-body", "cv-badge", "cv-link"]) {
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

// ---------------------------------------------------------------------------
// Integration: computed-style parity over the live before/after measurement.
// This batch is a pure no-op: every element is byte-identical before/after.
// ---------------------------------------------------------------------------

const COMPUTED = JSON.parse(read("tests/fixtures/cv-roles-computed-02.json"));

test("task 02 declares no drift elements (pure no-op conversion)", () => {
  assert.deepEqual(COMPUTED.driftElements, [], "task 02 must have zero drift elements");
});

test("computed styles are byte-identical before/after on /cv", () => {
  for (const [key, before] of Object.entries(COMPUTED.before)) {
    const after = COMPUTED.after[key];
    assert.ok(after, `fixture missing after-measurement for ${key}`);
    const changed = Object.keys(before).filter((p) => after[p] !== before[p]);
    assert.deepEqual(changed, [], `${key}: must be byte-identical, changed: ${changed.join(", ")}`);
  }
});

test("the inline near-eyebrow labels measure at weight 400 (not the cv-eyebrow 500 tier)", () => {
  // Proves the inline-preservation decision is real at the pixel level: had they
  // adopted cv-eyebrow they would read font-medium (500). The hero title also
  // stays one size tier up (14px) from the canonical eyebrow (12px).
  assert.equal(COMPUTED.after.hero_scopeLabel.fontWeight, "400", "Scope label is not font-medium");
  assert.equal(COMPUTED.after.approach_writingLabel.fontWeight, "400", "Writing label is not font-medium");
  assert.equal(COMPUTED.after.hero_title.fontSize, "14px", "hero title stays at text-sm");
  assert.equal(COMPUTED.after.summary_eyebrow.fontWeight, "500", "canonical eyebrow is font-medium for contrast");
});
