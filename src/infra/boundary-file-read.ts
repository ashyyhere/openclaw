// Applies fs-safe defaults before exposing guarded root-file open helpers.
import "./fs-safe-defaults.js";
/** Root-file open helpers that classify permission and boundary failures. */
export {
  canUseRootFileOpen,
  matchRootFileOpenFailure,
  openRootFile,
  openRootFileSync,
  type OpenRootFileParams,
  type OpenRootFileSyncParams,
  type RootFileOpenFailure,
  type RootFileOpenFailureReason,
  type RootFileOpenResult,
} from "@openclaw/fs-safe/advanced";
