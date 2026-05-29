// Narrow Matrix monitor helper seam.
// Keep monitor internals off the broad package runtime-api barrel so monitor
// tests and shared workers do not pull unrelated Matrix helper surfaces.

/** Re-exported matrix plugin public API, starting with Normalized Location. */
export type { NormalizedLocation } from "openclaw/plugin-sdk/channel-inbound";
/** Re-exported matrix plugin public API, starting with Plugin Runtime. */
export type { PluginRuntime, RuntimeLogger } from "openclaw/plugin-sdk/plugin-runtime";
/** Re-exported matrix plugin public API, starting with Block Reply Context. */
export type { BlockReplyContext, ReplyPayload } from "openclaw/plugin-sdk/reply-runtime";
/** Re-exported matrix plugin public API, starting with Markdown Table Mode. */
export type { MarkdownTableMode, OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
/** Re-exported matrix plugin public API, starting with Runtime Env. */
export type { RuntimeEnv } from "openclaw/plugin-sdk/runtime";
/** Re-exported matrix plugin public API. */
export {
  addAllowlistUserEntriesFromConfigEntry,
  buildAllowlistResolutionSummary,
  canonicalizeAllowlistWithResolvedIds,
  formatAllowlistMatchMeta,
  patchAllowlistUsersInConfigEntries,
  summarizeMapping,
} from "openclaw/plugin-sdk/allow-from";
/** Re-exported matrix plugin public API. */
export {
  createReplyPrefixOptions,
  createTypingCallbacks,
} from "openclaw/plugin-sdk/channel-outbound";
/** Re-exported matrix plugin public API, starting with format Location Text. */
export { formatLocationText, toLocationContext } from "openclaw/plugin-sdk/channel-inbound";
/** Re-exported matrix plugin public API, starting with get Agent Scoped Media Local Roots. */
export { getAgentScopedMediaLocalRoots } from "openclaw/plugin-sdk/agent-media-payload";
/** Re-exported matrix plugin public API, starting with log Inbound Drop. */
export { logInboundDrop } from "openclaw/plugin-sdk/channel-inbound";
/** Re-exported matrix plugin public API, starting with log Typing Failure. */
export { logTypingFailure } from "openclaw/plugin-sdk/channel-outbound";
/** Re-exported matrix plugin public API. */
export {
  buildChannelKeyCandidates,
  resolveChannelEntryMatch,
} from "openclaw/plugin-sdk/channel-targets";
