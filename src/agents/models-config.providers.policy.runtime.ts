/** Calls provider-runtime policy hooks without loading runtime plugins on hot paths. */
import {
  applyProviderNativeStreamingUsageCompatWithPlugin,
  normalizeProviderConfigWithPlugin,
  resolveProviderConfigApiKeyWithPlugin,
} from "../plugins/provider-runtime.js";
import { resolveProviderPluginLookupKey } from "./models-config.providers.policy.lookup.js";
import type { ProviderConfig } from "./models-config.providers.secrets.js";

/** Apply provider-owned native-streaming usage compatibility policy. */
export function applyProviderNativeStreamingUsagePolicy(
  providerKey: string,
  provider: ProviderConfig,
): ProviderConfig {
  const runtimeProviderKey = resolveProviderPluginLookupKey(providerKey, provider);
  return (
    applyProviderNativeStreamingUsageCompatWithPlugin({
      provider: runtimeProviderKey,
      allowRuntimePluginLoad: false,
      context: {
        provider: providerKey,
        providerConfig: provider,
      },
    }) ?? provider
  );
}

/** Apply provider-owned config normalization policy. */
export function normalizeProviderConfigPolicy(
  providerKey: string,
  provider: ProviderConfig,
): ProviderConfig {
  const runtimeProviderKey = resolveProviderPluginLookupKey(providerKey, provider);
  return (
    normalizeProviderConfigWithPlugin({
      provider: runtimeProviderKey,
      allowRuntimePluginLoad: false,
      context: {
        provider: providerKey,
        providerConfig: provider,
      },
    }) ?? provider
  );
}

/** Resolve provider-owned API-key env fallback policy. */
export function resolveProviderConfigApiKeyPolicy(
  providerKey: string,
  provider?: ProviderConfig,
): ((env: NodeJS.ProcessEnv) => string | undefined) | undefined {
  const runtimeProviderKey = resolveProviderPluginLookupKey(providerKey, provider).trim();
  return (env) =>
    resolveProviderConfigApiKeyWithPlugin({
      provider: runtimeProviderKey,
      allowRuntimePluginLoad: false,
      context: {
        provider: providerKey,
        env,
      },
    });
}
