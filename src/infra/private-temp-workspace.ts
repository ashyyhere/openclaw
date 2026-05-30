// Applies fs-safe defaults before exposing private temporary workspace helpers.
import "./fs-safe-defaults.js";
/** Temporary workspace helpers with automatic cleanup semantics. */
export {
  tempWorkspace,
  tempWorkspaceSync,
  type TempWorkspace,
  type TempWorkspaceOptions,
  type TempWorkspaceSync,
  withTempWorkspace,
  withTempWorkspaceSync,
} from "@openclaw/fs-safe/temp";
