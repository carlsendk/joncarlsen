// Tests for task 04 — converting the card/impact/link components and the two
// index pages to the cv-* role classes from task 01 (CaseStudies, CaseStudyCard,
// Impact, Links + src/pages/impact.astro and src/pages/work/index.astro).
//
// Two layers, matching the repo's static node:test pattern (mirrors
// cv-roles-conversion.test.mjs for task 03):
//
//   * Unit (markup + grep): each surface references the expected role classes,
//     the recurring duplicated utility strings are gone, list/link semantics and
//     link target attributes are preserved.
//   * Integration (computed-style parity): a static class-expansion guard reads
//     the SHIPPED role layer from global.css and proves each converted element's
//     compiled utility set equals its pre-conversion set (the ADR-002
//     pixel-identical guarantee). Unlike task 03 this batch is a PURE no-op — no
//     drift elements — so a second integration test asserts byte-identity over the
//     live Playwright before/after measurement on /cv, /impact and /work captured
//     in fixtures/cv-roles-computed-04.json, plus the Links pb-24 (96px).

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(path.join(projectRoot, rel), "utf8");

const SURFACES = {
  CaseStudies: read("src/components/CaseStudies.astro"),
  CaseStudyCard: read("src/components/CaseStudyCard.astro"),
  Impact: read("src/components/Impact.astro"),
  Links: read("src/components/Links.astro"),
  ImpactPage: read("src/pages/impact.astro"),
  WorkIndex: read("src/pages/work/index.astro"),
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
// Each `after` string is also asserted to literally appear in its surface, so the
// model cannot silently drift from the source.
//
// Baked-in invariant colours (text-accent on cv-metric, text-bg on cv-pill-solid,
// text-muted on cv-eyebrow/cv-meta) are dropped from markup — task 01 baked them
// into the role; expand() still re-supplies them, so the utility set is identical.
// Per-instance colours (text-fg, text-muted on body/badge/pill) stay in markup.
// ---------------------------------------------------------------------------

const ELEMENTS = [
  // CaseStudies
  { comp: "CaseStudies", after: "reveal cv-section", before: "reveal mx-auto max-w-2xl border-t border-border px-6 py-14" },
  { comp: "CaseStudies", after: "cv-eyebrow", before: "font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted" },
  { comp: "CaseStudies", after: "cv-link link-underline mt-8 inline-flex font-mono text-xs uppercase tracking-wider text-muted", before: "link-underline mt-8 inline-flex font-mono text-xs uppercase tracking-wider text-muted motion-safe:transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" },
  // CaseStudyCard
  { comp: "CaseStudyCard", after: "cv-card", before: "block rounded-2xl border border-border p-5 motion-safe:transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" },
  { comp: "CaseStudyCard", after: "cv-entry-title text-fg", before: "font-display text-xl font-semibold tracking-tight text-fg" },
  { comp: "CaseStudyCard", after: "cv-meta mt-1", before: "mt-1 font-mono text-xs uppercase tracking-wider text-muted" },
  { comp: "CaseStudyCard", after: "cv-body mt-3 text-muted", before: "mt-3 leading-relaxed text-muted" },
  { comp: "CaseStudyCard", after: "cv-badge text-muted", before: "rounded-full border border-border px-3 py-1 font-mono text-xs text-muted" },
  // Impact
  { comp: "Impact", after: "reveal cv-section", before: "reveal mx-auto max-w-2xl border-t border-border px-6 py-14" },
  { comp: "Impact", after: "cv-eyebrow", before: "font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted" },
  { comp: "Impact", after: "cv-metric", before: "font-display text-2xl font-semibold tracking-tight text-accent sm:text-3xl" },
  { comp: "Impact", after: "cv-meta mt-2 motion-safe:transition-colors group-hover:text-accent", before: "mt-2 font-mono text-xs uppercase tracking-wider text-muted motion-safe:transition-colors group-hover:text-accent" },
  { comp: "Impact", after: "cv-link link-underline mt-10 inline-block font-mono text-xs uppercase tracking-wider text-muted", before: "link-underline mt-10 inline-block font-mono text-xs uppercase tracking-wider text-muted motion-safe:transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" },
  // Links
  { comp: "Links", after: "reveal cv-section pb-24", before: "reveal mx-auto max-w-2xl border-t border-border px-6 py-14 pb-24" },
  { comp: "Links", after: "cv-eyebrow", before: "font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted" },
  { comp: "Links", after: "cv-pill text-fg", before: "inline-flex items-center rounded-full border border-border px-4 py-2 font-mono text-sm text-fg motion-safe:transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" },
  { comp: "Links", after: "cv-pill-solid", before: "inline-flex items-center rounded-full bg-accent px-5 py-2.5 font-mono text-sm font-medium text-bg motion-safe:transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" },
  // impact.astro page
  { comp: "ImpactPage", after: "cv-body mt-6 max-w-prose text-muted", before: "mt-6 max-w-prose leading-relaxed text-muted" },
  { comp: "ImpactPage", after: "reveal cv-section", before: "reveal mx-auto max-w-2xl border-t border-border px-6 py-14" },
  { comp: "ImpactPage", after: "cv-eyebrow", before: "font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted" },
  { comp: "ImpactPage", after: "cv-metric", before: "font-display text-2xl font-semibold tracking-tight text-accent sm:text-3xl" },
  { comp: "ImpactPage", after: "cv-meta mt-2 motion-safe:transition-colors group-hover:text-accent", before: "mt-2 font-mono text-xs uppercase tracking-wider text-muted motion-safe:transition-colors group-hover:text-accent" },
  { comp: "ImpactPage", after: "cv-section", before: "mx-auto max-w-2xl border-t border-border px-6 py-14" },
  { comp: "ImpactPage", after: "cv-body text-muted", before: "leading-relaxed text-muted" },
  // work/index.astro page
  { comp: "WorkIndex", after: "cv-body mt-6 max-w-prose text-muted", before: "mt-6 max-w-prose leading-relaxed text-muted" },
  { comp: "WorkIndex", after: "reveal cv-section", before: "reveal mx-auto max-w-2xl border-t border-border px-6 py-14" },
  { comp: "WorkIndex", after: "cv-eyebrow", before: "font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted" },
  { comp: "WorkIndex", after: "cv-section", before: "mx-auto max-w-2xl border-t border-border px-6 py-14" },
  { comp: "WorkIndex", after: "cv-body text-muted", before: "leading-relaxed text-muted" },
];

// The recurring duplicated utility strings the role classes replace. None may
// survive verbatim in any of the six converted surfaces. NOTE: the meta-typography
// cluster "font-mono text-xs uppercase tracking-wider" is intentionally NOT
// forbidden — task 01 maps the "See all" CTA links to cv-link (not cv-meta), so
// they legitimately keep that typography inline beside cv-link.
const FORBIDDEN_LITERALS = [
  "mx-auto max-w-2xl border-t border-border px-6 py-14",
  "font-mono text-xs font-medium uppercase tracking-[0.2em]",
  "font-display text-xl font-semibold tracking-tight",
  "font-display text-2xl font-semibold tracking-tight text-accent",
  "block rounded-2xl border border-border p-5",
  "inline-flex items-center rounded-full border border-border px-4 py-2 font-mono text-sm",
  "inline-flex items-center rounded-full bg-accent px-5 py-2.5 font-mono text-sm font-medium text-bg",
  "rounded-full border border-border px-3 py-1 font-mono text-xs",
  "hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
];

// ---------------------------------------------------------------------------
// Unit: markup adopts role classes; duplicated literals are gone.
// ---------------------------------------------------------------------------

test("every converted element's class string is present in its surface", () => {
  for (const { comp, after } of ELEMENTS) {
    assert.ok(
      SURFACES[comp].includes(`"${after}"`),
      `${comp}: expected class="${after}" in markup`,
    );
  }
});

test("no recurring utility string survives in the six surfaces", () => {
  for (const [name, source] of Object.entries(SURFACES)) {
    for (const literal of FORBIDDEN_LITERALS) {
      assert.ok(
        !source.includes(literal),
        `${name} still contains the duplicated utility string "${literal}"`,
      );
    }
  }
});

test("each surface references its required role classes", () => {
  const expected = {
    CaseStudies: ["cv-section", "cv-eyebrow", "cv-link"],
    CaseStudyCard: ["cv-card", "cv-entry-title", "cv-meta", "cv-body", "cv-badge"],
    Impact: ["cv-section", "cv-eyebrow", "cv-metric", "cv-meta", "cv-link"],
    Links: ["cv-section", "cv-eyebrow", "cv-pill", "cv-pill-solid"],
    ImpactPage: ["cv-section", "cv-eyebrow", "cv-metric", "cv-meta", "cv-body"],
    WorkIndex: ["cv-section", "cv-eyebrow", "cv-body"],
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
// Unit: link target attributes, hrefs and focus/hover behaviour preserved.
// ---------------------------------------------------------------------------

test("link target attributes and download survive the conversion", () => {
  // Links.astro keeps its external-link target/rel spread and résumé download.
  assert.match(SURFACES.Links, /target:\s*"_blank"/, "Links keeps target=_blank for external links");
  assert.match(SURFACES.Links, /rel:\s*"noopener noreferrer"/, "Links keeps rel=noopener noreferrer");
  assert.match(SURFACES.Links, /\bdownload\b/, "Links keeps the résumé download attribute");
});

test("deep-link hrefs to /work/<slug> and the index CTAs are preserved", () => {
  assert.match(SURFACES.CaseStudyCard, /href=\{`\/work\/\$\{entry\.id\}`\}/, "card links to /work/<id>");
  assert.match(SURFACES.Impact, /href=\{`\/work\/\$\{item\.slug\}`\}/, "Impact item links to /work/<slug>");
  assert.match(SURFACES.ImpactPage, /href=\{`\/work\/\$\{item\.slug\}`\}/, "impact page item links to /work/<slug>");
  assert.match(SURFACES.CaseStudies, /href="\/work"/, "CaseStudies CTA links to /work");
  assert.match(SURFACES.Impact, /href="\/impact"/, "Impact CTA links to /impact");
});

test("pill and card hover/focus-visible behaviour lives in the role classes", () => {
  // The hover + focus-visible interaction utilities moved into the role @apply,
  // so the converted markup keeps identical behaviour. Assert the shipped roles
  // carry them and the markup adopts those roles.
  const focus = ["focus-visible:outline-2", "focus-visible:outline-offset-2", "focus-visible:outline-accent"];
  for (const f of focus) {
    assert.ok(ROLE_UTILS.get("cv-card").has(f), `cv-card must keep ${f}`);
    assert.ok(ROLE_UTILS.get("cv-pill").has(f), `cv-pill must keep ${f}`);
    assert.ok(ROLE_UTILS.get("cv-pill-solid").has(f), `cv-pill-solid must keep ${f}`);
  }
  assert.ok(ROLE_UTILS.get("cv-card").has("hover:border-accent"), "cv-card keeps hover:border-accent");
  assert.ok(ROLE_UTILS.get("cv-pill").has("hover:border-accent"), "cv-pill keeps hover:border-accent");
  assert.ok(ROLE_UTILS.get("cv-pill").has("hover:text-accent"), "cv-pill keeps hover:text-accent");
  assert.ok(ROLE_UTILS.get("cv-pill-solid").has("hover:opacity-90"), "cv-pill-solid keeps hover:opacity-90");
});

// ---------------------------------------------------------------------------
// Integration: static class-expansion parity against the SHIPPED role layer.
// ---------------------------------------------------------------------------

test("global.css ships the role classes these surfaces consume", () => {
  for (const role of ["cv-section", "cv-eyebrow", "cv-entry-title", "cv-body", "cv-meta", "cv-metric", "cv-link", "cv-pill", "cv-pill-solid", "cv-card", "cv-badge"]) {
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

const COMPUTED = JSON.parse(read("tests/fixtures/cv-roles-computed-04.json"));

test("task 04 declares no drift elements (pure no-op conversion)", () => {
  assert.deepEqual(COMPUTED.driftElements, [], "task 04 must have zero drift elements");
});

test("computed styles are byte-identical before/after on /cv, /impact and /work", () => {
  for (const [key, before] of Object.entries(COMPUTED.before)) {
    const after = COMPUTED.after[key];
    assert.ok(after, `fixture missing after-measurement for ${key}`);
    const changed = Object.keys(before).filter((p) => after[p] !== before[p]);
    assert.deepEqual(changed, [], `${key}: must be byte-identical, changed: ${changed.join(", ")}`);
  }
});

test("the impact-item heading sits at cv-meta's canonical values (tracking-wider, no font-medium)", () => {
  // The drift the task resolves is structural: the hand-rolled string already
  // matched cv-meta, so adopting the role is a zero-pixel change that removes the
  // drift risk. Confirm the measured values are the canonical meta tier.
  for (const key of ["cv_impact_company", "impact_company"]) {
    const m = COMPUTED.after[key];
    assert.equal(m.fontWeight, "400", `${key}: meta is not font-medium (weight 400)`);
    assert.equal(m.letterSpacing, "0.6px", `${key}: meta uses tracking-wider (0.6px), not eyebrow 2.4px`);
    assert.match(m.fontFamily, /JetBrains Mono/, `${key}: meta is mono`);
    assert.equal(m.textTransform, "uppercase", `${key}: meta is uppercase`);
  }
});

test("Links section keeps its pb-24 (96px) after adopting cv-section", () => {
  assert.equal(COMPUTED.linksSectionPaddingBottom, "96px");
});
