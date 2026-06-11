// Tests for the custom `local/canonical-scale` ESLint rule (task 07).
//
//   * RuleTester unit tests drive the rule directly over `.astro` fixtures, so
//     they assert detection independent of the config's WARN severity.
//   * Integration tests exercise the rule THROUGH the real `eslint.config.mjs`
//     via the ESLint Node API: the shipped config is WARN (lint stays green on
//     the not-yet-converted source), and a strict variant proves the task 08
//     promotion to error makes an off-scale size fail the lint (exit non-zero).

import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { RuleTester, ESLint } from "eslint";
import * as astroParser from "astro-eslint-parser";
import tsParser from "@typescript-eslint/parser";
import canonicalScale from "../eslint-rules/canonical-scale.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// ---------------------------------------------------------------------------
// Unit tests — ESLint RuleTester over the rule itself.
// ---------------------------------------------------------------------------

const ruleTester = new RuleTester({
  languageOptions: {
    parser: astroParser,
    parserOptions: { parser: tsParser },
  },
});

// RuleTester cases need an `.astro` filename so the Astro parser engages. The
// `options` key is only set when provided — RuleTester asserts it must be an array.
const ok = (code, options) => ({
  code,
  filename: "src/fixture.astro",
  ...(options ? { options } : {}),
});
const bad = (code, errors, options) => ({
  code,
  filename: "src/fixture.astro",
  errors,
  ...(options ? { options } : {}),
});

test("RuleTester: canonical-scale rule", () => {
  ruleTester.run("canonical-scale", canonicalScale, {
    valid: [
      // Every canonical font size passes.
      ok(`<p class="text-xs">x</p>`),
      ok(`<p class="text-sm">x</p>`),
      ok(`<p class="text-base leading-relaxed">x</p>`),
      ok(`<h3 class="text-xl font-semibold">x</h3>`),
      ok(`<p class="text-2xl">x</p>`),
      ok(`<p class="text-3xl">x</p>`),
      ok(`<h1 class="text-5xl">x</h1>`),
      ok(`<h1 class="text-6xl">x</h1>`),
      // Responsive variant on a canonical size passes (variant prefix stripped).
      ok(`<h1 class="text-5xl sm:text-6xl">x</h1>`),
      // Semantic token utilities are not colour literals.
      ok(`<p class="text-accent">x</p>`),
      ok(`<p class="text-fg">x</p>`),
      ok(`<p class="text-muted">x</p>`),
      ok(`<div class="bg-bg border-border">x</div>`),
      // Alignment / role / non-colour utilities pass untouched.
      ok(`<p class="text-center">x</p>`),
      ok(`<section class="cv-section cv-body cv-eyebrow">x</section>`),
      // Documented system arbitrary passes; arbitrary font size is left to the
      // stock arbitrary-value restriction, not this rule.
      ok(`<p class="font-mono text-xs tracking-[0.2em] text-muted">x</p>`),
      ok(`<span class="text-[0.625rem]">x</span>`),
      // Static class inside an expression container is inspected and passes.
      ok(`<p class={"text-base"}>x</p>`),
      // Dynamic expressions are not inspected (no false positive).
      ok(`<p class={size}>x</p>`),
      // Options: a custom allowlist makes text-4xl canonical.
      ok(`<h1 class="text-4xl">x</h1>`, [
        { allowedTextSizes: ["text-4xl", "text-5xl"] },
      ]),
      // Options: a custom documented arbitrary passes by full match.
      ok(`<p class="text-[10px]">x</p>`, [{ allowedArbitrary: ["text-[10px]"] }]),
      // Options: colour ban disabled lets a palette utility through.
      ok(`<p class="text-red-500">x</p>`, [{ banColorLiteralsInMarkup: false }]),
    ],
    invalid: [
      // Off-scale named sizes are reported.
      bad(`<p class="text-lg">x</p>`, [{ messageId: "offScaleSize" }]),
      // Matches the real drift in src/pages/work/[slug].astro.
      bad(`<h1 class="text-4xl">x</h1>`, [{ messageId: "offScaleSize" }]),
      // Off-scale size behind a responsive variant is still caught.
      bad(`<p class="md:text-lg">x</p>`, [{ messageId: "offScaleSize" }]),
      // Off-scale size in a template-literal class is caught.
      bad(`<p class={\`text-lg\`}>x</p>`, [{ messageId: "offScaleSize" }]),
      // Off-scale size in an Astro class:list array member is caught.
      bad(`<p class:list={["text-lg"]}>x</p>`, [{ messageId: "offScaleSize" }]),
      // Colour literals: arbitrary hex, palette utilities, named white, rgb().
      bad(`<a class="text-[#1d4ed8]">x</a>`, [{ messageId: "colorLiteral" }]),
      bad(`<div class="bg-[#fff]">x</div>`, [{ messageId: "colorLiteral" }]),
      bad(`<p class="text-red-500">x</p>`, [{ messageId: "colorLiteral" }]),
      bad(`<div class="bg-blue-600">x</div>`, [{ messageId: "colorLiteral" }]),
      bad(`<p class="text-white">x</p>`, [{ messageId: "colorLiteral" }]),
      bad(`<div class="bg-[rgb(0,0,0)]">x</div>`, [{ messageId: "colorLiteral" }]),
      // Multiple drift signals in one class string each report.
      bad(`<p class="text-lg text-[#1d4ed8]">x</p>`, [
        { messageId: "offScaleSize" },
        { messageId: "colorLiteral" },
      ]),
      // Options: tightening the allowlist makes a normally-canonical size fail.
      bad(`<p class="text-xs">x</p>`, [{ messageId: "offScaleSize" }], [
        { allowedTextSizes: ["text-base"] },
      ]),
    ],
  });
});

