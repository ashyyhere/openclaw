// Re-exports fs-safe regular-file helpers with infra defaults loaded.
import "./fs-safe-defaults.js";
/** Regular-file read, append, and stat helpers that reject unsafe file types. */
export {
  appendRegularFile,
  appendRegularFileSync,
  readRegularFile,
  readRegularFileSync,
  resolveRegularFileAppendFlags,
  statRegularFile,
  statRegularFileSync,
  type AppendRegularFileOptions,
  type RegularFileStatResult,
} from "@openclaw/fs-safe/advanced";
