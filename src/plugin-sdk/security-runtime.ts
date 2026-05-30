/**
 * @deprecated Broad public SDK barrel. Prefer focused security/SSRF/secret
 * subpaths and avoid adding new imports here.
 */

import { root as fsRoot, type OpenResult } from "../infra/fs-safe.js";

export * from "../secrets/channel-secret-collector-runtime.js";
export * from "../secrets/runtime-shared.js";
export * from "../secrets/shared.js";
/** Secret target registry type contracts. */
export type * from "../secrets/target-registry-types.js";
export * from "../security/channel-metadata.js";
export * from "../security/context-visibility.js";
export * from "./channel-access-compat.js";
/** Access-group allow-from parsing and membership resolution helpers. */
export {
  ACCESS_GROUP_ALLOW_FROM_PREFIX,
  expandAllowFromWithAccessGroups,
  parseAccessGroupAllowFromEntry,
  resolveAccessGroupAllowFromMatches,
  resolveAccessGroupAllowFromState,
  type AccessGroupMembershipResolver,
  type AccessGroupMembershipLookup,
  type ResolvedAccessGroupAllowFromState,
} from "./access-groups.js";
export * from "../security/external-content.js";
export * from "../security/safe-regex.js";
/** Safe file access primitives for plugin-owned filesystem operations. */
export {
  appendRegularFile,
  appendRegularFileSync,
  FsSafeError,
  FsSafeError as SafeOpenError,
  openLocalFileSafely,
  pathExists,
  pathExistsSync,
  readRegularFile,
  resolveLocalPathFromRootsSync,
  readRegularFileSync,
  resolveRegularFileAppendFlags,
  root,
  statRegularFile,
  statRegularFileSync,
  writeExternalFileWithinRoot,
  withTimeout,
  type ExternalFileWriteOptions,
  type ExternalFileWriteResult,
  type FsSafeErrorCode as SafeOpenErrorCode,
} from "../infra/fs-safe.js";

/** Opens a file relative to a trusted root using fs-safe root semantics. */
export async function openFileWithinRoot(params: {
  rootDir: string;
  relativePath: string;
  rejectHardlinks?: boolean;
  nonBlockingRead?: boolean;
  allowSymlinkTargetWithinRoot?: boolean;
}): Promise<OpenResult> {
  const root = await fsRoot(params.rootDir);
  return await root.open(params.relativePath, {
    hardlinks: params.rejectHardlinks === false ? "allow" : "reject",
    nonBlockingRead: params.nonBlockingRead,
    symlinks: params.allowSymlinkTargetWithinRoot === true ? "follow-within-root" : "reject",
  });
}

/** Copies an external source file into a trusted root path. */
export async function writeFileFromPathWithinRoot(params: {
  rootDir: string;
  relativePath: string;
  sourcePath: string;
  mkdir?: boolean;
}): Promise<void> {
  const root = await fsRoot(params.rootDir);
  await root.copyIn(params.relativePath, params.sourcePath, {
    mkdir: params.mkdir,
    sourceHardlinks: "reject",
  });
}

/** Error formatting helpers for plugin boundary failures. */
export { extractErrorCode, formatErrorMessage } from "../infra/errors.js";
/** Proxy environment detection helper for network clients. */
export { hasProxyEnvConfigured } from "../infra/net/proxy-env.js";
/** Hostname normalization helper for network policy checks. */
export { normalizeHostname } from "../infra/net/hostname.js";
/** SSRF policy helpers for hostname/IP allowlists and pinned resolution. */
export {
  SsrFBlockedError,
  isBlockedHostnameOrIp,
  isPrivateNetworkAllowedByPolicy,
  matchesHostnameAllowlist,
  resolvePinnedHostnameWithPolicy,
  type LookupFn,
  type SsrFPolicy,
} from "../infra/net/ssrf.js";
/** Path containment and not-found error helpers. */
export { isNotFoundPathError, isPathInside } from "../infra/path-guards.js";
/** Absolute path validation and safe read/write resolution helpers. */
export {
  assertAbsolutePathInput,
  canonicalPathFromExistingAncestor,
  ensureAbsoluteDirectory,
  findExistingAncestor,
  resolveAbsolutePathForRead,
  resolveAbsolutePathForWrite,
  type AbsolutePathSymlinkPolicy,
  type EnsureAbsoluteDirectoryOptions,
  type EnsureAbsoluteDirectoryResult,
  type ResolvedAbsolutePath,
  type ResolvedWritableAbsolutePath,
} from "../infra/fs-safe.js";
/** Filename sanitizer for untrusted user/provider input. */
export { sanitizeUntrustedFileName } from "../infra/fs-safe-advanced.js";
/** Private file store factories for plugin-local persistent data. */
export {
  privateFileStore,
  privateFileStoreSync,
  type PrivateFileStore,
} from "../infra/private-file-store.js";
/** Atomic replace and move-with-copy-fallback file helpers. */
export {
  movePathWithCopyFallback,
  replaceFileAtomic,
  replaceFileAtomicSync,
  type MovePathWithCopyFallbackOptions,
  type ReplaceFileAtomicFileSystem,
  type ReplaceFileAtomicOptions,
  type ReplaceFileAtomicResult,
  type ReplaceFileAtomicSyncFileSystem,
  type ReplaceFileAtomicSyncOptions,
} from "../infra/replace-file.js";
/** Sibling temporary file writer for atomic write workflows. */
export {
  writeSiblingTempFile,
  type WriteSiblingTempFileOptions,
  type WriteSiblingTempFileResult,
} from "../infra/sibling-temp-file.js";
/** Symlink-parent guards for filesystem trust boundaries. */
export {
  assertNoSymlinkParents,
  assertNoSymlinkParentsSync,
  type AssertNoSymlinkParentsOptions,
} from "../infra/fs-safe-advanced.js";
/** Port availability probe for local service setup. */
export { ensurePortAvailable } from "../infra/ports.js";
/** Secure random token generator. */
export { generateSecureToken } from "../infra/secure-random.js";
/** Root-scoped path resolution helpers for read/write operations. */
export {
  resolveExistingPathsWithinRoot,
  pathScope,
  resolvePathsWithinRoot,
  resolvePathWithinRoot,
  resolveStrictExistingPathsWithinRoot,
  resolveWritablePathWithinRoot,
} from "../infra/root-paths.js";
/** Writes via a sibling temporary path before replacing the target. */
export { writeViaSiblingTempPath } from "../infra/fs-safe-advanced.js";
/** Resolves the preferred OpenClaw temporary directory. */
export { resolvePreferredOpenClawTmpDir } from "../infra/tmp-openclaw-dir.js";
/** Redacts sensitive values from log text. */
export { redactSensitiveText } from "../logging/redact.js";
/** Constant-time comparison helper for secret strings. */
export { safeEqualSecret } from "../security/secret-equal.js";
