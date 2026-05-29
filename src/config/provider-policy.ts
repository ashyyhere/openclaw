// config provider policy helpers and runtime behavior.
import type { PluginManifestRegistry } from "../plugins/manifest-registry.js";
import { resolveBundledProviderPolicySurface } from "../plugins/provider-public-artifacts.js";
import type { ModelProviderConfig, OpenClawConfig } from "./types.js";

/** Reused helper for normalize Provider Config For Config Defaults behavior in src/config. */
export function normalizeProviderConfigForConfigDefaults(params: {
  provider: string;
  providerConfig: ModelProviderConfig;
  manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
}): ModelProviderConfig {
  const normalized = resolveBundledProviderPolicySurface(params.provider, {
    manifestRegistry: params.manifestRegistry,
  })?.normalizeConfig?.({
    provider: params.provider,
    providerConfig: params.providerConfig,
  });
  return normalized && normalized !== params.providerConfig ? normalized : params.providerConfig;
}

/** Reused helper for apply Provider Config Defaults For Config behavior in src/config. */
export function applyProviderConfigDefaultsForConfig(params: {
  provider: string;
  config: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
}): OpenClawConfig {
  return (
    resolveBundledProviderPolicySurface(params.provider, {
      manifestRegistry: params.manifestRegistry,
    })?.applyConfigDefaults?.({
      provider: params.provider,
      config: params.config,
      env: params.env,
    }) ?? params.config
  );
}
