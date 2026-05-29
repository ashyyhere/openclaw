// packages/memory-host-sdk/src/host fs utils helpers and runtime behavior.
import { configureFsSafePython } from "@openclaw/fs-safe/config";
/** Re-exported public API for packages/memory-host-sdk, starting with root. */
export { root } from "@openclaw/fs-safe/root";
/** Re-exported public API for packages/memory-host-sdk, starting with is Path Inside. */
export { isPathInside, isPathInsideWithRealpath } from "@openclaw/fs-safe/path";
/** Re-exported public API for packages/memory-host-sdk. */
export {
  assertNoSymlinkParents,
  readRegularFile,
  statRegularFile,
  type RegularFileStatResult,
} from "@openclaw/fs-safe/advanced";
/** Re-exported public API for packages/memory-host-sdk, starting with walk Directory. */
export { walkDirectory, type WalkDirectoryEntry } from "@openclaw/fs-safe/walk";

const hasPythonModeOverride =
  process.env.FS_SAFE_PYTHON_MODE != null || process.env.OPENCLAW_FS_SAFE_PYTHON_MODE != null;

if (!hasPythonModeOverride) {
  configureFsSafePython({ mode: "off" });
}

/** Public helper for is File Missing Error behavior in packages/memory-host-sdk. */
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
