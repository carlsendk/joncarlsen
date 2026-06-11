// Tests for task 03 — converting the six entry/list components to the cv-* role
// classes from task 01 (Timeline, Education, VoluntaryLeadership, Publications,
// Certifications, PersonalDetails).
//
// Two layers, matching the repo's static node:test pattern:
//
//   * Unit (markup + grep): each component references the expected role classes,
//     the recurring duplicated utility strings are gone, and list/dl semantics
//     are preserved.
//   * Integration (computed-style parity): a static class-expansion guard reads
//     the SHIPPED role layer from global.css and proves each converted element's
//     compiled utility set equals its pre-conversion set (the ADR-002
//     pixel-identical guarantee) — except the three documented body-line
//     normalizations. A second integration test asserts the parity PROPERTY over
//     the live Playwright before/after measurement captured in
//     fixtures/cv-roles-computed.json.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(path.join(projectRoot, rel), "utf8");

const COMPONENTS = {
  Timeline: read("src/components/Timeline.astro"),
  Education: read("src/components/Education.astro"),
  VoluntaryLeadership: read("src/components/VoluntaryLeadership.astro"),
  Publications: read("src/components/Publications.astro"),
  Certifications: read("src/components/Certifications.astro"),
  PersonalDetails: read("src/components/PersonalDetails.astro"),
};

// ---------------------------------------------------------------------------
// Role-layer parsing (same brace-match convention as style-spec.test.mjs).
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

const setEq = (a, b) =>
  a.size === b.size && [...a].every((x) => b.has(x));

// ---------------------------------------------------------------------------
// Conversion model: for each converted element, the class string now in markup
// (`after`), the exact utility string it carried before (`before`), and whether
// it is one of the documented body-line drift normalizations. Each `after` string
// is also asserted to literally appear in its component, so this model cannot
// silently drift from the source.
// ---------------------------------------------------------------------------

const ELEMENTS = [
  // Timeline
  { comp: "Timeline", after: "reveal cv-section", before: "reveal mx-auto max-w-2xl border-t border-border px-6 py-14" },
  { comp: "Timeline", after: "cv-eyebrow", before: "font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted" },
  { comp: "Timeline", after: "cv-entry-title text-fg", before: "font-display text-xl font-semibold tracking-tight text-fg" },
  { comp: "Timeline", after: "cv-body mt-0.5 text-fg", before: "mt-0.5 text-base text-fg", drift: true },
  { comp: "Timeline", after: "cv-meta mt-1.5", before: "mt-1.5 font-mono text-xs uppercase tracking-wider text-muted" },
  { comp: "Timeline", after: "cv-body mt-3 text-muted", before: "mt-3 leading-relaxed text-muted" },
  { comp: "Timeline", after: "cv-body mt-3 list-disc space-y-2 pl-5 text-muted", before: "mt-3 list-disc space-y-2 pl-5 leading-relaxed text-muted" },
  { comp: "Timeline", after: "cv-link link-underline", before: "link-underline motion-safe:transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" },
  // Education
  { comp: "Education", after: "reveal cv-section", before: "reveal mx-auto max-w-2xl border-t border-border px-6 py-14" },
  { comp: "Education", after: "cv-eyebrow", before: "font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted" },
  { comp: "Education", after: "cv-entry-title text-fg", before: "font-display text-xl font-semibold tracking-tight text-fg" },
  { comp: "Education", after: "cv-body mt-0.5 text-fg", before: "mt-0.5 text-base text-fg", drift: true },
  { comp: "Education", after: "cv-meta mt-1", before: "mt-1 font-mono text-xs uppercase tracking-wider text-muted" },
  { comp: "Education", after: "cv-detail mt-2 space-y-1 text-muted", before: "mt-2 space-y-1 text-sm leading-relaxed text-muted" },
  // VoluntaryLeadership
  { comp: "VoluntaryLeadership", after: "reveal cv-section", before: "reveal mx-auto max-w-2xl border-t border-border px-6 py-14" },
  { comp: "VoluntaryLeadership", after: "cv-eyebrow", before: "font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted" },
  { comp: "VoluntaryLeadership", after: "cv-entry-title text-fg", before: "font-display text-xl font-semibold tracking-tight text-fg" },
  { comp: "VoluntaryLeadership", after: "cv-body mt-1 text-muted", before: "mt-1 leading-relaxed text-muted" },
  // Publications
  { comp: "Publications", after: "reveal cv-section", before: "reveal mx-auto max-w-2xl border-t border-border px-6 py-14" },
  { comp: "Publications", after: "cv-eyebrow", before: "font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted" },
  { comp: "Publications", after: "cv-body mt-8 space-y-2 text-muted", before: "mt-8 space-y-2 leading-relaxed text-muted" },
  { comp: "Publications", after: "cv-link link-underline", before: "link-underline motion-safe:transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" },
  // Certifications
  { comp: "Certifications", after: "reveal cv-section", before: "reveal mx-auto max-w-2xl border-t border-border px-6 py-14" },
  { comp: "Certifications", after: "cv-eyebrow", before: "font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted" },
  { comp: "Certifications", after: "cv-body mt-8 space-y-2 text-muted", before: "mt-8 space-y-2 leading-relaxed text-muted" },
  // PersonalDetails
  { comp: "PersonalDetails", after: "reveal cv-section", before: "reveal mx-auto max-w-2xl border-t border-border px-6 py-14" },
  { comp: "PersonalDetails", after: "cv-eyebrow", before: "font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted" },
  { comp: "PersonalDetails", after: "cv-meta w-28 shrink-0", before: "w-28 shrink-0 font-mono text-xs uppercase tracking-wider text-muted" },
  { comp: "PersonalDetails", after: "cv-body text-fg", before: "text-fg", drift: true },
];