// ---------------------------------------------------------------------------
// Integration tests — through the real eslint.config.mjs.
// ---------------------------------------------------------------------------

const eslint = new ESLint({ cwd: projectRoot });

async function lintMarkup(markup, name) {
  const filePath = path.join(projectRoot, "src", `__${name}__.astro`);
  const results = await eslint.lintText(markup, { filePath, warnIgnored: false });
  return results.flatMap((r) => r.messages);
}

test("integration: live config exits 0 (no errors) on the current source", async () => {
  const results = await eslint.lintFiles(["src/**/*.astro"]);
  const totalErrors = results.reduce((n, r) => n + r.errorCount, 0);
  assert.equal(totalErrors, 0, "the canonical-scale rule ships at warn; lint must exit 0");
});

test("integration: live config flags an off-scale size via local/canonical-scale", async () => {
  const messages = await lintMarkup(`<div class="text-lg">x</div>`, "offscale");
  const hits = messages.filter((m) => m.ruleId === "local/canonical-scale");
  assert.ok(hits.length > 0, "expected the live config to flag text-lg");
});

test("integration: live config flags a colour literal but not a semantic token", async () => {
  const flagged = await lintMarkup(`<a class="text-[#1d4ed8]">x</a>`, "color");
  assert.ok(
    flagged.some((m) => m.ruleId === "local/canonical-scale"),
    "expected text-[#1d4ed8] to be flagged",
  );
  const clean = await lintMarkup(`<a class="text-accent">x</a>`, "token");
  assert.equal(
    clean.filter((m) => m.ruleId === "local/canonical-scale").length,
    0,
    "text-accent is a semantic token and must not be flagged",
  );
});

test("integration (task 08 gate): promoted to error, an off-scale size fails lint", async () => {
  // Mirrors task 08 flipping the rule to error in the build gate: the same live
  // config with severity bumped must make `npm run lint` exit non-zero on drift.
  const strict = new ESLint({
    cwd: projectRoot,
    overrideConfig: { rules: { "local/canonical-scale": "error" } },
  });
  const results = await strict.lintText(`<div class="text-lg">x</div>`, {
    filePath: path.join(projectRoot, "src", "__strict__.astro"),
    warnIgnored: false,
  });
  const errorCount = results.reduce((n, r) => n + r.errorCount, 0);
  assert.ok(errorCount > 0, "off-scale size must produce a lint error when promoted");
});
