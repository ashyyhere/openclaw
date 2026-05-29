// Private runtime barrel for the bundled Feishu extension.
// Keep this barrel thin and generic-only.

/** Re-exported feishu plugin public API. */
export type {
  AllowlistMatch,
  AnyAgentTool,
  BaseProbeResult,
  ChannelGroupContext,
  ChannelMessageActionName,
  ChannelMeta,
  ChannelOutboundAdapter,
  ChannelPlugin,
  HistoryEntry,
  OpenClawConfig,
  OpenClawPluginApi,
  OutboundIdentity,
  PluginRuntime,
  ReplyPayload,
} from "openclaw/plugin-sdk/core";
/** Re-exported feishu plugin public API, starting with Open Claw Config. */
export type { OpenClawConfig as ClawdbotConfig } from "openclaw/plugin-sdk/core";
/** Re-exported feishu plugin public API, starting with Runtime Env. */
export type { RuntimeEnv } from "openclaw/plugin-sdk/runtime";
/** Re-exported feishu plugin public API, starting with Group Tool Policy Config. */
export type { GroupToolPolicyConfig } from "openclaw/plugin-sdk/config-contracts";
/** Re-exported feishu plugin public API. */
export {
  DEFAULT_ACCOUNT_ID,
  buildChannelConfigSchema,
  createActionGate,
  createDedupeCache,
} from "openclaw/plugin-sdk/core";
/** Re-exported feishu plugin public API. */
export {
  PAIRING_APPROVED_MESSAGE,
  buildProbeChannelStatusSummary,
  createDefaultChannelRuntimeState,
} from "openclaw/plugin-sdk/channel-status";
/** Re-exported feishu plugin public API, starting with build Agent Media Payload. */
export { buildAgentMediaPayload } from "openclaw/plugin-sdk/agent-media-payload";
/** Re-exported feishu plugin public API, starting with create Channel Pairing Controller. */
export { createChannelPairingController } from "openclaw/plugin-sdk/channel-pairing";
/** Re-exported feishu plugin public API, starting with create Reply Prefix Context. */
export { createReplyPrefixContext } from "openclaw/plugin-sdk/channel-outbound";
/** Re-exported feishu plugin public API. */
export {
  evaluateSupplementalContextVisibility,
  filterSupplementalContextItems,
  resolveChannelContextVisibilityMode,
} from "openclaw/plugin-sdk/context-visibility-runtime";
/** Re-exported feishu plugin public API. */
export {
  loadSessionStore,
  resolveSessionStoreEntry,
} from "openclaw/plugin-sdk/session-store-runtime";
/** Re-exported feishu plugin public API, starting with read Json File With Fallback. */
export { readJsonFileWithFallback } from "openclaw/plugin-sdk/json-store";
/** Re-exported feishu plugin public API, starting with normalize Agent Id. */
export { normalizeAgentId } from "openclaw/plugin-sdk/routing";
/** Re-exported feishu plugin public API, starting with chunk Text For Outbound. */
export { chunkTextForOutbound } from "openclaw/plugin-sdk/text-chunking";
/** Re-exported feishu plugin public API. */
export {
  isRequestBodyLimitError,
  readRequestBodyWithLimit,
  requestBodyErrorToText,
} from "openclaw/plugin-sdk/webhook-ingress";
/** Re-exported feishu plugin public API, starting with set Feishu Runtime. */
export { setFeishuRuntime } from "./src/runtime.js";
