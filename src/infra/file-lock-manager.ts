// Re-exports fs-safe file lock manager with infra defaults initialized.
import "./fs-safe-defaults.js";

/** File lock manager primitives used to serialize durable file mutations. */
export {
  createFileLockManager,
  type FileLockHeldEntry,
  type FileLockManager,
} from "@openclaw/fs-safe/file-lock";
