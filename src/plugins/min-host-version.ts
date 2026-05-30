// Validates plugin manifest host-version floors against the running OpenClaw host.
import { isAtLeast, parseSemver } from "../infra/runtime-guard.js";

/** Human-readable contract for manifest `openclaw.install.minHostVersion`. */
export const MIN_HOST_VERSION_FORMAT =
  'openclaw.install.minHostVersion must use a semver floor in the form ">=x.y.z[-prerelease][+build]"';
const SEMVER_LABEL_RE = String.raw`\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?`;
const MIN_HOST_VERSION_RE = new RegExp(`^>=(${SEMVER_LABEL_RE})$`);
const LEGACY_MIN_HOST_VERSION_RE = /^(\d+)\.(\d+)\.(\d+)$/;

/** Parsed semver floor from a plugin manifest requirement. */
export type MinHostVersionRequirement = {
  raw: string;
  minimumLabel: string;
};

import { normalizeOptionalString } from "../shared/string-coerce.js";

/** Compatibility decision for a plugin requirement and a concrete host version. */
export type MinHostVersionCheckResult =
  | { ok: true; requirement: MinHostVersionRequirement | null }
  | { ok: false; kind: "invalid"; error: string }
  | { ok: false; kind: "unknown_host_version"; requirement: MinHostVersionRequirement }
  | {
      ok: false;
      kind: "incompatible";
      requirement: MinHostVersionRequirement;
      currentVersion: string;
    };

/** Parse the supported `>=x.y.z` requirement, with legacy bare-semver opt-in for shipped data. */
export function parseMinHostVersionRequirement(
  raw: unknown,
  options: { allowLegacyBareSemver?: boolean } = {},
): MinHostVersionRequirement | null {
  if (typeof raw !== "string") {
    return null;
  }
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }
  const match =
    trimmed.match(MIN_HOST_VERSION_RE) ??
    (options.allowLegacyBareSemver ? trimmed.match(LEGACY_MIN_HOST_VERSION_RE) : null);
  if (!match) {
    return null;
  }
  const minimumLabel = match.length >= 4 ? `${match[1]}.${match[2]}.${match[3]}` : (match[1] ?? "");
  if (!parseSemver(minimumLabel)) {
    return null;
  }
  return {
    raw: trimmed,
    minimumLabel,
  };
}

/** Return a manifest validation error string, or null when the requirement is absent/valid. */
export function validateMinHostVersion(raw: unknown): string | null {
  if (raw === undefined) {
    return null;
  }
  return parseMinHostVersionRequirement(raw) ? null : MIN_HOST_VERSION_FORMAT;
}

/** Compare a manifest host-version floor with the current host and classify failures. */
export function checkMinHostVersion(params: {
  currentVersion: string | undefined;
  minHostVersion: unknown;
  allowLegacyBareSemver?: boolean;
}): MinHostVersionCheckResult {
  if (params.minHostVersion === undefined) {
    return { ok: true, requirement: null };
  }
  const requirement = parseMinHostVersionRequirement(params.minHostVersion, {
    allowLegacyBareSemver: params.allowLegacyBareSemver,
  });
  if (!requirement) {
    return { ok: false, kind: "invalid", error: MIN_HOST_VERSION_FORMAT };
  }
  const currentVersion = normalizeOptionalString(params.currentVersion) || "unknown";
  const currentSemver = parseSemver(currentVersion);
  if (!currentSemver) {
    return {
      ok: false,
      kind: "unknown_host_version",
      requirement,
    };
  }
  const minimumSemver = parseSemver(requirement.minimumLabel)!;
  if (!isAtLeast(currentSemver, minimumSemver)) {
    return {
      ok: false,
      kind: "incompatible",
      requirement,
      currentVersion,
    };
  }
  return { ok: true, requirement };
}
