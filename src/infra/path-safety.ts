/** Re-exports hardened path-safety helpers after installing safe fs defaults. */
import "./fs-safe-defaults.js";
/** Public path guards and safe filesystem probes from the fs-safe package. */
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
/** Formatting helper for POSIX mode values used in diagnostics. */
export { formatPosixMode } from "@openclaw/fs-safe/advanced";
