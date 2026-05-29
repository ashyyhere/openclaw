// infra root paths helpers and runtime behavior.
import "./fs-safe-defaults.js";
/** Re-exported API for src/infra. */
export {
  ensureDirectoryWithinRoot,
  resolveExistingPathsWithinRoot,
  resolvePathsWithinRoot,
  resolvePathWithinRoot,
  resolveStrictExistingPathsWithinRoot,
  resolveWritablePathWithinRoot,
} from "@openclaw/fs-safe/advanced";
/** Re-exported API for src/infra, starting with path Scope. */
export { pathScope } from "@openclaw/fs-safe/advanced";
