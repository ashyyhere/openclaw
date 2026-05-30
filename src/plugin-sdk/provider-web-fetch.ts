// Public web-fetch registration helpers for provider plugins.

import type {
  WebFetchCredentialResolutionSource,
  WebFetchProviderPlugin,
  WebFetchProviderToolDefinition,
} from "../plugins/types.js";
/** Tool result and parameter readers for web-fetch provider tools. */
export { jsonResult, readNumberParam, readStringParam } from "../agents/tools/common.js";
/** Endpoint guard helpers for trusted/self-hosted web-fetch providers. */
export {
  withSelfHostedWebToolsEndpoint,
  withStrictWebToolsEndpoint,
  withTrustedWebToolsEndpoint,
} from "../agents/tools/web-guarded-fetch.js";
/** Text extraction helpers for provider web-fetch responses. */
export { markdownToText, truncateText } from "../agents/tools/web-fetch-utils.js";
/** Shared cache and timeout helpers for provider-backed web fetch. */
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
/** Config mutator used by setup flows to enable a web-fetch provider plugin. */
export { enablePluginInConfig } from "../plugins/enable.js";
/** Security wrappers for model-visible external web content. */
export { wrapExternalContent, wrapWebContent } from "../security/external-content.js";
/** Public provider plugin contracts for web-fetch implementations. */
export type {
  WebFetchCredentialResolutionSource,
  WebFetchProviderPlugin,
  WebFetchProviderToolDefinition,
};
