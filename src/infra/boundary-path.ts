// Re-exports fs-safe root path resolution helpers with infra defaults loaded.
import "./fs-safe-defaults.js";
/** Root path alias and boundary resolution primitives from fs-safe. */
export {
  ROOT_PATH_ALIAS_POLICIES,
  resolvePathViaExistingAncestorSync,
  resolveRootPath,
  resolveRootPathSync,
  type ResolvedRootPath,
  type RootPathAliasPolicy,
} from "@openclaw/fs-safe/advanced";
