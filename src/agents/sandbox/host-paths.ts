/** Normalizes host paths for sandbox bind policy comparisons. */
import { posix } from "node:path";
import { resolvePathViaExistingAncestorSync } from "../../infra/boundary-path.js";

function stripWindowsNamespacePrefix(input: string): string {
  if (input.startsWith("\\\\?\\")) {
    const withoutPrefix = input.slice(4);
    if (withoutPrefix.toUpperCase().startsWith("UNC\\")) {
      return `\\\\${withoutPrefix.slice(4)}`;
    }
    return withoutPrefix;
  }
  if (input.startsWith("//?/")) {
    const withoutPrefix = input.slice(4);
    if (withoutPrefix.toUpperCase().startsWith("UNC/")) {
      return `//${withoutPrefix.slice(4)}`;
    }
    return withoutPrefix;
  }
  return input;
}

/** Detects absolute Windows drive paths after namespace-prefix stripping. */
export function isWindowsDriveAbsolutePath(raw: string): boolean {
  return /^[A-Za-z]:[\\/]/.test(stripWindowsNamespacePrefix(raw.trim()));
}

/** Checks whether a sandbox host path is absolute on POSIX or Windows. */
export function isSandboxHostPathAbsolute(raw: string): boolean {
  const trimmed = stripWindowsNamespacePrefix(raw.trim());
  return trimmed.startsWith("/") || isWindowsDriveAbsolutePath(trimmed);
}

/**
 * Normalize a host path: resolve `.`, `..`, collapse `//`, strip trailing `/`.
 * Windows drive-letter paths preserve the drive root and uppercase the drive letter.
 */
/** Normalizes host paths into stable slash-separated policy keys. */
export function normalizeSandboxHostPath(raw: string): string {
  const trimmed = stripWindowsNamespacePrefix(raw.trim());
  if (!trimmed) {
    return "/";
  }
  let normalTrimmed = trimmed.replaceAll("\\", "/");
  if (isWindowsDriveAbsolutePath(normalTrimmed)) {
    normalTrimmed = normalTrimmed.charAt(0).toUpperCase() + normalTrimmed.slice(1);
  }
  const normalized = posix.normalize(normalTrimmed);
  const withoutTrailingSlash = normalized.replace(/\/+$/, "") || "/";
  if (/^[A-Z]:$/.test(withoutTrailingSlash)) {
    return `${withoutTrailingSlash}/`;
  }
  return withoutTrailingSlash;
}

/** Returns the normalized path key used for host access policy checks. */
export function getSandboxHostPathPolicyKey(raw: string): string {
  const normalized = normalizeSandboxHostPath(raw);
  if (isWindowsDriveAbsolutePath(normalized)) {
    return normalized.toLowerCase();
  }
  return normalized;
}

/**
 * Resolve a path through the deepest existing ancestor so parent symlinks are honored
 * even when the final source leaf does not exist yet.
 */
/** Resolves symlinks through the nearest existing ancestor for policy checks. */
export function resolveSandboxHostPathViaExistingAncestor(sourcePath: string): string {
  if (!isSandboxHostPathAbsolute(sourcePath)) {
    return sourcePath;
  }
  if (isWindowsDriveAbsolutePath(sourcePath) && process.platform !== "win32") {
    return normalizeSandboxHostPath(sourcePath);
  }
  return normalizeSandboxHostPath(resolvePathViaExistingAncestorSync(sourcePath));
}
