// plugins config policy helpers and runtime behavior.
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

/** Re-exported API for src/plugins, starting with Plugin Activation Source. */
export type { PluginActivationSource };
/** Shared type for Plugin Activation State in src/plugins. */
export type PluginActivationState = PluginActivationStateLike;

/** Shared type for Normalized Plugins Config in src/plugins. */
export type NormalizedPluginsConfig = SharedNormalizedPluginsConfig;

/** Reused helper for normalize Plugins Config With Resolver behavior in src/plugins. */
export function normalizePluginsConfigWithResolver(
  config?: OpenClawConfig["plugins"],
  normalizePluginId: NormalizePluginId = identityNormalizePluginId,
): NormalizedPluginsConfig {
  return normalizePluginsConfigWithResolverShared(config, normalizePluginId);
}

/** Reused helper for resolve Plugin Activation State behavior in src/plugins. */
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
/** Reused constant for has Explicit Plugin Config behavior in src/plugins. */
export const hasExplicitPluginConfig = hasExplicitPluginConfigShared;

/** Reused constant for is Bundled Channel Enabled By Channel Config behavior in src/plugins. */
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

/** Reused helper for resolve Effective Plugin Activation State behavior in src/plugins. */
export function resolveEffectivePluginActivationState(
  params: PolicyEffectiveActivationParams,
): PluginActivationState {
  return resolvePluginActivationState(params);
}

/** Reused helper for resolve Memory Slot Decision behavior in src/plugins. */
export function resolveMemorySlotDecision(params: {
  id: string;
  kind?: PluginKind | PluginKind[];
  slot: string | null | undefined;
  selectedId: string | null;
}): { enabled: boolean; reason?: string; selected?: boolean } {
  return resolveMemorySlotDecisionShared(params);
}
