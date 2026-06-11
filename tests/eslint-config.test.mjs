// Behavioural tests for the ESLint class-hygiene layer (task 06). These exercise
// the real `eslint.config.mjs` via the ESLint Node API: the integration test runs
// the config over the actual `src/**/*.astro` source (parser + clean-pass), while
// the unit tests lint small in-memory `.astro` fixtures so `src/` stays untouched.

import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { ESLint } from "eslint";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// One ESLint instance bound to the project config (auto-discovers eslint.config.mjs).
const eslint = new ESLint({ cwd: projectRoot });

// Lint a fragment of Astro markup as if it were a file under src/, so the
// `src/**/*.astro` config (parser + Tailwind rules) applies. Returns the flat
// list of lint messages for that fragment.
async function lintMarkup(markup, name = "fixture") {
  const filePath = path.join(projectRoot, "src", `__${name}__.astro`);
  const results = await eslint.lintText(markup, { filePath, warnIgnored: false });
  return results.flatMap((r) => r.messages);
}

const errorsOf = (messages) => messages.filter((m) => m.severity === 2);
const byRule = (messages, ruleId) => messages.filter((m) => m.ruleId === ruleId);

test("integration: lints every src/**/*.astro without parser errors and exits clean", async () => {
  const results = await eslint.lintFiles(["src/**/*.astro"]);

  // The config actually matched and linted source files.
  assert.ok(results.length > 0, "expected at least one linted .astro file");

  // The Astro parser handled TS frontmatter on every file — no parse failures.
  const parseFailures = results.flatMap((r) =>
    r.messages.filter((m) => m.fatal || /Parsing error/i.test(m.message)),
  );
  assert.deepEqual(
    parseFailures.map((m) => m.message),
    [],
    "expected no Astro/TS parsing errors",
  );

  // `npm run lint` exits 0 on the current source: no error-severity messages.
  const totalErrors = results.reduce((n, r) => n + r.errorCount, 0);
  assert.equal(totalErrors, 0, "expected zero lint errors on current source");
});

test("unit: an unknown utility class is reported as an error", async () => {
  const messages = await lintMarkup(
    `<div class="totally-not-a-real-utility">x</div>`,
    "unknown",
  );
  const unknown = byRule(messages, "better-tailwindcss/no-unknown-classes");
  assert.ok(unknown.length > 0, "expected no-unknown-classes to flag the bad class");
  assert.ok(errorsOf(messages).length > 0, "unknown class must be an error");
});

test("unit: contradicting classes are reported as an error", async () => {
  const messages = await lintMarkup(`<div class="flex grid">x</div>`, "conflict");
  const conflicts = byRule(messages, "better-tailwindcss/no-conflicting-classes");
  assert.ok(conflicts.length > 0, "expected no-conflicting-classes to flag flex+grid");
  assert.ok(errorsOf(messages).length > 0, "conflicting classes must be an error");
});

test("unit: the documented arbitrary tracking-[0.2em] is NOT reported", async () => {
  const messages = await lintMarkup(
    `<p class="font-mono text-xs tracking-[0.2em] text-muted">x</p>`,
    "allowed-arbitrary",
  );
  assert.equal(
    byRule(messages, "better-tailwindcss/no-restricted-classes").length,
    0,
    "tracking-[0.2em] is allowlisted and must not be restricted",
  );
  assert.equal(errorsOf(messages).length, 0, "allowed markup must produce no errors");
});

test("unit: a non-allowlisted arbitrary value is surfaced (handling active)", async () => {
  const messages = await lintMarkup(`<div class="p-[7px]">x</div>`, "arbitrary");
  assert.ok(
    byRule(messages, "better-tailwindcss/no-restricted-classes").length > 0,
    "a non-allowlisted arbitrary should be flagged by the restriction rule",
  );
});
