// plugins channel plugin ids helpers and runtime behavior.
/** Re-exported API for src/plugins. */
export {
  hasConfiguredChannelsForReadOnlyScope,
  hasExplicitChannelConfig,
  listConfiguredAnnounceChannelIdsForConfig,
  listConfiguredChannelIdsForReadOnlyScope,
  listExplicitConfiguredChannelIdsForConfig,
  resolveConfiguredChannelPluginIds,
  resolveConfiguredChannelPresencePolicy,
  resolveDiscoverableScopedChannelPluginIds,
  type ConfiguredChannelBlockedReason,
  type ConfiguredChannelPresencePolicyEntry,
  type ConfiguredChannelPresenceSource,
} from "./channel-presence-policy.js";

/** Re-exported API for src/plugins. */
export {
  resolveChannelPluginIds,
  resolveChannelPluginIdsFromRegistry,
  resolveConfiguredDeferredChannelPluginIds,
  resolveConfiguredDeferredChannelPluginIdsFromRegistry,
  loadGatewayStartupPluginPlan,
  resolveGatewayStartupPluginIds,
  resolveGatewayStartupPluginPlanFromRegistry,
  resolveGatewayStartupPluginIdsFromRegistry,
  type GatewayStartupPluginPlan,
} from "./gateway-startup-plugin-ids.js";
