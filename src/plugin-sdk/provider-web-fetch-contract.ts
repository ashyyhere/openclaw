// Narrow shared exports for web-fetch contract surfaces.

import type { WebFetchProviderPlugin } from "../plugins/types.js";

/** Re-exported API for src/plugin-sdk, starting with enable Plugin In Config. */
export { enablePluginInConfig } from "./provider-enable-config.js";
/** Re-exported API for src/plugin-sdk, starting with Web Fetch Provider Plugin. */
export type { WebFetchProviderPlugin };
