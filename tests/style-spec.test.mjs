// Consistency checks for the written style spec (task 09).
//
// The spec (`docs/style-spec.md`) is the human-readable single source of truth.
// These tests keep it honest against the shipped role-class layer
// (`@layer components` in `src/styles/global.css`, authored by task 01):
//
//   * Internal-consistency tests assert the spec itself is well-formed — it
//     documents the full canonical role vocabulary and the seven-tier scale.
//     These pass independently of task 01 and guard the spec artifact.
//   * Cross-check tests compare the spec against the SHIPPED global.css roles.
//     Until task 01 ships the `@layer components` block, these stay red by
//     design (there are no roles to match) — that is the spec being "finalised
//     after" the role layer lands, not a defect in this file.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// SPEC_TEST_CSS lets the cross-check run against a simulated post-task-01
// stylesheet, proving the harness goes green once the role layer ships.
const cssPath = process.env.SPEC_TEST_CSS || path.join(root, "src/styles/global.css");
const css = readFileSync(cssPath, "utf8");
const spec = readFileSync(path.join(root, "docs/style-spec.md"), "utf8");

// The full canonical role vocabulary (ADR-002). Names are final even though six
// values are extracted during task 01.
const CANONICAL_ROLES = [
  "cv-section",
  "cv-eyebrow",
  "cv-entry-title",
  "cv-body",
  "cv-meta",
  "cv-link",
  "cv-pill",
  "cv-pill-solid",
  "cv-card",
  "cv-badge",
  "cv-metric",
  "cv-detail",
];

// ---------------------------------------------------------------------------
// Parsing helpers.
// ---------------------------------------------------------------------------

// Extract the body of the `@layer components { … }` block via brace matching.
// Returns "" when the block does not exist yet (task 01 not shipped).
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

// Map of role name -> its declaration body (the text inside `.cv-x { … }`).
function shippedRoles(source) {
  const body = layerComponentsBody(source);
  const roles = new Map();
  const re = /\.(cv-[a-z-]+)\s*\{([^}]*)\}/g;
  let m;
  while ((m = re.exec(body)) !== null) roles.set(m[1], m[2]);
  return roles;
}

// Roles the spec documents: the first `cv-*` token of each role-table row.
function documentedRoles(text) {
  const found = new Set();
  for (const line of text.split("\n")) {
    if (!line.trimStart().startsWith("|")) continue;
    const m = line.match(/`(cv-[a-z-]+)`/);
    if (m) found.add(m[1]);
  }
  return found;
}

// Parse the canonical type-scale table rows into { sizes, roles } pairs.
// `sizes`  = the text-* tokens in the Size column.
// `roles`  = the cv-* roles named in the "Applied via" column (empty for the
//            inline / default tiers, which carry no role-class size).
function scaleRows(text) {
  const rows = [];
  for (const line of text.split("\n")) {
    const cells = line.split("|").map((c) => c.trim());
    // A scale row has a Size cell with a text-* token and is not the header/sep.
    if (cells.length < 7) continue;
    const sizeCell = cells[3];
    const viaCell = cells[6];
    const sizes = [...sizeCell.matchAll(/text-[a-z0-9]+/g)].map((x) => x[0]);
    if (sizes.length === 0) continue;
    const roles = [...viaCell.matchAll(/cv-[a-z-]+/g)].map((x) => x[0]);
    // A "(default)" size is inherited, not a literal in the role class.
    const implicitSize = /\(default\)/.test(sizeCell);
    rows.push({ sizes, roles, implicitSize });
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Internal-consistency tests — pass independently of task 01.
// ---------------------------------------------------------------------------

test("spec documents the full canonical role vocabulary", () => {
  const docs = documentedRoles(spec);
  for (const role of CANONICAL_ROLES) {
    assert.ok(docs.has(role), `spec is missing role \`${role}\` from its vocabulary table`);
  }
});

test("spec scale parses into the seven canonical tiers", () => {
  const rows = scaleRows(spec);
  assert.equal(rows.length, 7, `expected 7 scale tiers, parsed ${rows.length}`);
});

test("every role the spec documents is a canonical role name", () => {
  const known = new Set(CANONICAL_ROLES);
  for (const role of documentedRoles(spec)) {
    assert.ok(known.has(role), `spec documents unknown role \`${role}\``);
  }
});

// ---------------------------------------------------------------------------
// Cross-check tests — RED until task 01 ships `@layer components`.
// ---------------------------------------------------------------------------

test("every shipped @layer components role is documented in the spec", () => {
  const shipped = shippedRoles(css);
  const docs = documentedRoles(spec);
  for (const role of shipped.keys()) {
    assert.ok(docs.has(role), `role \`${role}\` ships in global.css but is undocumented in the spec`);
  }
});

test("every role-applied scale size is a value used by its role class", () => {
  const shipped = shippedRoles(css);
  for (const { sizes, roles, implicitSize } of scaleRows(spec)) {
    if (roles.length === 0) continue; // inline tier — no role class
    for (const role of roles) {
      assert.ok(
        shipped.has(role),
        `scale references role \`${role}\` but it is not in @layer components (task 01 not shipped?)`,
      );
      if (implicitSize) continue; // inherited default (e.g. cv-body text-base) — not a literal
      for (const size of sizes) {
        assert.ok(
          shipped.get(role).includes(size),
          `scale size \`${size}\` is documented for \`${role}\` but absent from its role-class value`,
        );
      }
    }
  }
});

test("no role or scale size in the spec is absent from shipped global.css", () => {
  const shipped = shippedRoles(css);
  const layerBody = layerComponentsBody(css);

  // Every documented role name must exist in the shipped layer.
  for (const role of documentedRoles(spec)) {
    assert.ok(shipped.has(role), `spec documents \`${role}\` but it is absent from shipped global.css`);
  }

  // Every role-applied scale size must appear somewhere in the layer.
  for (const { sizes, roles, implicitSize } of scaleRows(spec)) {
    if (roles.length === 0 || implicitSize) continue; // inline / inherited-default tiers
    for (const size of sizes) {
      assert.ok(layerBody.includes(size), `scale size \`${size}\` is in the spec but absent from shipped global.css`);
    }
  }
});
