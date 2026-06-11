// Anchor + lead-in markup tests for the seven lower-band CV sections (task 03).
//
// Mirrors task 02 on a different set of components. Two layers, matching the
// repo's static node:test convention (see cv-roles-conversion-02.test.mjs):
//
//   * Unit (markup): each component reads as source text. We assert it gained
//     `id="<slug>"` on its <section>, a guarded `.cv-lead` line bound to a new
//     optional `leadIn` prop, and that the existing `aria-labelledby`, the
//     `<h2>` `*-heading` id, and the reveal/cv-section classes are untouched.
//     Both `leadIn` branches are covered structurally: the conditional proves
//     the lead-in renders ONLY when the prop is passed.
//   * Integration: a one-time `npm run build` produces dist/cv/index.html; we
//     assert the built page exposes all seven anchor ids. The build is run from
//     the test so the assertion never reads a stale dist (the pre-task state has
//     zero of these ids).
//
// `leadIn` is not yet passed by cv.astro (that is task 04), so the built HTML
// carries the anchor ids but no rendered lead-ins — exactly what we assert.

import { test, before } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(path.join(root, rel), "utf8");

// slug -> component file. The slug is also the section anchor id and the
// `<slug>-heading` h2 id that must stay unchanged.
const SECTIONS = [
  { slug: "education", file: "src/components/Education.astro", guarded: false },
  { slug: "certifications", file: "src/components/Certifications.astro", guarded: false },
  { slug: "publications", file: "src/components/Publications.astro", guarded: true },
  { slug: "voluntary", file: "src/components/VoluntaryLeadership.astro", guarded: true },
  { slug: "personal", file: "src/components/PersonalDetails.astro", guarded: false },
  { slug: "interests", file: "src/components/Interests.astro", guarded: true },
  { slug: "links", file: "src/components/Links.astro", guarded: false },
];

const SOURCES = Object.fromEntries(SECTIONS.map((s) => [s.slug, read(s.file)]));

// ---------------------------------------------------------------------------
// Unit: anchor id + preserved heading wiring, per component.
// ---------------------------------------------------------------------------

for (const { slug, guarded } of SECTIONS) {
  const src = SOURCES[slug];

  test(`${slug}: <section> carries id="${slug}"`, () => {
    assert.match(
      src,
      new RegExp(`<section[^>]*\\bid="${slug}"`),
      `expected the <section> to declare id="${slug}"`,
    );
  });

  test(`${slug}: existing aria-labelledby="${slug}-heading" is preserved`, () => {
    assert.match(
      src,
      new RegExp(`<section[^>]*\\baria-labelledby="${slug}-heading"`),
      `expected aria-labelledby="${slug}-heading" to remain on the <section>`,
    );
  });

  test(`${slug}: the reveal + cv-section classes are unchanged`, () => {
    assert.match(
      src,
      /<section[^>]*\bclass="reveal cv-section/,
      `expected the <section> class to still start with "reveal cv-section"`,
    );
  });

  test(`${slug}: the <h2> keeps its id="${slug}-heading" and cv-eyebrow class`, () => {
    assert.match(
      src,
      new RegExp(`<h2 id="${slug}-heading" class="cv-eyebrow">`),
      `expected the heading <h2 id="${slug}-heading" class="cv-eyebrow"> to be untouched`,
    );
  });

  test(`${slug}: section anchor id is distinct from the h2 heading id`, () => {
    // id="<slug>" must exist without colliding with the h2's id="<slug>-heading".
    assert.match(src, new RegExp(`\\bid="${slug}"`), `missing section anchor id="${slug}"`);
    assert.match(src, new RegExp(`\\bid="${slug}-heading"`), `missing heading id="${slug}-heading"`);
  });

  // ---- lead-in prop + guarded render --------------------------------------

  test(`${slug}: declares an optional leadIn prop and destructures it`, () => {
    assert.match(src, /leadIn\?:\s*string/, "expected `leadIn?: string` on the Props interface");
    assert.match(src, /const\s*\{[^}]*\bleadIn\b[^}]*\}\s*=\s*Astro\.props/, "expected leadIn to be destructured from Astro.props");
  });

  test(`${slug}: renders <p class="cv-lead"> ONLY when leadIn is passed (guarded)`, () => {
    // The render must be guarded by the prop — a bare cv-lead line that always
    // renders would be a regression. Assert the `leadIn &&` guard sits directly
    // in front of the cv-lead paragraph.
    assert.match(
      src,
      /\{\s*leadIn\s*&&\s*<p class="cv-lead">\{leadIn\}<\/p>\s*\}/,
      "expected `{leadIn && <p class=\"cv-lead\">{leadIn}</p>}` guarded render",
    );
  });

  test(`${slug}: the lead-in is the only cv-lead occurrence`, () => {
    const occurrences = src.match(/class="cv-lead"/g) || [];
    assert.equal(occurrences.length, 1, "expected exactly one cv-lead line");
  });

  if (guarded) {
    test(`${slug}: empty-state guard (length > 0) is preserved`, () => {
      assert.match(src, /\.length\s*>\s*0\s*&&/, "expected the existing empty-state guard to remain");
    });
  }
}

// Links additionally owns bottom padding that must not be disturbed.
test("links: keeps its pb-24 bottom-padding layout class", () => {
  assert.match(
    SOURCES.links,
    /<section[^>]*\bclass="reveal cv-section pb-24"/,
    "expected Links <section> to keep class=\"reveal cv-section pb-24\"",
  );
});

// ---------------------------------------------------------------------------
// Integration: the built /cv HTML exposes all seven anchor ids.
// ---------------------------------------------------------------------------

let builtCv = "";

before(() => {
  // Build once so the assertion reads fresh output, not a stale dist. The
  // pre-task dist has zero of these ids, so reading it without rebuilding would
  // be a false signal either way.
  execFileSync("npm", ["run", "build"], { cwd: root, stdio: "ignore" });
  builtCv = readFileSync(path.join(root, "dist/cv/index.html"), "utf8");
}, { timeout: 180_000 });

for (const { slug } of SECTIONS) {
  test(`built /cv HTML contains anchor id="${slug}"`, () => {
    assert.ok(
      builtCv.includes(`id="${slug}"`),
      `built /cv is missing the anchor id="${slug}"`,
    );
  });
}
