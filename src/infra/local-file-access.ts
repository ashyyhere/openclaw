// infra local file access helpers and runtime behavior.
import "./fs-safe-defaults.js";
/** Re-exported API for src/infra. */
export {
  assertNoWindowsNetworkPath,
  basenameFromMediaSource,
  hasEncodedFileUrlSeparator,
  isWindowsNetworkPath,
  safeFileURLToPath,
  trySafeFileURLToPath,
} from "@openclaw/fs-safe/advanced";
