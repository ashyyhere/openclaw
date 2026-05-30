// Normalizes plugin config ids and resolves activation state, test defaults,
// bundled channel bypasses, and slot decisions.
import type { OpenClawConfig } from "../config/types.openclaw.js";
import {
  normalizeOptionalLowercaseString,
  normalizeOptionalString,
} from "../shared/string-coerce.js";
import {
  createEffectiveEnableStateResolver,
  createPluginEnableStateResolver,
  resolveMemorySlotDecisionShared,
  resolvePluginActivationDecisionShared,
  toPluginActivationState,
  type PluginActivationConfigSourceLike,
  type PluginActivationSource,
  type PluginActivationStateLike,
} from "./config-activation-shared.js";
import {
  hasExplicitPluginConfig as hasExplicitPluginConfigShared,
  isBundledChannelEnabledByChannelConfig as isBundledChannelEnabledByChannelConfigShared,
  normalizePluginsConfigWithResolver,
  type NormalizePluginId,
  type NormalizedPluginsConfig as SharedNormalizedPluginsConfig,
} from "./config-normalization-shared.js";
import type { PluginOrigin } from "./plugin-origin.types.js";
import { defaultSlotIdForKey } from "./slots.js";

/** Activation source labels returned by shared plugin activation policy. */
export type { PluginActivationSource };
/** Resolved plugin activation state with enabled flag and reason metadata. */
export type PluginActivationState = PluginActivationStateLike;

/** Config inputs used when resolving one plugin's activation state. */
export type PluginActivationConfigSource = {
  plugins: NormalizedPluginsConfig;
  rootConfig?: OpenClawConfig;
} & PluginActivationConfigSourceLike<OpenClawConfig>;

/** Plugin config normalized with canonical ids and alias fallback handling. */
export type NormalizedPluginsConfig = SharedNormalizedPluginsConfig;

const BUILT_IN_PLUGIN_ALIAS_FALLBACKS: ReadonlyArray<readonly [alias: string, pluginId: string]> = [
  ["openai-codex", "openai"],
  ["google-gemini-cli", "google"],
  ["minimax-portal", "minimax"],
  ["minimax-portal-auth", "minimax"],
] as const;
const BUILT_IN_PLUGIN_ALIAS_LOOKUP = new Map<string, string>([
  ...BUILT_IN_PLUGIN_ALIAS_FALLBACKS,
  ...BUILT_IN_PLUGIN_ALIAS_FALLBACKS.map(([, pluginId]) => [pluginId, pluginId] as const),
]);

function getBundledPluginAliasLookup(): ReadonlyMap<string, string> {
  const lookup = new Map<string, string>();
  for (const [alias, pluginId] of BUILT_IN_PLUGIN_ALIAS_FALLBACKS) {
    lookup.set(alias, pluginId);
  }
  return lookup;
}

function normalizePluginIdWithLookup(
  id: string,
  getAliasLookup: () => ReadonlyMap<string, string>,
): string {
  const trimmed = normalizeOptionalString(id) ?? "";
  const normalized = normalizeOptionalLowercaseString(trimmed) ?? "";
  const builtInAlias = BUILT_IN_PLUGIN_ALIAS_LOOKUP.get(normalized);
  if (builtInAlias) {
    return builtInAlias;
  }
  return getAliasLookup().get(normalized) ?? trimmed;
}

function createScopedPluginIdNormalizer(): NormalizePluginId {
  let lookup: ReadonlyMap<string, string> | undefined;
  return (id) =>
    normalizePluginIdWithLookup(id, () => {
      lookup ??= getBundledPluginAliasLookup();
      return lookup;
    });
}

/** Canonicalizes plugin ids, including built-in legacy aliases. */
export function normalizePluginId(id: string): string {
  return normalizePluginIdWithLookup(id, getBundledPluginAliasLookup);
}

/** Normalizes the plugin config block with scoped alias resolution. */
export const normalizePluginsConfig = (
  config?: OpenClawConfig["plugins"],
): NormalizedPluginsConfig => {
  return normalizePluginsConfigWithResolver(config, createScopedPluginIdNormalizer());
};

/** Builds the activation source object consumed by shared activation policy. */
export function createPluginActivationSource(params: {
  config?: OpenClawConfig;
  plugins?: NormalizedPluginsConfig;
}): PluginActivationConfigSource {
  return {
    plugins: params.plugins ?? normalizePluginsConfig(params.config?.plugins),
    rootConfig: params.config,
  };
}