// The recurring duplicated utility strings that the role classes replace. None
// may survive verbatim in any of the six converted components.
const FORBIDDEN_LITERALS = [
  "mx-auto max-w-2xl border-t border-border px-6 py-14",
  "font-mono text-xs font-medium uppercase tracking-[0.2em]",
  "font-display text-xl font-semibold tracking-tight",
  "font-mono text-xs uppercase tracking-wider",
  "hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
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
    Timeline: ["cv-section", "cv-eyebrow", "cv-entry-title", "cv-meta", "cv-body", "cv-link"],
    Education: ["cv-section", "cv-eyebrow", "cv-entry-title", "cv-body", "cv-meta", "cv-detail"],
    VoluntaryLeadership: ["cv-section", "cv-eyebrow", "cv-entry-title", "cv-body"],
    Publications: ["cv-section", "cv-eyebrow", "cv-body", "cv-link"],
    Certifications: ["cv-section", "cv-eyebrow", "cv-body"],
    PersonalDetails: ["cv-section", "cv-eyebrow", "cv-meta", "cv-body"],
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
// Integration: static class-expansion parity against the SHIPPED role layer.
// ---------------------------------------------------------------------------

test("global.css ships the role classes these components consume", () => {
  for (const role of ["cv-section", "cv-eyebrow", "cv-entry-title", "cv-meta", "cv-body", "cv-detail", "cv-link"]) {
    assert.ok(ROLE_UTILS.has(role), `global.css missing @apply role ${role}`);
  }
});

test("non-drift elements expand to exactly their pre-conversion utility set", () => {
  for (const { comp, after, before, drift } of ELEMENTS) {
    if (drift) continue;
    const got = expand(after);
    const want = new Set(before.trim().split(/\s+/));
    assert.ok(
      setEq(got, want),
      `${comp} "${after}": expanded {${[...got].sort()}} != baseline {${[...want].sort()}}`,
    );
  }
});

test("drift elements adopt cv-body: drop explicit text-base, add leading-relaxed", () => {
  // The three secondary body lines (Timeline company, Education institution,
  // PersonalDetails dd) had no leading-relaxed and sat at the text-base default
  // line-height. Adopting cv-body collapses them to the canonical body
  // line-height. Measured computed parity: font-size stays 16px (inherited base);
  // only line-height moves 24px -> 26px. See fixtures/cv-roles-computed.json.
  for (const { comp, after, before, drift } of ELEMENTS) {
    if (!drift) continue;
    const got = expand(after);
    assert.ok(got.has("leading-relaxed"), `${comp} "${after}": cv-body must add leading-relaxed`);
    assert.ok(!got.has("text-base"), `${comp} "${after}": explicit text-base must be dropped (inherited 16px base)`);
    // Everything that was not the dropped text-base / added leading-relaxed is unchanged.
    const baselineMinusSize = new Set(before.trim().split(/\s+/).filter((t) => t !== "text-base"));
    const gotMinusLeading = new Set([...got].filter((t) => t !== "leading-relaxed"));
    assert.ok(
      setEq(gotMinusLeading, baselineMinusSize),
      `${comp} "${after}": residual utilities drifted from baseline`,
    );
  }
});

// ---------------------------------------------------------------------------
// Integration: computed-style parity over the live before/after measurement.
// ---------------------------------------------------------------------------

const COMPUTED = JSON.parse(read("tests/fixtures/cv-roles-computed.json"));

test("computed styles are identical before/after except documented drift", () => {
  const drift = new Set(COMPUTED.driftElements);
  for (const [key, before] of Object.entries(COMPUTED.before)) {
    const after = COMPUTED.after[key];
    assert.ok(after, `fixture missing after-measurement for ${key}`);
    for (const prop of Object.keys(before)) {
      if (prop === "lineHeight" && drift.has(key)) continue; // documented normalization
      assert.equal(after[prop], before[prop], `${key}.${prop} changed: ${before[prop]} -> ${after[prop]}`);
    }
  }
});

test("only the three documented body lines change, and only their line-height", () => {
  const drift = new Set(COMPUTED.driftElements);
  for (const [key, before] of Object.entries(COMPUTED.before)) {
    const after = COMPUTED.after[key];
    const changed = Object.keys(before).filter((p) => after[p] !== before[p]);
    if (drift.has(key)) {
      assert.deepEqual(changed, ["lineHeight"], `${key}: drift element may only change line-height`);
      assert.equal(before.lineHeight, "24px");
      assert.equal(after.lineHeight, "26px");
    } else {
      assert.deepEqual(changed, [], `${key}: non-drift element must be byte-identical`);
    }
  }
});

// ---------------------------------------------------------------------------
// Integration: PersonalDetails dt/dd semantics + baseline alignment.
// ---------------------------------------------------------------------------

test("PersonalDetails keeps dl/dt/dd structure with baseline-aligned rows", () => {
  const src = COMPONENTS.PersonalDetails;
  assert.match(src, /<dl\b/, "dl preserved");
  assert.match(src, /<dt class="cv-meta w-28 shrink-0">/, "dt carries cv-meta and keeps its width");
  assert.match(src, /<dd class="cv-body text-fg">/, "dd carries cv-body");
  assert.match(src, /class="flex items-baseline gap-3"/, "rows keep items-baseline alignment");
  assert.equal(COMPUTED.personalDetailsBaselineAlignment.alignItems, "baseline");
});

test("list components preserve their list semantics", () => {
  assert.match(COMPONENTS.Timeline, /<ol\b/, "Timeline keeps an ordered list");
  assert.match(COMPONENTS.Education, /<ul\b[\s\S]*<li>/, "Education keeps ul/li");
  assert.match(COMPONENTS.VoluntaryLeadership, /<ul\b[\s\S]*<li>/, "Voluntary keeps ul/li");
  assert.match(COMPONENTS.Publications, /<ul\b[\s\S]*<li>/, "Publications keeps ul/li");
  assert.match(COMPONENTS.Certifications, /<ul\b[\s\S]*<li>/, "Certifications keeps ul/li");
});
