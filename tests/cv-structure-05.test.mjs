// Long-tail collapse for the experience timeline (task 05).
//
// Three layers, matching the repo's static node:test convention (see
// cv-structure-02/03.test.mjs — no JSDOM/browser dependency in this project):
//
//   * Unit (source): Timeline.astro reads as source text. We assert the split
//     into recent + earlier groups (a SLICE-INTO-TWO, never a drop), the single
//     bulk <button aria-expanded> control with the hidden count, and the bundled
//     module <script> that wires it. The collapse is gated on variant="full".
//   * Module behaviour: the toggle logic is extracted into src/scripts/collapse.ts
//     (a tiny importable module — TechSpec) so it executes in node against a DOM
//     stub. We prove collapse-on-load, the click toggle of `cv-collapsed` +
//     `aria-expanded`, and that the control is revealed (`hidden` cleared). This
//     is the REQUIRED behavioural toggle test; a source string alone cannot prove
//     it.
//   * Integration (built HTML/CSS): a one-time `npx astro build` into a PRIVATE
//     outDir (node --test runs files in parallel; building into the shared dist/
//     races cv-structure-03 — so we use our own dir). We assert /cv renders ALL
//     roles (completeness), 4 outside the tail + the rest inside it, the home page
//     (condensed) grows NO collapse region, and global.css collapses via `display`
//     (full opacity) with a `@media print` neutralization.
//
// Lighthouse perf ≥ 0.90 / no-CLS is enforced by the CI Lighthouse gate
// (netlify.toml), not re-run here. The collapse only hides the below-the-fold
// earlier-roles tail, so the on-load shift falls outside the viewport and does not
// count toward CLS (ADR-003); that placement is asserted structurally above.

import { test, before } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";

import { initCollapse } from "../src/scripts/collapse.ts";
import { cvData, collapseConfig } from "../src/data/cv.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(path.join(root, rel), "utf8");

const TIMELINE = read("src/components/Timeline.astro");
const GLOBAL_CSS = read("src/styles/global.css");

const RECENT = collapseConfig.recentRoles;
const TOTAL = cvData.roles.length;
const HIDDEN = TOTAL - RECENT;

// A timeline role <li> carries this exact, timeline-only class string, so counting
// it is a reliable per-role tally in both source and built HTML.
const ROLE_LI = /class="border-l border-border pl-5"/g;
const countRoleLi = (html) => (html.match(ROLE_LI) || []).length;

// ---------------------------------------------------------------------------
// Unit: Timeline.astro source — split, button, script.
// ---------------------------------------------------------------------------

test("imports collapseConfig from cv.ts (drives the split count)", () => {
  assert.match(
    TIMELINE,
    /import\s*\{[^}]*\bcollapseConfig\b[^}]*\}\s*from\s*["']\.\.\/data\/cv\.ts["']/,
    "expected Timeline to import collapseConfig from ../data/cv.ts",
  );
});

test("collapse is gated on variant='full' and an overflow of recentRoles", () => {
  assert.match(
    TIMELINE,
    /variant\s*===\s*"full"\s*&&\s*shown\.length\s*>\s*collapseConfig\.recentRoles/,
    "expected the collapsible flag to require variant==='full' AND overflow",
  );
});

