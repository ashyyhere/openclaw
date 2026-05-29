// Focused low-level text/runtime helpers used by bundled plugins.

/** Re-exported API for src/plugin-sdk. */
export {
  CONFIG_DIR,
  clamp,
  clampInt,
  clampNumber,
  displayPath,
  displayString,
  ensureDir,
  escapeRegExp,
  normalizeE164,
  pathExists,
  resolveConfigDir,
  resolveHomeDir,
  resolveUserPath,
  safeParseJson,
  shortenHomeInString,
  shortenHomePath,
  sleep,
  sliceUtf16Safe,
  truncateUtf16Safe,
} from "../utils.js";
/** Re-exported API for src/plugin-sdk, starting with fetch With Timeout. */
export { fetchWithTimeout } from "../utils/fetch-timeout.js";
/** Re-exported API for src/plugin-sdk, starting with with Timeout. */
export { withTimeout } from "../utils/with-timeout.js";
