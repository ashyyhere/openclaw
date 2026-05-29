// Public channel plugin registry facade.
/** Re-exported API for src/channels/plugins. */
export {
  getChannelPlugin,
  getLoadedChannelPlugin,
  getLoadedChannelPluginOrigin,
  listChannelPlugins,
  normalizeChannelId,
} from "./registry.js";
/** Re-exported API for src/channels/plugins. */
export {
  applyChannelMatchMeta,
  buildChannelKeyCandidates,
  normalizeChannelSlug,
  resolveChannelEntryMatch,
  resolveChannelEntryMatchWithFallback,
  resolveChannelMatchConfig,
  resolveNestedAllowlistDecision,
  type ChannelEntryMatch,
  type ChannelMatchSource,
} from "./channel-config.js";
/** Re-exported API for src/channels/plugins. */
export {
  formatAllowlistMatchMeta,
  type AllowlistMatch,
  type AllowlistMatchSource,
} from "./allowlist-match.js";
/** Re-exported API for src/channels/plugins, starting with Channel Id. */
export type { ChannelId } from "./types.public.js";
/** Re-exported API for src/channels/plugins, starting with Channel Plugin. */
export type { ChannelPlugin } from "./types.plugin.js";
/** Re-exported API for src/channels/plugins, starting with resolve Channel Approval Adapter. */
export { resolveChannelApprovalAdapter, resolveChannelApprovalCapability } from "./approvals.js";
