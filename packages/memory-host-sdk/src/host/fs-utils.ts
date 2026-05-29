// Filesystem safety re-exports and missing-file classification for memory reads.
import { configureFsSafePython } from "@openclaw/fs-safe/config";
/** Safe root resolver used to constrain workspace-relative file access. */
export { root } from "@openclaw/fs-safe/root";
/** Path containment helpers used before and after realpath resolution. */
export { isPathInside, isPathInsideWithRealpath } from "@openclaw/fs-safe/path";
/** Regular-file and symlink-parent guards for memory file reads. */
export {
  assertNoSymlinkParents,
  readRegularFile,
  statRegularFile,
  type RegularFileStatResult,
} from "@openclaw/fs-safe/advanced";
/** Safe directory walker used by memory indexing. */
export { walkDirectory, type WalkDirectoryEntry } from "@openclaw/fs-safe/walk";

const hasPythonModeOverride =
  process.env.FS_SAFE_PYTHON_MODE != null || process.env.OPENCLAW_FS_SAFE_PYTHON_MODE != null;

if (!hasPythonModeOverride) {
  configureFsSafePython({ mode: "off" });
}

/** Detects missing-file errors across Node and fs-safe error codes. */
export function isFileMissingError(
  err: unknown,
): err is NodeJS.ErrnoException & { code: "ENOENT" | "ENOTDIR" | "not-found" } {
  return Boolean(
    err &&
    typeof err === "object" &&
    "code" in err &&
    ((err as Partial<NodeJS.ErrnoException>).code === "ENOENT" ||
      (err as Partial<NodeJS.ErrnoException>).code === "ENOTDIR" ||
      (err as { code?: unknown }).code === "not-found"),
  );
}
