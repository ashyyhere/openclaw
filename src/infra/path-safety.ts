// infra path safety helpers and runtime behavior.
import "./fs-safe-defaults.js";
/** Re-exported API for src/infra. */
export {
  isNotFoundPathError,
  hasNodeErrorCode,
  isNodeError,
  isPathInside,
  isPathInsideWithRealpath,
  isSymlinkOpenError,
  isWithinDir,
  normalizeWindowsPathForComparison,
  resolveSafeBaseDir,
  resolveSafeRelativePath,
  safeRealpathSync,
  safeStatSync,
  splitSafeRelativePath,
} from "@openclaw/fs-safe/path";
/** Re-exported API for src/infra, starting with format Posix Mode. */
export { formatPosixMode } from "@openclaw/fs-safe/advanced";
