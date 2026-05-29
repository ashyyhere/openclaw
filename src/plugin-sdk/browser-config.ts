/** Public SDK barrel for browser config resolution, auth, CDP URL helpers, and cleanup utilities. */
export {
  DEFAULT_AI_SNAPSHOT_MAX_CHARS,
  DEFAULT_BROWSER_ACTION_TIMEOUT_MS,
  DEFAULT_BROWSER_DEFAULT_PROFILE_NAME,
  DEFAULT_BROWSER_EVALUATE_ENABLED,
  DEFAULT_OPENCLAW_BROWSER_COLOR,
  DEFAULT_OPENCLAW_BROWSER_ENABLED,
  DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME,
  DEFAULT_UPLOAD_DIR,
  resolveBrowserConfig,
  resolveProfile,
  type ResolvedBrowserConfig,
  type ResolvedBrowserProfile,
  type ResolvedBrowserTabCleanupConfig,
} from "./browser-profiles.js";
/** Re-exported API for src/plugin-sdk, starting with parse Browser Http Url. */
export { parseBrowserHttpUrl, redactCdpUrl } from "./browser-cdp.js";
/** Re-exported API for src/plugin-sdk, starting with ensure Browser Control Auth. */
export { ensureBrowserControlAuth, resolveBrowserControlAuth } from "./browser-control-auth.js";
/** Re-exported API for src/plugin-sdk, starting with move Path To Trash. */
export { movePathToTrash, type MovePathToTrashOptions } from "./browser-trash.js";
/** Re-exported API for src/plugin-sdk, starting with Browser Control Auth. */
export type { BrowserControlAuth } from "./browser-control-auth.js";
