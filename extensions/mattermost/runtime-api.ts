// Private runtime barrel for the bundled Mattermost extension.
// Keep this barrel thin and generic-only.

/** Re-exported mattermost plugin public API. */
export type {
  BaseProbeResult,
  ChannelAccountSnapshot,
  ChannelDirectoryEntry,
  ChannelGroupContext,
  ChannelMessageActionName,
  ChannelPlugin,
  ChatType,
  HistoryEntry,
  OpenClawConfig,
  OpenClawPluginApi,
  PluginRuntime,
} from "openclaw/plugin-sdk/core";
/** Re-exported mattermost plugin public API, starting with Runtime Env. */
export type { RuntimeEnv } from "openclaw/plugin-sdk/runtime";
/** Re-exported mattermost plugin public API, starting with Reply Payload. */
export type { ReplyPayload } from "openclaw/plugin-sdk/reply-runtime";
/** Re-exported mattermost plugin public API, starting with Models Provider Data. */
export type { ModelsProviderData } from "openclaw/plugin-sdk/models-provider-runtime";
/** Re-exported mattermost plugin public API. */
export type {
  BlockStreamingCoalesceConfig,
  DmPolicy,
  GroupPolicy,
} from "openclaw/plugin-sdk/config-contracts";
/** Re-exported mattermost plugin public API. */
export {
  DEFAULT_ACCOUNT_ID,
  buildChannelConfigSchema,
  createDedupeCache,
  parseStrictPositiveInteger,
  resolveClientIp,
  isTrustedProxyAddress,
} from "openclaw/plugin-sdk/core";
/** Re-exported mattermost plugin public API, starting with build Computed Account Status Snapshot. */
export { buildComputedAccountStatusSnapshot } from "openclaw/plugin-sdk/channel-status";
/** Re-exported mattermost plugin public API, starting with create Account Status Sink. */
export { createAccountStatusSink } from "openclaw/plugin-sdk/channel-outbound";
/** Re-exported mattermost plugin public API, starting with build Agent Media Payload. */
export { buildAgentMediaPayload } from "openclaw/plugin-sdk/agent-media-payload";
/** Re-exported mattermost plugin public API. */
export {
  listSkillCommandsForAgents,
  resolveControlCommandGate,
  resolveStoredModelOverride,
} from "openclaw/plugin-sdk/command-auth-native";
/** Re-exported mattermost plugin public API, starting with build Models Provider Data. */
export { buildModelsProviderData } from "openclaw/plugin-sdk/models-provider-runtime";
/** Re-exported mattermost plugin public API. */
export {
  GROUP_POLICY_BLOCKED_LABEL,
  resolveAllowlistProviderRuntimeGroupPolicy,
  resolveDefaultGroupPolicy,
  warnMissingProviderGroupPolicyFallbackOnce,
} from "openclaw/plugin-sdk/runtime-group-policy";
/** Re-exported mattermost plugin public API, starting with is Dangerous Name Matching Enabled. */
export { isDangerousNameMatchingEnabled } from "openclaw/plugin-sdk/dangerous-name-runtime";
/** Re-exported mattermost plugin public API, starting with load Session Store. */
export { loadSessionStore, resolveStorePath } from "openclaw/plugin-sdk/session-store-runtime";
/** Re-exported mattermost plugin public API, starting with format Inbound From Label. */
export { formatInboundFromLabel } from "openclaw/plugin-sdk/channel-inbound";
/** Re-exported mattermost plugin public API, starting with log Inbound Drop. */
export { logInboundDrop } from "openclaw/plugin-sdk/channel-inbound";
/** Re-exported mattermost plugin public API, starting with create Channel Pairing Controller. */
export { createChannelPairingController } from "openclaw/plugin-sdk/channel-pairing";
/** Re-exported mattermost plugin public API, starting with create Channel Message Reply Pipeline. */
export { createChannelMessageReplyPipeline } from "openclaw/plugin-sdk/channel-outbound";
/** Re-exported mattermost plugin public API, starting with log Typing Failure. */
export { logTypingFailure } from "openclaw/plugin-sdk/channel-feedback";
/** Re-exported mattermost plugin public API, starting with load Outbound Media From Url. */
export { loadOutboundMediaFromUrl } from "openclaw/plugin-sdk/outbound-media";
/** Re-exported mattermost plugin public API, starting with raw Data To String. */
export { rawDataToString } from "openclaw/plugin-sdk/webhook-ingress";
/** Re-exported mattermost plugin public API, starting with chunk Text For Outbound. */
export { chunkTextForOutbound } from "openclaw/plugin-sdk/text-chunking";
// Legacy map-helper exports stay for older plugin consumers. New message-turn
// code should use createChannelHistoryWindow.
/** Re-exported mattermost plugin public API. */
export {
  DEFAULT_GROUP_HISTORY_LIMIT,
  createChannelHistoryWindow,
  buildPendingHistoryContextFromMap,
  clearHistoryEntriesIfEnabled,
  recordPendingHistoryEntryIfEnabled,
} from "openclaw/plugin-sdk/reply-history";
/** Re-exported mattermost plugin public API, starting with normalize Account Id. */
export { normalizeAccountId, resolveThreadSessionKeys } from "openclaw/plugin-sdk/routing";
/** Re-exported mattermost plugin public API, starting with resolve Allowlist Match Simple. */
export { resolveAllowlistMatchSimple } from "openclaw/plugin-sdk/allow-from";
/** Re-exported mattermost plugin public API, starting with register Plugin Http Route. */
export { registerPluginHttpRoute } from "openclaw/plugin-sdk/webhook-targets";
/** Re-exported mattermost plugin public API. */
export {
  isRequestBodyLimitError,
  readRequestBodyWithLimit,
} from "openclaw/plugin-sdk/webhook-ingress";
/** Re-exported mattermost plugin public API. */
export {
  applyAccountNameToChannelSection,
  applySetupAccountConfigPatch,
  migrateBaseNameToDefaultAccount,
} from "openclaw/plugin-sdk/setup";
/** Re-exported mattermost plugin public API. */
export {
  getAgentScopedMediaLocalRoots,
  resolveChannelMediaMaxBytes,
} from "openclaw/plugin-sdk/media-runtime";
/** Re-exported mattermost plugin public API, starting with normalize Provider Id. */
export { normalizeProviderId } from "openclaw/plugin-sdk/provider-model-shared";
/** Re-exported mattermost plugin public API, starting with set Mattermost Runtime. */
export { setMattermostRuntime } from "./src/runtime.js";
