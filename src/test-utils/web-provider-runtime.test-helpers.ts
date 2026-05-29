// test-utils web provider runtime test helpers helpers and runtime behavior.
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type {
  PluginWebFetchProviderEntry,
  PluginWebSearchProviderEntry,
} from "../plugins/types.js";

type CommonWebProviderTestParams = {
  pluginId: string;
  id: string;
  credentialPath: string;
  autoDetectOrder?: number;
  requiresCredential?: boolean;
  authProviderId?: string;
  getCredentialValue?: (config?: Record<string, unknown>) => unknown;
  getConfiguredCredentialValue?: (config?: OpenClawConfig) => unknown;
  getConfiguredCredentialFallback?:
    | PluginWebSearchProviderEntry["getConfiguredCredentialFallback"]
    | PluginWebFetchProviderEntry["getConfiguredCredentialFallback"];
};

/** Shared type for Web Search Test Provider Params in src/test-utils. */
export type WebSearchTestProviderParams = CommonWebProviderTestParams & {
  createTool?: PluginWebSearchProviderEntry["createTool"];
  getConfiguredCredentialFallback?: PluginWebSearchProviderEntry["getConfiguredCredentialFallback"];
};

/** Shared type for Web Fetch Test Provider Params in src/test-utils. */
export type WebFetchTestProviderParams = CommonWebProviderTestParams & {
  createTool?: PluginWebFetchProviderEntry["createTool"];
  getConfiguredCredentialFallback?: PluginWebFetchProviderEntry["getConfiguredCredentialFallback"];
};

function createCommonProviderFields(params: CommonWebProviderTestParams) {
  return {
    pluginId: params.pluginId,
    id: params.id,
    label: params.id,
    hint: `${params.id} runtime provider`,
    envVars: [`${params.id.toUpperCase()}_API_KEY`],
    placeholder: `${params.id}-...`,
    signupUrl: `https://example.com/${params.id}`,
    credentialPath: params.credentialPath,
    autoDetectOrder: params.autoDetectOrder,
    requiresCredential: params.requiresCredential,
    authProviderId: params.authProviderId,
    getCredentialValue: params.getCredentialValue ?? (() => undefined),
    setCredentialValue: () => {},
    getConfiguredCredentialValue: params.getConfiguredCredentialValue,
    getConfiguredCredentialFallback: params.getConfiguredCredentialFallback,
  };
}

function createDefaultProviderTool(providerId: string) {
  return {
    description: providerId,
    parameters: {},
    execute: async (args: Record<string, unknown>) => ({ ...args, provider: providerId }),
  };
}

/** Reused helper for create Web Search Test Provider behavior in src/test-utils. */
export function createWebSearchTestProvider(
  params: WebSearchTestProviderParams,
): PluginWebSearchProviderEntry {
  return {
    ...createCommonProviderFields(params),
    createTool: params.createTool ?? (() => createDefaultProviderTool(params.id)),
  };
}

/** Reused helper for create Web Fetch Test Provider behavior in src/test-utils. */
export function createWebFetchTestProvider(
  params: WebFetchTestProviderParams,
): PluginWebFetchProviderEntry {
  return {
    ...createCommonProviderFields(params),
    createTool: params.createTool ?? (() => createDefaultProviderTool(params.id)),
  };
}
