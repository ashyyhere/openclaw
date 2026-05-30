// Version discovery helpers for bundled builds, npm/dev checkouts, and runtime services.
import { createRequire } from "node:module";
import { normalizeOptionalString } from "./shared/string-coerce.js";

// oxlint-disable-next-line eslint/no-underscore-dangle -- Bundled builds replace this compile-time define identifier.
declare const __OPENCLAW_VERSION__: string | undefined;
const CORE_PACKAGE_NAME = "openclaw";

const PACKAGE_JSON_CANDIDATES = [
  "../package.json",
  "../../package.json",
  "../../../package.json",
  "./package.json",
] as const;

const BUILD_INFO_CANDIDATES = [
  "../build-info.json",
  "../../build-info.json",
  "./build-info.json",
] as const;

function readVersionFromJsonCandidates(
  moduleUrl: string,
  candidates: readonly string[],
  opts: { requirePackageName?: boolean } = {},
): string | null {
  try {
    const require = createRequire(moduleUrl);
    for (const candidate of candidates) {
      try {
        const parsed = require(candidate) as { name?: string; version?: string };
        const version = normalizeOptionalString(parsed.version);
        if (!version) {
          continue;
        }
        if (opts.requirePackageName && parsed.name !== CORE_PACKAGE_NAME) {
          continue;
        }
        return version;
      } catch {
        // ignore missing or unreadable candidate
      }
    }
    return null;
  } catch {
    return null;
  }
}

function firstNonEmpty(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    const trimmed = normalizeOptionalString(value);
    if (trimmed && trimmed.toLowerCase() !== "undefined" && trimmed.toLowerCase() !== "null") {
      return trimmed;
    }
  }
  return undefined;
}

function readInjectedVersion(): string | undefined {
  return typeof __OPENCLAW_VERSION__ === "string" ? __OPENCLAW_VERSION__ : undefined;
}

/** Reads the core package version nearest a module URL, ignoring non-openclaw package.json files. */
export function readVersionFromPackageJsonForModuleUrl(moduleUrl: string): string | null {
  return readVersionFromJsonCandidates(moduleUrl, PACKAGE_JSON_CANDIDATES, {
    requirePackageName: true,
  });
}

/** Reads generated build-info metadata nearest a module URL when package metadata is unavailable. */
export function readVersionFromBuildInfoForModuleUrl(moduleUrl: string): string | null {
  return readVersionFromJsonCandidates(moduleUrl, BUILD_INFO_CANDIDATES);
}

/** Resolves version metadata for a module, preferring package.json over build-info. */
export function resolveVersionFromModuleUrl(moduleUrl: string): string | null {
  return (
    readVersionFromPackageJsonForModuleUrl(moduleUrl) ||
    readVersionFromBuildInfoForModuleUrl(moduleUrl)
  );
}

/** Resolves the binary version from injected defines, module metadata, bundled env, or fallback. */
export function resolveBinaryVersion(params: {
  moduleUrl: string;
  injectedVersion?: string;
  bundledVersion?: string;
  fallback?: string;
}): string {
  return (
    firstNonEmpty(params.injectedVersion) ||
    resolveVersionFromModuleUrl(params.moduleUrl) ||
    firstNonEmpty(params.bundledVersion) ||
    params.fallback ||
    "0.0.0"
  );
}

/** Environment shape used by runtime service and compatibility-host version resolvers. */
export type RuntimeVersionEnv = {
  [key: string]: string | undefined;
};

/** Fallback marker when service version metadata cannot be resolved from runtime sources. */
export const RUNTIME_SERVICE_VERSION_FALLBACK = "unknown";
type RuntimeVersionPreference = "env-first" | "runtime-first";

/** Filters out empty and synthetic binary fallback versions before service reporting uses them. */
export function resolveUsableRuntimeVersion(version: string | undefined): string | undefined {
  const trimmed = normalizeOptionalString(version);
  // "0.0.0" is the resolver's hard fallback when module metadata cannot be read.
  // Prefer explicit service/package markers in that edge case.
  if (!trimmed || trimmed === "0.0.0") {
    return undefined;
  }
  return trimmed;
}

function resolveVersionFromRuntimeSources(params: {
  env: RuntimeVersionEnv;
  runtimeVersion: string | undefined;
  fallback: string;
  preference: RuntimeVersionPreference;
}): string {
  const preferredCandidates =
    params.preference === "env-first"
      ? [params.env["OPENCLAW_VERSION"], params.runtimeVersion]
      : [params.runtimeVersion, params.env["OPENCLAW_VERSION"]];
  return (
    firstNonEmpty(
      ...preferredCandidates,
      params.env["OPENCLAW_SERVICE_VERSION"],
      params.env["npm_package_version"],
    ) ?? params.fallback
  );
}

/** Resolves the version reported by runtime services, preferring explicit service env values. */
export function resolveRuntimeServiceVersion(
  env: RuntimeVersionEnv = process.env as RuntimeVersionEnv,
  fallback = RUNTIME_SERVICE_VERSION_FALLBACK,
): string {
  return resolveVersionFromRuntimeSources({
    env,
    runtimeVersion: resolveUsableRuntimeVersion(VERSION),
    fallback,
    preference: "env-first",
  });
}

/** Resolves the version used for compatibility checks between a host and runtime service. */
export function resolveCompatibilityHostVersion(
  env: RuntimeVersionEnv = process.env as RuntimeVersionEnv,
  fallback = RUNTIME_SERVICE_VERSION_FALLBACK,
): string {
  const explicitCompatibilityVersion = firstNonEmpty(env.OPENCLAW_COMPATIBILITY_HOST_VERSION);
  if (explicitCompatibilityVersion) {
    return explicitCompatibilityVersion;
  }
  return resolveVersionFromRuntimeSources({
    env,
    runtimeVersion: resolveUsableRuntimeVersion(VERSION),
    fallback,
    preference: env === (process.env as RuntimeVersionEnv) ? "runtime-first" : "env-first",
  });
}

// Single source of truth for the current OpenClaw version.
// - Embedded/bundled builds: injected define or env var.
// - Dev/npm builds: package.json.
/** Current OpenClaw version for CLI/runtime code in this process. */
export const VERSION = resolveBinaryVersion({
  moduleUrl: import.meta.url,
  injectedVersion: readInjectedVersion(),
  bundledVersion: process.env.OPENCLAW_BUNDLED_VERSION,
});
