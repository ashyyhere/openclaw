/** Public wrappers around provider-specific config policy hooks. */
import {
  applyProviderNativeStreamingUsagePolicy,
  normalizeProviderConfigPolicy,
  resolveProviderConfigApiKeyPolicy,
} from "./models-config.providers.policy.runtime.js";
import type { ProviderConfig } from "./models-config.providers.secrets.js";

/** Apply native-streaming compatibility defaults to all providers. */
export function applyNativeStreamingUsageCompat(
  providers: Record<string, ProviderConfig>,
): Record<string, ProviderConfig> {
  let changed = false;
  const nextProviders: Record<string, ProviderConfig> = {};

  for (const [providerKey, provider] of Object.entries(providers)) {
    const nextProvider = applyProviderNativeStreamingUsagePolicy(providerKey, provider);
    nextProviders[providerKey] = nextProvider;
    changed ||= nextProvider !== provider;
  }

  return changed ? nextProviders : providers;
}

/** Normalize one provider config through its owner policy hook. */
export function normalizeProviderSpecificConfig(
  providerKey: string,
  provider: ProviderConfig,
): ProviderConfig {
  const normalized = normalizeProviderConfigPolicy(providerKey, provider);
  if (normalized && normalized !== provider) {
    return normalized;
  }
  return provider;
}

/** Resolve an optional provider-specific API-key resolver. */
export function resolveProviderConfigApiKeyResolver(
  providerKey: string,
  provider?: ProviderConfig,
): ((env: NodeJS.ProcessEnv) => string | undefined) | undefined {
  return resolveProviderConfigApiKeyPolicy(providerKey, provider);
}
