// Re-exports fs-safe sibling temp-file writes with infra defaults loaded.
import "./fs-safe-defaults.js";
/** Creates temp files beside the destination so atomic renames stay on-device. */
export {
  writeSiblingTempFile,
  type WriteSiblingTempFileOptions,
  type WriteSiblingTempFileResult,
} from "@openclaw/fs-safe/advanced";
