// Channel plugin facade for channel config match helpers.
/** Re-exported API for src/channels/plugins, starting with Channel Entry Match. */
export type { ChannelEntryMatch, ChannelMatchSource } from "../channel-config.js";
/** Re-exported API for src/channels/plugins. */
export {
  applyChannelMatchMeta,
  buildChannelKeyCandidates,
  normalizeChannelSlug,
  resolveChannelEntryMatch,
  resolveChannelEntryMatchWithFallback,
  resolveChannelMatchConfig,
  resolveNestedAllowlistDecision,
} from "../channel-config.js";
