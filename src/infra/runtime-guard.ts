// Startup runtime guard for supported Node versions.
// Keeps CLI failures explicit before deeper gateway code runs on an unsupported engine.
import process from "node:process";
import { defaultRuntime, type RuntimeEnv } from "../runtime.js";

type RuntimeKind = "node" | "unknown";

type Semver = {
  major: number;
  minor: number;
  patch: number;
};

const MIN_NODE: Semver = { major: 22, minor: 19, patch: 0 };
const MINIMUM_ENGINE_RE = /^\s*>=\s*v?(\d+\.\d+\.\d+)\s*$/i;

/** Runtime facts used for support checks and user-facing diagnostics. */
export type RuntimeDetails = {
  kind: RuntimeKind;
  version: string | null;
  execPath: string | null;
  pathEnv: string;
};

const SEMVER_RE = /(\d+)\.(\d+)\.(\d+)/;

/** Parse the first x.y.z semver triplet from a runtime version string. */
export function parseSemver(version: string | null): Semver | null {
  if (!version) {
    return null;
  }
  const match = version.match(SEMVER_RE);
  if (!match) {
    return null;
  }
  const [, major, minor, patch] = match;
  return {
    major: Number.parseInt(major, 10),
    minor: Number.parseInt(minor, 10),
    patch: Number.parseInt(patch, 10),
  };
}

/** Return whether a parsed semver value is greater than or equal to a minimum. */
export function isAtLeast(version: Semver | null, minimum: Semver): boolean {
  if (!version) {
    return false;
  }
  if (version.major !== minimum.major) {
    return version.major > minimum.major;
  }
  if (version.minor !== minimum.minor) {
    return version.minor > minimum.minor;
  }
  return version.patch >= minimum.patch;
}

/** Detect the current JavaScript runtime and PATH context. */
export function detectRuntime(): RuntimeDetails {
  const kind: RuntimeKind = process.versions?.node ? "node" : "unknown";
  const version = process.versions?.node ?? null;

  return {
    kind,
    version,
    execPath: process.execPath ?? null,
    pathEnv: process.env.PATH ?? "(not set)",
  };
}

/** Return whether detected runtime details satisfy OpenClaw's minimum engine. */
export function runtimeSatisfies(details: RuntimeDetails): boolean {
  const parsed = parseSemver(details.version);
  if (details.kind === "node") {
    return isAtLeast(parsed, MIN_NODE);
  }
  return false;
}

/** Return whether a Node version string satisfies OpenClaw's built-in minimum. */
export function isSupportedNodeVersion(version: string | null): boolean {
  return isAtLeast(parseSemver(version), MIN_NODE);
}

/** Parse a package engines.node minimum when it is a simple >=x.y.z constraint. */
export function parseMinimumNodeEngine(engine: string | null): Semver | null {
  if (!engine) {
    return null;
  }
  const match = engine.match(MINIMUM_ENGINE_RE);
  if (!match) {
    return null;
  }
  return parseSemver(match[1] ?? null);
}

/** Return whether a Node version satisfies a simple engines.node minimum. */
export function nodeVersionSatisfiesEngine(
  version: string | null,
  engine: string | null,
): boolean | null {
  const minimum = parseMinimumNodeEngine(engine);
  if (!minimum) {
    return null;
  }
  return isAtLeast(parseSemver(version), minimum);
}

/** Exit with a clear diagnostic when the current runtime is unsupported. */
export function assertSupportedRuntime(
  runtime: RuntimeEnv = defaultRuntime,
  details: RuntimeDetails = detectRuntime(),
): void {
  if (runtimeSatisfies(details)) {
    return;
  }

  const versionLabel = details.version ?? "unknown";
  const runtimeLabel =
    details.kind === "unknown" ? "unknown runtime" : `${details.kind} ${versionLabel}`;
  const execLabel = details.execPath ?? "unknown";

  runtime.error(
    [
      "openclaw requires Node >=22.19.0.",
      `Detected: ${runtimeLabel} (exec: ${execLabel}).`,
      `PATH searched: ${details.pathEnv}`,
      "Install Node: https://nodejs.org/en/download",
      "Upgrade Node and re-run openclaw.",
    ].join("\n"),
  );
  runtime.exit(1);
}
