// Re-exports fs-safe root-scoped path helpers with infra defaults loaded.
import "./fs-safe-defaults.js";
/** Root-bound path resolution helpers for read/write operations. */
export {
  ensureDirectoryWithinRoot,
  resolveExistingPathsWithinRoot,
  resolvePathsWithinRoot,
  resolvePathWithinRoot,
  resolveStrictExistingPathsWithinRoot,
  resolveWritablePathWithinRoot,
} from "@openclaw/fs-safe/advanced";
/** Tagged path scope helper for root-bound fs-safe operations. */
export { pathScope } from "@openclaw/fs-safe/advanced";