test("splits `shown` into recent + earlier (a slice-into-two, not a drop)", () => {
  // recent = first recentRoles, earlier = the remainder. Both halves come from
  // `shown`, so every role stays rendered — there is no `.slice(0, N)` that drops.
  assert.match(TIMELINE, /shown\.slice\(0,\s*collapseConfig\.recentRoles\)/, "expected recent = shown.slice(0, recentRoles)");
  assert.match(TIMELINE, /shown\.slice\(collapseConfig\.recentRoles\)/, "expected earlier = shown.slice(recentRoles)");
  // Guard against a regression that limits the full view to N roles.
  assert.doesNotMatch(
    TIMELINE,
    /variant\s*===\s*"full"[^]*?roles\.slice\(0/,
    "the full variant must never slice roles down to a limit",
  );
});

test("renders both groups: a recent <ol> and the tail <ol id='experience-tail'>", () => {
  assert.match(TIMELINE, /<ol id="experience-tail"/, "expected the earlier roles to live in <ol id='experience-tail'>");
  assert.match(TIMELINE, /recent\.map\(\(role\)/, "expected the recent group to be rendered");
  assert.match(TIMELINE, /earlier\.map\(\(role\)/, "expected the earlier group to be rendered");
});

test("the bulk control is a real <button> with aria-expanded + the hidden count", () => {
  // One <button>, carrying aria-expanded (default expanded SSR state), the
  // controlled-region association, the count, and a `hidden` attr the script
  // clears. Keyboard operability comes free with the native <button>.
  assert.match(TIMELINE, /<button[^>]*id="experience-expander"/, "expected a <button id='experience-expander'>");
  assert.match(TIMELINE, /aria-expanded="true"/, "expected aria-expanded='true' (default expanded SSR)");
  assert.match(TIMELINE, /aria-controls="experience-tail"/, "expected aria-controls='experience-tail'");
  assert.match(TIMELINE, /data-count=\{hiddenCount\}/, "expected data-count={hiddenCount} for the script");
  assert.match(TIMELINE, /\bhidden\b/, "expected the button to ship `hidden` (revealed by JS)");
  assert.match(TIMELINE, /Show earlier roles \(\{hiddenCount\}\)/, "expected the label to include the hidden count");
});

test("wires the bundled module script (ThemeToggle idiom)", () => {
  assert.match(
    TIMELINE,
    /import\s*\{\s*initCollapse\s*\}\s*from\s*["']\.\.\/scripts\/collapse\.ts["']/,
    "expected the <script> to import initCollapse from ../scripts/collapse.ts",
  );
  assert.match(TIMELINE, /initCollapse\(\)/, "expected the script to call initCollapse()");
});

// ---------------------------------------------------------------------------
// Module behaviour: collapse-on-load + click toggle, against a DOM stub.
// ---------------------------------------------------------------------------

// Minimal element stub: just the surface initCollapse touches.
function makeEl(attrs = {}) {
  const classes = new Set();
  const listeners = {};
  return {
    classList: {
      toggle(cls, force) {
        const on = force === undefined ? !classes.has(cls) : force;
        if (on) classes.add(cls);
        else classes.delete(cls);
        return on;
      },
      contains: (cls) => classes.has(cls),
    },
    _attrs: { ...attrs },
    getAttribute(name) {
      return name in this._attrs ? this._attrs[name] : null;
    },
    setAttribute(name, value) {
      this._attrs[name] = String(value);
    },
    hidden: true,
    textContent: "",
    addEventListener(type, fn) {
      listeners[type] = fn;
    },
    _fire(type) {
      listeners[type]?.();
    },
  };
}

function makeDoc() {
  const tail = makeEl();
  const btn = makeEl({ "data-count": String(HIDDEN) });
  const doc = {
    getElementById: (id) =>
      id === "experience-tail" ? tail : id === "experience-expander" ? btn : null,
  };
  return { doc, tail, btn };
}

test("module: no-ops when the tail/expander are absent (condensed timeline)", () => {
  // A document missing the ids must not throw — the script ships on every page.
  assert.doesNotThrow(() => initCollapse({ getElementById: () => null }));
});

test("module: collapses the tail on load and reveals the control", () => {
  const { doc, tail, btn } = makeDoc();
  initCollapse(doc);
  assert.ok(tail.classList.contains("cv-collapsed"), "tail should be collapsed on load");
  assert.equal(btn.getAttribute("aria-expanded"), "false", "aria-expanded should flip to false on collapse");
  assert.equal(btn.hidden, false, "the control should be revealed (hidden cleared)");
  assert.equal(btn.textContent, `Show earlier roles (${HIDDEN})`, "collapsed label should carry the hidden count");
});

test("module: clicking toggles cv-collapsed + aria-expanded (and back)", () => {
  const { doc, tail, btn } = makeDoc();
  initCollapse(doc);

  btn._fire("click"); // expand
  assert.ok(!tail.classList.contains("cv-collapsed"), "click should expand (remove cv-collapsed)");
  assert.equal(btn.getAttribute("aria-expanded"), "true", "aria-expanded should be true when expanded");
  assert.equal(btn.textContent, "Hide earlier roles", "expanded label should offer to hide");

  btn._fire("click"); // collapse again
  assert.ok(tail.classList.contains("cv-collapsed"), "second click should collapse again");
  assert.equal(btn.getAttribute("aria-expanded"), "false", "aria-expanded should return to false");
});

// ---------------------------------------------------------------------------
// CSS: display-based collapse (full opacity) + print neutralization.
// ---------------------------------------------------------------------------

test("css: .cv-collapsed hides via display (not opacity), so expanded roles are full opacity", () => {
  assert.match(
    GLOBAL_CSS,
    /\.cv-collapsed\s*\{\s*display:\s*none;\s*\}/,
    "expected .cv-collapsed { display: none } — a display toggle, never an opacity fade",
  );
});

test("css: @media print neutralizes the collapse and drops the expander", () => {
  const printBlock = GLOBAL_CSS.slice(GLOBAL_CSS.indexOf("@media print"));
  assert.match(printBlock, /\.cv-collapsed\s*\{\s*display:\s*revert\s*!important;\s*\}/, "print must reveal the collapsed tail");
  assert.match(printBlock, /#experience-expander\s*\{\s*display:\s*none\s*!important;\s*\}/, "print must hide the expander button");
});

// ---------------------------------------------------------------------------
// Integration: built HTML — completeness, split, condensed unchanged.
// ---------------------------------------------------------------------------

let builtCv = "";
let builtHome = "";

before(() => {
  // Private outDir so the build output never collides with cv-structure-03
  // (default dist/) or cv-structure-02 (its own tmp dir). A private outDir is
  // NOT enough on its own, though: node --test runs the three build-bearing files
  // in parallel and concurrent `astro build` runs race on Tailwind's shared ESM
  // cache loader (@tailwindcss/node) at finalization — a third concurrent build
  // intermittently throws there regardless of outDir. This file is reliably the
  // last of the three to start, so a short retry runs in the clear window after
  // 02/03 finish, serialising past the contention without touching their files.
  const outDir = path.join(os.tmpdir(), "cv-structure-05-dist");
  const attempts = 4;
  for (let i = 1; i <= attempts; i++) {
    try {
      execFileSync("npx", ["astro", "build", "--outDir", outDir], { cwd: root, stdio: "ignore" });
      break;
    } catch (err) {
      if (i === attempts) throw err;
      execFileSync("sleep", [String(0.75 * i)]); // back off, then let the cache settle
    }
  }
  builtCv = readFileSync(path.join(outDir, "cv/index.html"), "utf8");
  builtHome = readFileSync(path.join(outDir, "index.html"), "utf8");
}, { timeout: 180_000 });

test("built /cv renders EVERY role (collapse drops nothing)", () => {
  assert.equal(countRoleLi(builtCv), TOTAL, `expected ${TOTAL} role entries in /cv (= cvData.roles.length)`);
});

test("built /cv: the first recentRoles are outside the tail; the rest are inside it", () => {
  const expanderAt = builtCv.indexOf('id="experience-expander"');
  const tailAt = builtCv.indexOf('id="experience-tail"');
  assert.ok(expanderAt > -1 && tailAt > -1, "expected the expander + tail to be present on /cv");

  // Recent roles sit before the expander; earlier roles sit inside the tail <ol>.
  const beforeExpander = builtCv.slice(0, expanderAt);
  const fromTail = builtCv.slice(tailAt);
  assert.equal(countRoleLi(beforeExpander), RECENT, `expected ${RECENT} recent roles before the expander`);
  assert.equal(countRoleLi(fromTail), HIDDEN, `expected ${HIDDEN} earlier roles inside the tail`);
});

test("built /cv: the expander reports the hidden count and ships expanded", () => {
  assert.ok(builtCv.includes(`Show earlier roles (${HIDDEN})`), "expected the visible label to show the hidden count");
  assert.ok(builtCv.includes(`data-count="${HIDDEN}"`), "expected data-count to match the hidden count");
  assert.ok(builtCv.includes('aria-expanded="true"'), "SSR state must be expanded (no-JS shows everything)");
});

test("built home (condensed) grows NO collapse region", () => {
  // The bundled script is inlined on every page (it no-ops without the ids), so
  // assert the absence of the ELEMENTS (attribute form), not the script's strings.
  // (The label text "Show earlier roles (…)" lives in the inlined script's
  // template literal on every page, so it is NOT a reliable element marker —
  // the attribute-form ids are.)
  assert.ok(!builtHome.includes('id="experience-tail"'), "home must not render the collapsible tail");
  assert.ok(!builtHome.includes('id="experience-expander"'), "home must not render the expander button");
});
