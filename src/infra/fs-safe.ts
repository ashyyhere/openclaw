// infra fs safe helpers and runtime behavior.
import "./fs-safe-defaults.js";
import fs from "node:fs/promises";
import path from "node:path";
import {
  ensureDirectoryWithinRoot,
  findExistingAncestor,
  writeViaSiblingTempPath,
} from "@openclaw/fs-safe/advanced";
import { root as fsSafeRoot, type ReadResult } from "@openclaw/fs-safe/root";

/** Re-exported API for src/infra, starting with Fs Safe Error. */
export { FsSafeError, type FsSafeErrorCode } from "@openclaw/fs-safe/errors";
/** Re-exported API for src/infra. */
export {
  assertAbsolutePathInput,
  canonicalPathFromExistingAncestor,
  findExistingAncestor,
  resolveAbsolutePathForRead,
  resolveAbsolutePathForWrite,
  type AbsolutePathSymlinkPolicy,
  type EnsureAbsoluteDirectoryOptions,
  type EnsureAbsoluteDirectoryResult,
  type ResolvedAbsolutePath,
  type ResolvedWritableAbsolutePath,
} from "@openclaw/fs-safe/advanced";
/** Re-exported API for src/infra, starting with is Path Inside. */
export { isPathInside } from "@openclaw/fs-safe/path";
/** Re-exported API for src/infra, starting with path Exists. */
export { pathExists, pathExistsSync } from "@openclaw/fs-safe/advanced";
/** Re-exported API for src/infra, starting with move Path To Trash. */
export { movePathToTrash, type MovePathToTrashOptions } from "@openclaw/fs-safe/advanced";
/** Re-exported API for src/infra, starting with read Local File From Roots. */
export { readLocalFileFromRoots, resolveLocalPathFromRootsSync } from "@openclaw/fs-safe/advanced";
/** Re-exported API for src/infra. */
export {
  appendRegularFile,
  appendRegularFileSync,
  readRegularFile,
  readRegularFileSync,
  resolveRegularFileAppendFlags,
  statRegularFile,
  statRegularFileSync,
} from "@openclaw/fs-safe/advanced";
/** Re-exported API for src/infra. */
export {
  openLocalFileSafely,
  readLocalFileSafely,
  resolveOpenedFileRealPathForHandle,
  root,
  type OpenResult,
  type ReadResult,
} from "@openclaw/fs-safe/root";
/** Re-exported API for src/infra, starting with sanitize Untrusted File Name. */
export { sanitizeUntrustedFileName } from "@openclaw/fs-safe/advanced";
/** Re-exported API for src/infra. */
export {
  readSecureFile,
  type SecureFileReadOptions,
  type SecureFileReadResult,
} from "@openclaw/fs-safe/secure-file";
/** Re-exported API for src/infra. */
export {
  walkDirectory,
  walkDirectorySync,
  type WalkDirectoryEntry,
  type WalkDirectoryOptions,
  type WalkDirectoryResult,
} from "@openclaw/fs-safe/walk";
/** Re-exported API for src/infra, starting with with Timeout. */
export { withTimeout } from "@openclaw/fs-safe/advanced";

/** Shared type for External File Write Options in src/infra. */
export type ExternalFileWriteOptions = {
  rootDir: string;
  path: string;
  write: (tempPath: string) => Promise<void>;
  fallbackFileName?: string;
  tempPrefix?: string;
};

/** Shared type for External File Write Result in src/infra. */
export type ExternalFileWriteResult = {
  path: string;
};

/** Reused helper for ensure Absolute Directory behavior in src/infra. */
export async function ensureAbsoluteDirectory(
  dirPath: string,
  options?: { scopeLabel?: string; mode?: number },
): Promise<{ ok: true; path: string } | { ok: false; error: Error }> {
  const absolutePath = path.resolve(dirPath);
  const scopeLabel = options?.scopeLabel ?? "directory";
  const existingAncestor = await findExistingAncestor(absolutePath);
  if (!existingAncestor) {
    return { ok: false, error: new Error(`Invalid path: must stay within ${scopeLabel}`) };
  }
  if (existingAncestor === absolutePath) {
    try {
      const stat = await fs.lstat(absolutePath);
      if (!stat.isSymbolicLink() && stat.isDirectory()) {
        return { ok: true, path: absolutePath };
      }
    } catch {
      // Fall through to the uniform invalid-path result below.
    }
    return { ok: false, error: new Error(`Invalid path: must stay within ${scopeLabel}`) };
  }
  const result = await ensureDirectoryWithinRoot({
    rootDir: existingAncestor,
    requestedPath: path.relative(existingAncestor, absolutePath),
    scopeLabel,
    mode: options?.mode,
  });
  if (result.ok) {
    return result;
  }
  return { ok: false, error: new Error(result.error) };
}

/** Reused helper for write External File Within Root behavior in src/infra. */
export async function writeExternalFileWithinRoot(
  options: ExternalFileWriteOptions,
): Promise<ExternalFileWriteResult> {
  const targetPath = path.resolve(options.rootDir, options.path);
  await writeViaSiblingTempPath({
    rootDir: options.rootDir,
    targetPath,
    writeTemp: options.write,
    fallbackFileName: options.fallbackFileName,
    tempPrefix: options.tempPrefix,
  });
  return { path: targetPath };
}

/** @deprecated Use root(rootDir).read(relativePath, options). */
export async function readFileWithinRoot(params: {
  rootDir: string;
  relativePath: string;
  rejectHardlinks?: boolean;
  nonBlockingRead?: boolean;
  allowSymlinkTargetWithinRoot?: boolean;
  maxBytes?: number;
}): Promise<ReadResult> {
  const root = await fsSafeRoot(params.rootDir);
  return await root.read(params.relativePath, {
    hardlinks: params.rejectHardlinks === false ? "allow" : "reject",
    maxBytes: params.maxBytes,
    nonBlockingRead: params.nonBlockingRead,
    symlinks: params.allowSymlinkTargetWithinRoot === true ? "follow-within-root" : "reject",
  });
}

/** @deprecated Use root(rootDir).write(relativePath, data, options). */
export async function writeFileWithinRoot(params: {
  rootDir: string;
  relativePath: string;
  data: string | Buffer;
  encoding?: BufferEncoding;
  mkdir?: boolean;
}): Promise<void> {
  const root = await fsSafeRoot(params.rootDir);
  await root.write(params.relativePath, params.data, {
    encoding: params.encoding,
    mkdir: params.mkdir,
  });
}
