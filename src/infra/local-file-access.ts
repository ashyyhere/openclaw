/** Re-exports fs-safe helpers for validating local file and media source paths. */
import "./fs-safe-defaults.js";
/** Public file URL and Windows network-path guards from fs-safe. */
export {
  assertNoWindowsNetworkPath,
  basenameFromMediaSource,
  hasEncodedFileUrlSeparator,
  isWindowsNetworkPath,
  safeFileURLToPath,
  trySafeFileURLToPath,
} from "@openclaw/fs-safe/advanced";
