// Runtime boundary for secrets runtime web tools fallback runtime behavior.
import { resolvePluginWebFetchProviders } from "../plugins/web-fetch-providers.runtime.js";
import { resolvePluginWebSearchProviders } from "../plugins/web-search-providers.runtime.js";

/** Reused constant for runtime Web Tools Fallback Providers behavior in src/secrets. */
export const runtimeWebToolsFallbackProviders = {
  resolvePluginWebFetchProviders,
  resolvePluginWebSearchProviders,
};
