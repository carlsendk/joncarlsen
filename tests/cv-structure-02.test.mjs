// Anchor + lead-in markup tests for the seven upper-band CV sections (task 02).
//
// Mirrors task 03 on the top-of-page batch. Two layers, matching the repo's
// static node:test convention (see cv-structure-03.test.mjs):
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
import os from "node:os";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(path.join(root, rel), "utf8");

// slug -> component file. The slug is also the section anchor id; the
// `<slug>-heading` h2 id must stay unchanged. The slug differs from the file
// name for Timeline (experience) and CaseStudies (work). `guarded` components
// keep an empty-state guard that the anchor/lead-in live inside.
const SECTIONS = [
  { slug: "summary", file: "src/components/Summary.astro", guarded: false },
  { slug: "credentials", file: "src/components/Credentials.astro", guarded: true },
  { slug: "impact", file: "src/components/Impact.astro", guarded: false },
  { slug: "expertise", file: "src/components/Expertise.astro", guarded: false },
  { slug: "experience", file: "src/components/Timeline.astro", guarded: false },
  { slug: "work", file: "src/components/CaseStudies.astro", guarded: true },
  { slug: "approach", file: "src/components/Approach.astro", guarded: true },
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
      new RegExp(`<section[\\s\\S]*?\\baria-labelledby="${slug}-heading"`),
      `expected aria-labelledby="${slug}-heading" to remain on the <section>`,
    );
  });

  test(`${slug}: the reveal + cv-section classes are unchanged`, () => {
    assert.match(
      src,
      /<section[\s\S]*?\bclass="reveal cv-section/,
      `expected the <section> class to still start with "reveal cv-section"`,
    );
  });

  test(`${slug}: the <h2> keeps its id="${slug}-heading" and cv-eyebrow class`, () => {
    // Heading attributes survive across one-line and multi-line <h2> forms.
    assert.match(
      src,
      new RegExp(`<h2[\\s\\S]*?id="${slug}-heading"[\\s\\S]*?class="cv-eyebrow"`),
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

// Timeline still maps every role to an <li>; task 05 split the single `shown.map`
// into recent + earlier groups (the long-tail collapse) without dropping any role,
// so the guard now allows either map. Completeness (all roles rendered) is asserted
// in cv-structure-05.
test("experience: roles still render as <li> entries (split, not dropped)", () => {
  assert.match(
    SOURCES.experience,
    /(?:shown|recent|earlier)\.map\(\(role\)/,
    "expected Timeline to render roles via a .map over recent/earlier/shown",
  );
});

// ---------------------------------------------------------------------------
// Integration: the built /cv HTML exposes all seven anchor ids.
// ---------------------------------------------------------------------------

let builtCv = "";

before(() => {
  // Build once so the assertion reads fresh output, not a stale dist (the
  // checked-in dist/ goes stale; the pre-task dist has zero of these ids, so
  // reading it without rebuilding would be a false signal either way).
  //
  // node --test runs test files in parallel, so build into a dedicated outDir
  // instead of the default dist/. cv-structure-03 also builds in its before
  // hook; sharing dist/ would let the two concurrent builds race and clobber
  // each other's output. A private outDir keeps this build collision-free.
  const outDir = path.join(os.tmpdir(), "cv-structure-02-dist");
  execFileSync("npx", ["astro", "build", "--outDir", outDir], { cwd: root, stdio: "ignore" });
  builtCv = readFileSync(path.join(outDir, "cv/index.html"), "utf8");
}, { timeout: 180_000 });

for (const { slug } of SECTIONS) {
  test(`built /cv HTML contains anchor id="${slug}"`, () => {
    assert.ok(
      builtCv.includes(`id="${slug}"`),
      `built /cv is missing the anchor id="${slug}"`,
    );
  });
}
