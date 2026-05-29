// extensions/mattermost/src/mattermost runtime api helpers and runtime behavior.
/** Re-exported mattermost plugin public API. */
export type {
  BaseProbeResult,
  ChannelAccountSnapshot,
  ChannelDirectoryEntry,
  ChatType,
  HistoryEntry,
  OpenClawConfig,
  OpenClawPluginApi,
  ReplyPayload,
} from "openclaw/plugin-sdk/core";
/** Re-exported mattermost plugin public API, starting with Runtime Env. */
export type { RuntimeEnv } from "openclaw/plugin-sdk/runtime";
/** Re-exported mattermost plugin public API, starting with build Agent Media Payload. */
export { buildAgentMediaPayload } from "openclaw/plugin-sdk/agent-media-payload";
/** Re-exported mattermost plugin public API, starting with resolve Allowlist Match Simple. */
export { resolveAllowlistMatchSimple } from "openclaw/plugin-sdk/allow-from";
/** Re-exported mattermost plugin public API, starting with log Inbound Drop. */
export { logInboundDrop } from "openclaw/plugin-sdk/channel-inbound";
/** Re-exported mattermost plugin public API, starting with create Channel Pairing Controller. */
export { createChannelPairingController } from "openclaw/plugin-sdk/channel-pairing";
/** Re-exported mattermost plugin public API, starting with create Channel Message Reply Pipeline. */
export { createChannelMessageReplyPipeline } from "openclaw/plugin-sdk/channel-outbound";
/** Re-exported mattermost plugin public API, starting with log Typing Failure. */
export { logTypingFailure } from "openclaw/plugin-sdk/channel-feedback";
/** Re-exported mattermost plugin public API. */
export {
  listSkillCommandsForAgents,
  resolveControlCommandGate,
} from "openclaw/plugin-sdk/command-auth-native";
/** Re-exported mattermost plugin public API, starting with build Models Provider Data. */
export { buildModelsProviderData } from "openclaw/plugin-sdk/models-provider-runtime";
/** Re-exported mattermost plugin public API, starting with is Dangerous Name Matching Enabled. */
export { isDangerousNameMatchingEnabled } from "openclaw/plugin-sdk/dangerous-name-runtime";
/** Re-exported mattermost plugin public API. */
export {
  resolveAllowlistProviderRuntimeGroupPolicy,
  resolveDefaultGroupPolicy,
  warnMissingProviderGroupPolicyFallbackOnce,
} from "openclaw/plugin-sdk/runtime-group-policy";
/** Re-exported mattermost plugin public API, starting with resolve Channel Media Max Bytes. */
export { resolveChannelMediaMaxBytes } from "openclaw/plugin-sdk/media-runtime";
/** Re-exported mattermost plugin public API, starting with load Outbound Media From Url. */
export { loadOutboundMediaFromUrl } from "openclaw/plugin-sdk/outbound-media";
// Legacy map-helper exports stay for older plugin consumers. New message-turn
// code should use createChannelHistoryWindow.
/** Re-exported mattermost plugin public API. */
export {
  DEFAULT_GROUP_HISTORY_LIMIT,
  createChannelHistoryWindow,
  buildInboundHistoryFromMap,
  buildPendingHistoryContextFromMap,
  recordPendingHistoryEntryIfEnabled,
} from "openclaw/plugin-sdk/reply-history";
/** Re-exported mattermost plugin public API, starting with register Plugin Http Route. */
export { registerPluginHttpRoute } from "openclaw/plugin-sdk/webhook-targets";
/** Re-exported mattermost plugin public API. */
export {
  isRequestBodyLimitError,
  readRequestBodyWithLimit,
} from "openclaw/plugin-sdk/webhook-ingress";
/** Re-exported mattermost plugin public API. */
export {
  isTrustedProxyAddress,
  parseStrictPositiveInteger,
  resolveClientIp,
} from "openclaw/plugin-sdk/core";
/** Re-exported mattermost plugin public API, starting with parse Tcp Port. */
export { parseTcpPort } from "openclaw/plugin-sdk/number-runtime";
