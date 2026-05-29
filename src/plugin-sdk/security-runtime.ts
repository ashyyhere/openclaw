/**
 * @deprecated Broad public SDK barrel. Prefer focused security/SSRF/secret
 * subpaths and avoid adding new imports here.
 */

import { root as fsRoot, type OpenResult } from "../infra/fs-safe.js";

export * from "../secrets/channel-secret-collector-runtime.js";
export * from "../secrets/runtime-shared.js";
export * from "../secrets/shared.js";
/** Shared type for this surface in src/plugin-sdk. */
export type * from "../secrets/target-registry-types.js";
export * from "../security/channel-metadata.js";
export * from "../security/context-visibility.js";
export * from "./channel-access-compat.js";
/** Re-exported API for src/plugin-sdk. */
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
/** Re-exported API for src/plugin-sdk. */
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

/** Reused helper for open File Within Root behavior in src/plugin-sdk. */
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

/** Reused helper for write File From Path Within Root behavior in src/plugin-sdk. */
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

/** Re-exported API for src/plugin-sdk, starting with extract Error Code. */
export { extractErrorCode, formatErrorMessage } from "../infra/errors.js";
/** Re-exported API for src/plugin-sdk, starting with has Proxy Env Configured. */
export { hasProxyEnvConfigured } from "../infra/net/proxy-env.js";
/** Re-exported API for src/plugin-sdk, starting with normalize Hostname. */
export { normalizeHostname } from "../infra/net/hostname.js";
/** Re-exported API for src/plugin-sdk. */
export {
  SsrFBlockedError,
  isBlockedHostnameOrIp,
  isPrivateNetworkAllowedByPolicy,
  matchesHostnameAllowlist,
  resolvePinnedHostnameWithPolicy,
  type LookupFn,
  type SsrFPolicy,
} from "../infra/net/ssrf.js";
/** Re-exported API for src/plugin-sdk, starting with is Not Found Path Error. */
export { isNotFoundPathError, isPathInside } from "../infra/path-guards.js";
/** Re-exported API for src/plugin-sdk. */
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
/** Re-exported API for src/plugin-sdk, starting with sanitize Untrusted File Name. */
export { sanitizeUntrustedFileName } from "../infra/fs-safe-advanced.js";
/** Re-exported API for src/plugin-sdk. */
export {
  privateFileStore,
  privateFileStoreSync,
  type PrivateFileStore,
} from "../infra/private-file-store.js";
/** Re-exported API for src/plugin-sdk. */
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
/** Re-exported API for src/plugin-sdk. */
export {
  writeSiblingTempFile,
  type WriteSiblingTempFileOptions,
  type WriteSiblingTempFileResult,
} from "../infra/sibling-temp-file.js";
/** Re-exported API for src/plugin-sdk. */
export {
  assertNoSymlinkParents,
  assertNoSymlinkParentsSync,
  type AssertNoSymlinkParentsOptions,
} from "../infra/fs-safe-advanced.js";
/** Re-exported API for src/plugin-sdk, starting with ensure Port Available. */
export { ensurePortAvailable } from "../infra/ports.js";
/** Re-exported API for src/plugin-sdk, starting with generate Secure Token. */
export { generateSecureToken } from "../infra/secure-random.js";
/** Re-exported API for src/plugin-sdk. */
export {
  resolveExistingPathsWithinRoot,
  pathScope,
  resolvePathsWithinRoot,
  resolvePathWithinRoot,
  resolveStrictExistingPathsWithinRoot,
  resolveWritablePathWithinRoot,
} from "../infra/root-paths.js";
/** Re-exported API for src/plugin-sdk, starting with write Via Sibling Temp Path. */
export { writeViaSiblingTempPath } from "../infra/fs-safe-advanced.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Preferred Open Claw Tmp Dir. */
export { resolvePreferredOpenClawTmpDir } from "../infra/tmp-openclaw-dir.js";
/** Re-exported API for src/plugin-sdk, starting with redact Sensitive Text. */
export { redactSensitiveText } from "../logging/redact.js";
/** Re-exported API for src/plugin-sdk, starting with safe Equal Secret. */
export { safeEqualSecret } from "../security/secret-equal.js";
