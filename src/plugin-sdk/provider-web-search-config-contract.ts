// Public contract-safe web-search config helpers for provider plugins that do
// not need plugin enable/selection wiring.

import type {
  WebSearchCredentialResolutionSource,
  WebSearchProviderSetupContext,
  WebSearchProviderPlugin,
  WebSearchProviderToolDefinition,
} from "../plugins/types.js";
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
/** Re-exported API for src/plugin-sdk, starting with create Base Web Search Provider Contract Fields. */
export { createBaseWebSearchProviderContractFields as createWebSearchProviderContractFields } from "./provider-web-search-contract-fields.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  WebSearchCredentialResolutionSource,
  WebSearchProviderSetupContext,
  WebSearchProviderPlugin,
  WebSearchProviderToolDefinition,
};
