// Public web-fetch registration helpers for provider plugins.

import type {
  WebFetchCredentialResolutionSource,
  WebFetchProviderPlugin,
  WebFetchProviderToolDefinition,
} from "../plugins/types.js";
/** Re-exported API for src/plugin-sdk, starting with json Result. */
export { jsonResult, readNumberParam, readStringParam } from "../agents/tools/common.js";
/** Re-exported API for src/plugin-sdk. */
export {
  withSelfHostedWebToolsEndpoint,
  withStrictWebToolsEndpoint,
  withTrustedWebToolsEndpoint,
} from "../agents/tools/web-guarded-fetch.js";
/** Re-exported API for src/plugin-sdk, starting with markdown To Text. */
export { markdownToText, truncateText } from "../agents/tools/web-fetch-utils.js";
/** Re-exported API for src/plugin-sdk. */
export {
  DEFAULT_CACHE_TTL_MINUTES,
  DEFAULT_TIMEOUT_SECONDS,
  normalizeCacheKey,
  readCache,
  readResponseText,
  resolveCacheTtlMs,
  resolvePositiveTimeoutSeconds,
  resolveTimeoutSeconds,
  writeCache,
} from "../agents/tools/web-shared.js";
/** Re-exported API for src/plugin-sdk, starting with enable Plugin In Config. */
export { enablePluginInConfig } from "../plugins/enable.js";
/** Re-exported API for src/plugin-sdk, starting with wrap External Content. */
export { wrapExternalContent, wrapWebContent } from "../security/external-content.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  WebFetchCredentialResolutionSource,
  WebFetchProviderPlugin,
  WebFetchProviderToolDefinition,
};
