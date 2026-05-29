/** Reads and writes scoped provider config for web_search plugins. */
import { resolvePluginWebSearchConfig } from "../../config/plugin-web-search-config.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { isLegacyWebSearchProviderConfigKey } from "../../config/web-search-legacy-provider-keys.js";

/** Reads top-level credential value from legacy search config. */
export function getTopLevelCredentialValue(searchConfig?: Record<string, unknown>): unknown {
  return searchConfig?.apiKey;
}

/** Reused helper for set Top Level Credential Value behavior in src/agents/tools. */
export function setTopLevelCredentialValue(
  searchConfigTarget: Record<string, unknown>,
  value: unknown,
): void {
  searchConfigTarget.apiKey = value;
}

/** Reused helper for get Scoped Credential Value behavior in src/agents/tools. */
export function getScopedCredentialValue(
  searchConfig: Record<string, unknown> | undefined,
  key: string,
): unknown {
  const scoped = searchConfig?.[key];
  if (!scoped || typeof scoped !== "object" || Array.isArray(scoped)) {
    return undefined;
  }
  return (scoped as Record<string, unknown>).apiKey;
}

/** Reused helper for set Scoped Credential Value behavior in src/agents/tools. */
export function setScopedCredentialValue(
  searchConfigTarget: Record<string, unknown>,
  key: string,
  value: unknown,
): void {
  const scoped = searchConfigTarget[key];
  if (!scoped || typeof scoped !== "object" || Array.isArray(scoped)) {
    searchConfigTarget[key] = { apiKey: value };
    return;
  }
  (scoped as Record<string, unknown>).apiKey = value;
}

/** Merges top-level and provider-scoped web search config. */
export function mergeScopedSearchConfig(
  searchConfig: Record<string, unknown> | undefined,
  key: string,
  pluginConfig: Record<string, unknown> | undefined,
  options?: { mirrorApiKeyToTopLevel?: boolean },
): Record<string, unknown> | undefined {
  if (!pluginConfig) {
    return searchConfig;
  }

  const currentScoped =
    searchConfig?.[key] &&
    typeof searchConfig[key] === "object" &&
    !Array.isArray(searchConfig[key])
      ? (searchConfig[key] as Record<string, unknown>)
      : {};
  const next: Record<string, unknown> = { ...searchConfig };
  const existingDescriptor = searchConfig
    ? Object.getOwnPropertyDescriptor(searchConfig, key)
    : undefined;
  const shouldHideRuntimeInjectedLegacyShape =
    isLegacyWebSearchProviderConfigKey(key) && existingDescriptor === undefined;

  Object.defineProperty(next, key, {
    value: {
      ...currentScoped,
      ...pluginConfig,
    },
    enumerable: !shouldHideRuntimeInjectedLegacyShape,
    configurable: true,
    writable: true,
  });

  if (options?.mirrorApiKeyToTopLevel && pluginConfig.apiKey !== undefined) {
    next.apiKey = pluginConfig.apiKey;
  }

  return next;
}

/** Resolves plugin-owned web search config for a provider id. */
export function resolveProviderWebSearchPluginConfig(
  config: OpenClawConfig | undefined,
  pluginId: string,
): Record<string, unknown> | undefined {
  return resolvePluginWebSearchConfig(config, pluginId);
}

function ensureObject(target: Record<string, unknown>, key: string): Record<string, unknown> {
  const current = target[key];
  if (current && typeof current === "object" && !Array.isArray(current)) {
    return current as Record<string, unknown>;
  }
  const next: Record<string, unknown> = {};
  target[key] = next;
  return next;
}

/** Reused helper for set Provider Web Search Plugin Config Value behavior in src/agents/tools. */
export function setProviderWebSearchPluginConfigValue(
  configTarget: OpenClawConfig,
  pluginId: string,
  key: string,
  value: unknown,
): void {
  const plugins = ensureObject(configTarget as Record<string, unknown>, "plugins");
  const entries = ensureObject(plugins, "entries");
  const entry = ensureObject(entries, pluginId);
  if (entry.enabled === undefined) {
    entry.enabled = true;
  }
  const config = ensureObject(entry, "config");
  const webSearch = ensureObject(config, "webSearch");
  webSearch[key] = value;
}
