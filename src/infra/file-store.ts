// Imports fs-safe defaults before exposing the shared file-store facade.
import "./fs-safe-defaults.js";
/** File-backed store API with OpenClaw's fs-safe defaults applied first. */
export {
  fileStore,
  type FileStore,
  type FileStoreOptions,
  type FileStorePruneOptions,
  type FileStoreWriteOptions,
} from "@openclaw/fs-safe/store";
