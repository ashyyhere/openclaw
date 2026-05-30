// Plugin config normalization, activation policy, and memory-slot decisions.
import type { OpenClawConfig } from "../config/types.openclaw.js";
import {
  resolveMemorySlotDecisionShared,
  resolvePluginActivationDecisionShared,
  toPluginActivationState,
  type PluginActivationSource,
  type PluginActivationStateLike,
} from "./config-activation-shared.js";
import {
  hasExplicitPluginConfig as hasExplicitPluginConfigShared,
  identityNormalizePluginId,
  isBundledChannelEnabledByChannelConfig as isBundledChannelEnabledByChannelConfigShared,
  normalizePluginsConfigWithResolver as normalizePluginsConfigWithResolverShared,
  type NormalizePluginId,
  type NormalizedPluginsConfig as SharedNormalizedPluginsConfig,
} from "./config-normalization-shared.js";
import type { PluginKind } from "./plugin-kind.types.js";
import type { PluginOrigin } from "./plugin-origin.types.js";

/** Source config type used while explaining plugin activation decisions. */
export type { PluginActivationSource };
/** Public activation state returned by plugin policy evaluation. */
export type PluginActivationState = PluginActivationStateLike;

/** Normalized plugins config shape consumed by activation policy. */
export type NormalizedPluginsConfig = SharedNormalizedPluginsConfig;

/** Normalizes plugin config entries with an injectable id normalizer. */
export function normalizePluginsConfigWithResolver(
  config?: OpenClawConfig["plugins"],
  normalizePluginId: NormalizePluginId = identityNormalizePluginId,
): NormalizedPluginsConfig {
  return normalizePluginsConfigWithResolverShared(config, normalizePluginId);
}

/** Resolves configured/default/auto-enabled plugin activation state. */
export function resolvePluginActivationState(params: {
  id: string;
  origin: PluginOrigin;
  config: NormalizedPluginsConfig;
  rootConfig?: OpenClawConfig;
  enabledByDefault?: boolean;
  sourceConfig?: NormalizedPluginsConfig;
  sourceRootConfig?: OpenClawConfig;
  autoEnabledReason?: string;
}): PluginActivationState {
  return toPluginActivationState(
    resolvePluginActivationDecisionShared({
      ...params,
      activationSource: {
        plugins: params.sourceConfig ?? params.config,
        rootConfig: params.sourceRootConfig ?? params.rootConfig,
      },
      isBundledChannelEnabledByChannelConfig,
    }),
  );
}
/** Checks whether a plugin has an explicit config entry. */
export const hasExplicitPluginConfig = hasExplicitPluginConfigShared;

/** Checks whether bundled channel config enables its backing plugin. */
export const isBundledChannelEnabledByChannelConfig = isBundledChannelEnabledByChannelConfigShared;

type PolicyEffectiveActivationParams = {
  id: string;
  origin: PluginOrigin;
  config: NormalizedPluginsConfig;
  rootConfig?: OpenClawConfig;
  enabledByDefault?: boolean;
  sourceConfig?: NormalizedPluginsConfig;
  sourceRootConfig?: OpenClawConfig;
  autoEnabledReason?: string;
};

/** Resolves the effective plugin activation state for policy callers. */
export function resolveEffectivePluginActivationState(
  params: PolicyEffectiveActivationParams,
): PluginActivationState {
  return resolvePluginActivationState(params);
}

/** Resolves whether a plugin may occupy a memory capability slot. */
export function resolveMemorySlotDecision(params: {
  id: string;
  kind?: PluginKind | PluginKind[];
  slot: string | null | undefined;
  selectedId: string | null;
}): { enabled: boolean; reason?: string; selected?: boolean } {
  return resolveMemorySlotDecisionShared(params);
}
