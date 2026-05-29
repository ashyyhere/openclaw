// infra file lock manager helpers and runtime behavior.
import "./fs-safe-defaults.js";

/** Re-exported API for src/infra. */
export {
  createFileLockManager,
  type FileLockHeldEntry,
  type FileLockManager,
} from "@openclaw/fs-safe/file-lock";
