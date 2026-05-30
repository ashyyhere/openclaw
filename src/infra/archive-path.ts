// Wires fs-safe archive path helpers through the infra defaults bootstrap.
import "./fs-safe-defaults.js";
/** Re-export archive entry validation and output path helpers with OpenClaw defaults loaded. */
export {
  isWindowsDrivePath,
  normalizeArchiveEntryPath,
  resolveArchiveOutputPath,
  stripArchivePath,
  validateArchiveEntryPath,
} from "@openclaw/fs-safe/archive";
