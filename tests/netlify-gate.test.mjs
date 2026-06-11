// Build-gate wiring tests (task 08). The Netlify build command IS the hard gate;
// these assert that `npm run lint` is the FIRST step, so a style-drift violation
// short-circuits before the expensive check/build/link/Lighthouse steps (ADR-003).
// Static assertions over netlify.toml — no network or Netlify runtime needed.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const netlifyToml = readFileSync(path.join(projectRoot, "netlify.toml"), "utf8");

// Extract the build command string (the value of `command = "..."` under [build]).
function buildCommand() {
  const match = netlifyToml.match(/^\s*command\s*=\s*"((?:[^"\\]|\\.)*)"/m);
  assert.ok(match, "expected a build command in netlify.toml");
  return match[1];
}

test("unit: the build command runs `npm run lint` as a gate step", () => {
  assert.match(buildCommand(), /npm run lint/, "lint must be wired into the build gate");
});

test("unit: lint runs before build (and before check/link)", () => {
  const cmd = buildCommand();
  const lintAt = cmd.indexOf("npm run lint");
  const checkAt = cmd.indexOf("npm run check");
  const buildAt = cmd.indexOf("npm run build");
  const linkAt = cmd.indexOf("linkinator");

  assert.ok(lintAt >= 0 && buildAt >= 0, "expected both lint and build in the command");
  assert.ok(lintAt < buildAt, "lint must run before build so drift short-circuits");
  assert.ok(lintAt < checkAt, "lint must run before check");
  assert.ok(lintAt < linkAt, "lint must run before the linkinator link check");
});

test("unit: gate steps are chained with `&&` so a non-zero step fails the build", () => {
  const cmd = buildCommand();
  // lint && check && build && linkinator — each `&&` short-circuits on failure.
  assert.match(cmd, /npm run lint\s*&&/, "lint must be `&&`-chained to short-circuit on failure");
});