const hasExplicitMemorySlot = (plugins?: OpenClawConfig["plugins"]) =>
  Boolean(plugins?.slots && Object.prototype.hasOwnProperty.call(plugins.slots, "memory"));

const hasExplicitMemoryEntry = (plugins?: OpenClawConfig["plugins"]) =>
  Boolean(
    plugins?.entries &&
    Object.prototype.hasOwnProperty.call(plugins.entries, defaultSlotIdForKey("memory")),
  );

/** Returns whether plugin config was authored explicitly. */
export const hasExplicitPluginConfig = (plugins?: OpenClawConfig["plugins"]) =>
  hasExplicitPluginConfigShared(plugins);

/** Applies Vitest defaults that disable plugin activation unless tests opt in. */
export function applyTestPluginDefaults(
  cfg: OpenClawConfig,
  env: NodeJS.ProcessEnv = process.env,
): OpenClawConfig {
  if (!env.VITEST) {
    return cfg;
  }
  const plugins = cfg.plugins;
  const explicitConfig = hasExplicitPluginConfig(plugins);
  if (explicitConfig) {
    if (hasExplicitMemorySlot(plugins) || hasExplicitMemoryEntry(plugins)) {
      return cfg;
    }
    return {
      ...cfg,
      plugins: {
        ...plugins,
        slots: {
          ...plugins?.slots,
          memory: "none",
        },
      },
    };
  }

  return {
    ...cfg,
    plugins: {
      ...plugins,
      enabled: false,
      slots: {
        ...plugins?.slots,
        memory: "none",
      },
    },
  };
}

/** Returns whether Vitest defaults should disable the memory slot for this config. */
export function isTestDefaultMemorySlotDisabled(
  cfg: OpenClawConfig,
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  if (!env.VITEST) {
    return false;
  }
  const plugins = cfg.plugins;
  if (hasExplicitMemorySlot(plugins) || hasExplicitMemoryEntry(plugins)) {
    return false;
  }
  return true;
}

/** Resolves one plugin's activation state from normalized config and defaults. */
export function resolvePluginActivationState(params: {
  id: string;
  origin: PluginOrigin;
  config: NormalizedPluginsConfig;
  rootConfig?: OpenClawConfig;
  enabledByDefault?: boolean;
  activationSource?: PluginActivationConfigSource;
  autoEnabledReason?: string;
}): PluginActivationState {
  return toPluginActivationState(
    resolvePluginActivationDecisionShared({
      ...params,
      activationSource:
        params.activationSource ??
        createPluginActivationSource({
          config: params.rootConfig,
          plugins: params.config,
        }),
      allowBundledChannelExplicitBypassesAllowlist: true,
      isBundledChannelEnabledByChannelConfig,
    }),
  );
}

/** Convenience resolver that returns enabled/disabled state for one plugin. */
export const resolveEnableState = createPluginEnableStateResolver<
  NormalizedPluginsConfig,
  PluginOrigin
>(resolvePluginActivationState);

/** Checks whether bundled channel config explicitly enables its owning plugin. */
export const isBundledChannelEnabledByChannelConfig = isBundledChannelEnabledByChannelConfigShared;

type EffectiveActivationParams = {
  id: string;
  origin: PluginOrigin;
  config: NormalizedPluginsConfig;
  rootConfig?: OpenClawConfig;
  enabledByDefault?: boolean;
  activationSource?: PluginActivationConfigSource;
};

/** Resolves effective enablement after default and explicit activation policy are applied. */
export const resolveEffectiveEnableState =
  createEffectiveEnableStateResolver<EffectiveActivationParams>(
    resolveEffectivePluginActivationState,
  );

/** Resolves effective plugin activation state for callers using the local config shape. */
export function resolveEffectivePluginActivationState(params: {
  id: EffectiveActivationParams["id"];
  origin: EffectiveActivationParams["origin"];
  config: EffectiveActivationParams["config"];
  rootConfig?: EffectiveActivationParams["rootConfig"];
  enabledByDefault?: EffectiveActivationParams["enabledByDefault"];
  activationSource?: EffectiveActivationParams["activationSource"];
  autoEnabledReason?: string;
}): PluginActivationState {
  return resolvePluginActivationState(params);
}

/** Resolves whether a memory-slot plugin is selected, enabled, or skipped. */
export function resolveMemorySlotDecision(params: {
  id: string;
  kind?: string | string[];
  slot: string | null | undefined;
  selectedId: string | null;
}): { enabled: boolean; reason?: string; selected?: boolean } {
  return resolveMemorySlotDecisionShared(params);
}
