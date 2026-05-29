// Public web-search registration helpers for provider plugins.

import type {
  WebSearchCredentialResolutionSource,
  WebSearchProviderSetupContext,
  WebSearchProviderPlugin,
  WebSearchProviderToolDefinition,
  WebSearchProviderToolExecutionContext,
} from "../plugins/types.js";
/** Re-exported API for src/plugin-sdk. */
export {
  jsonResult,
  readNonNegativeIntegerParam,
  readNumberParam,
  readPositiveIntegerParam,
  readStringArrayParam,
  readStringParam,
} from "../agents/tools/common.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Citation Redirect Url. */
export { resolveCitationRedirectUrl } from "../agents/tools/web-search-citation-redirect.js";
/** Re-exported API for src/plugin-sdk. */
export {
  buildSearchCacheKey,
  buildUnsupportedSearchFilterResponse,
  DEFAULT_SEARCH_COUNT,
  FRESHNESS_TO_RECENCY,
  isoToPerplexityDate,
  MAX_SEARCH_COUNT,
  normalizeFreshness,
  normalizeToIsoDate,
  parseIsoDateRange,
  parseWebSearchTimeFilters,
  readCachedSearchPayload,
  readConfiguredSecretString,
  readProviderEnvValue,
  resolveSearchCacheTtlMs,
  resolveSearchCount,
  resolveSearchTimeoutSeconds,
  resolveSiteName,
  postTrustedWebToolsJson,
  throwWebSearchApiError,
  withSelfHostedWebSearchEndpoint,
  withTrustedWebSearchEndpoint,
  writeCachedSearchPayload,
} from "../agents/tools/web-search-provider-common.js";
/** Re-exported API for src/plugin-sdk. */
export {
  getScopedCredentialValue,
  getTopLevelCredentialValue,
  mergeScopedSearchConfig,
  resolveProviderWebSearchPluginConfig,
  setScopedCredentialValue,
  setProviderWebSearchPluginConfigValue,
  setTopLevelCredentialValue,
} from "../agents/tools/web-search-provider-config.js";
/** Re-exported API for src/plugin-sdk, starting with Search Config Record. */
export type { SearchConfigRecord } from "../agents/tools/web-search-provider-common.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Web Search Provider Credential. */
export { resolveWebSearchProviderCredential } from "../agents/tools/web-search-provider-credentials.js";
/** Re-exported API for src/plugin-sdk. */
export {
  withSelfHostedWebToolsEndpoint,
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
/** Re-exported API for src/plugin-sdk, starting with format Cli Command. */
export { formatCliCommand } from "../cli/command-format.js";
/** Re-exported API for src/plugin-sdk, starting with wrap Web Content. */
export { wrapWebContent } from "../security/external-content.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  WebSearchCredentialResolutionSource,
  WebSearchProviderSetupContext,
  WebSearchProviderPlugin,
  WebSearchProviderToolDefinition,
  WebSearchProviderToolExecutionContext,
};

/**
 * @deprecated Implement provider-owned `createTool(...)` directly on the
 * returned WebSearchProviderPlugin instead of routing through core.
 */
export function createPluginBackedWebSearchProvider(
  provider: WebSearchProviderPlugin,
): WebSearchProviderPlugin {
  return {
    ...provider,
    createTool: () => {
      throw new Error(
        `createPluginBackedWebSearchProvider(${provider.id}) is no longer supported. ` +
          "Define provider-owned createTool(...) directly in the extension's WebSearchProviderPlugin.",
      );
    },
  };
}
