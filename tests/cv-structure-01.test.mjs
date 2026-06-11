// Internal-consistency tests for the cv-structure build-time data (task 01).
//
// These assert the new exports in `src/data/cv.ts` (sectionLeadIns, navGroups,
// collapseConfig) are self-consistent and that `.cv-lead` exists exactly once in
// the global.css component layer. The data is additive and unrendered at this
// point, so these guard the data contract the later tasks (02-06) depend on.
//
// cv.ts is imported directly: Node strips the TypeScript types at load, so the
// test reads the real runtime values rather than parsing source text.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { sectionLeadIns, navGroups, collapseConfig } from "../src/data/cv.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// The 14 canonical section slugs (TechSpec Core Interfaces / ADR-004). These
// must match the `<slug>-heading` ids in the section components.
const KNOWN_SLUGS = new Set([
  "summary",
  "credentials",
  "impact",
  "expertise",
  "experience",
  "work",
  "approach",
  "education",
  "certifications",
  "publications",
  "voluntary",
  "personal",
  "interests",
  "links",
]);

// ---------------------------------------------------------------------------
// navGroups
// ---------------------------------------------------------------------------

test("navGroups: every anchor is a known section slug", () => {
  for (const group of navGroups) {
    assert.ok(
      KNOWN_SLUGS.has(group.anchor),
      `nav group "${group.label}" anchors to unknown slug "${group.anchor}"`,
    );
  }
});

test("navGroups: every spans entry is a known section slug", () => {
  for (const group of navGroups) {
    assert.ok(Array.isArray(group.spans) && group.spans.length > 0, `group "${group.label}" has no spans`);
    for (const slug of group.spans) {
      assert.ok(KNOWN_SLUGS.has(slug), `group "${group.label}" spans unknown slug "${slug}"`);
    }
  }
});

test("navGroups: no slug is spanned by more than one group (no duplicates)", () => {
  const seen = new Set();
  for (const group of navGroups) {
    for (const slug of group.spans) {
      assert.ok(!seen.has(slug), `slug "${slug}" appears in more than one group's spans`);
      seen.add(slug);
    }
  }
});

test("navGroups: every anchor is one of its own group's spanned slugs", () => {
  for (const group of navGroups) {
    assert.ok(
      group.spans.includes(group.anchor),
      `group "${group.label}" anchor "${group.anchor}" is not within its spans`,
    );
  }
});

test("navGroups: the six approved groups, labels and span coverage", () => {
  assert.equal(navGroups.length, 6, "expected exactly six nav groups");
  assert.deepEqual(
    navGroups.map((g) => g.label),
    ["Summary", "Proof", "Experience", "Work", "Background", "Beyond"],
  );
  // The flattened spans cover every known slug exactly once.
  const flattened = navGroups.flatMap((g) => g.spans);
  assert.equal(flattened.length, KNOWN_SLUGS.size, "spans must cover all 14 slugs once");
  assert.deepEqual(new Set(flattened), KNOWN_SLUGS, "spans must cover exactly the known slug set");
});

// ---------------------------------------------------------------------------
// sectionLeadIns
// ---------------------------------------------------------------------------

test("sectionLeadIns: every key is a known section slug (no typos)", () => {
  for (const key of Object.keys(sectionLeadIns)) {
    assert.ok(KNOWN_SLUGS.has(key), `sectionLeadIns has unknown key "${key}"`);
  }
});

test("sectionLeadIns: every value is a non-empty string", () => {
  const entries = Object.entries(sectionLeadIns);
  assert.ok(entries.length > 0, "expected at least one lead-in");
  for (const [key, value] of entries) {
    assert.equal(typeof value, "string", `lead-in "${key}" must be a string`);
    assert.ok(value.trim().length > 0, `lead-in "${key}" must be non-empty`);
  }
});

// ---------------------------------------------------------------------------
// collapseConfig
// ---------------------------------------------------------------------------

test("collapseConfig: equals the approved starting values", () => {
  assert.deepEqual(collapseConfig, { recentRoles: 4, listThreshold: 8 });
});

// ---------------------------------------------------------------------------
// .cv-lead style
// ---------------------------------------------------------------------------

test("global.css defines .cv-lead exactly once in the components layer", () => {
  const css = readFileSync(path.join(root, "src/styles/global.css"), "utf8");

  // Locate the @layer components block by brace matching.
  const at = css.indexOf("@layer components");
  assert.notEqual(at, -1, "expected an @layer components block");
  const open = css.indexOf("{", at);
  let depth = 0;
  let layerBody = "";
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}") {
      depth--;
      if (depth === 0) {
        layerBody = css.slice(open + 1, i);
        break;
      }
    }
  }

  const occurrences = layerBody.match(/\.cv-lead\s*\{/g) || [];
  assert.equal(occurrences.length, 1, "expected exactly one .cv-lead rule in @layer components");
  // The whole-file count matches, so the rule is not also defined elsewhere.
  const wholeFile = css.match(/\.cv-lead\s*\{/g) || [];
  assert.equal(wholeFile.length, 1, ".cv-lead must be defined only inside @layer components");
});
