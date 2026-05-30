/** Re-exports fs-safe path guards after installing safe fs defaults. */
import "./fs-safe-defaults.js";
/** Public path containment and node-error guards from fs-safe. */
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
