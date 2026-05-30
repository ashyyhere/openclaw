// Re-exports fs-safe path alias escape guards with infra defaults loaded.
import "./fs-safe-defaults.js";
/** Path alias policies and guards that prevent alias escape. */
export {
  PATH_ALIAS_POLICIES,
  assertNoPathAliasEscape,
  type PathAliasPolicy,
} from "@openclaw/fs-safe/advanced";
