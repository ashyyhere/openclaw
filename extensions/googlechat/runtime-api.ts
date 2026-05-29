// Private runtime barrel for the bundled Google Chat extension.
// Keep this barrel thin and avoid broad plugin-sdk surfaces during bootstrap.

/** Re-exported googlechat plugin public API, starting with DEFAULT ACCOUNT ID. */
export { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-id";
/** Re-exported googlechat plugin public API. */
export {
  createActionGate,
  jsonResult,
  readNumberParam,
  readReactionParams,
  readStringParam,
} from "openclaw/plugin-sdk/channel-actions";
/** Re-exported googlechat plugin public API, starting with build Channel Config Schema. */
export { buildChannelConfigSchema } from "openclaw/plugin-sdk/channel-config-primitives";
/** Re-exported googlechat plugin public API. */
export type {
  ChannelMessageActionAdapter,
  ChannelMessageActionName,
  ChannelStatusIssue,
} from "openclaw/plugin-sdk/channel-contract";
/** Re-exported googlechat plugin public API, starting with missing Target Error. */
export { missingTargetError } from "openclaw/plugin-sdk/channel-feedback";
/** Re-exported googlechat plugin public API. */
export {
  createAccountStatusSink,
  runPassiveAccountLifecycle,
} from "openclaw/plugin-sdk/channel-outbound";
/** Re-exported googlechat plugin public API, starting with create Channel Pairing Controller. */
export { createChannelPairingController } from "openclaw/plugin-sdk/channel-pairing";
/** Re-exported googlechat plugin public API, starting with create Channel Message Reply Pipeline. */
export { createChannelMessageReplyPipeline } from "openclaw/plugin-sdk/channel-outbound";
/** Re-exported googlechat plugin public API, starting with PAIRING APPROVED MESSAGE. */
export { PAIRING_APPROVED_MESSAGE } from "openclaw/plugin-sdk/channel-status";
/** Re-exported googlechat plugin public API, starting with chunk Text For Outbound. */
export { chunkTextForOutbound } from "openclaw/plugin-sdk/text-chunking";
/** Re-exported googlechat plugin public API, starting with Open Claw Config. */
export type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
/** Re-exported googlechat plugin public API, starting with Google Chat Config Schema. */
export { GoogleChatConfigSchema } from "openclaw/plugin-sdk/bundled-channel-config-schema";
/** Re-exported googlechat plugin public API. */
export {
  GROUP_POLICY_BLOCKED_LABEL,
  resolveAllowlistProviderRuntimeGroupPolicy,
  resolveDefaultGroupPolicy,
  warnMissingProviderGroupPolicyFallbackOnce,
} from "openclaw/plugin-sdk/runtime-group-policy";
/** Re-exported googlechat plugin public API, starting with is Dangerous Name Matching Enabled. */
export { isDangerousNameMatchingEnabled } from "openclaw/plugin-sdk/dangerous-name-runtime";
/** Re-exported googlechat plugin public API. */
export {
  readRemoteMediaBuffer,
  resolveChannelMediaMaxBytes,
} from "openclaw/plugin-sdk/media-runtime";
/** Re-exported googlechat plugin public API, starting with load Outbound Media From Url. */
export { loadOutboundMediaFromUrl } from "openclaw/plugin-sdk/outbound-media";
/** Re-exported googlechat plugin public API, starting with Plugin Runtime. */
export type { PluginRuntime } from "openclaw/plugin-sdk/runtime-store";
/** Re-exported googlechat plugin public API, starting with fetch With Ssr FGuard. */
export { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
/** Re-exported googlechat plugin public API. */
export type {
  GoogleChatAccountConfig,
  GoogleChatConfig,
} from "openclaw/plugin-sdk/config-contracts";
/** Re-exported googlechat plugin public API, starting with extract Tool Send. */
export { extractToolSend } from "openclaw/plugin-sdk/tool-send";
/** Re-exported googlechat plugin public API, starting with resolve Inbound Mention Decision. */
export { resolveInboundMentionDecision } from "openclaw/plugin-sdk/channel-inbound";
/** Re-exported googlechat plugin public API, starting with resolve Inbound Route Envelope Builder With Runtime. */
export { resolveInboundRouteEnvelopeBuilderWithRuntime } from "openclaw/plugin-sdk/inbound-envelope";
/** Re-exported googlechat plugin public API, starting with resolve Webhook Path. */
export { resolveWebhookPath } from "openclaw/plugin-sdk/webhook-ingress";
/** Re-exported googlechat plugin public API. */
export {
  registerWebhookTargetWithPluginRoute,
  resolveWebhookTargetWithAuthOrReject,
  withResolvedWebhookRequestPipeline,
} from "openclaw/plugin-sdk/webhook-targets";
/** Re-exported googlechat plugin public API. */
export {
  createWebhookInFlightLimiter,
  readJsonWebhookBodyOrReject,
  type WebhookInFlightLimiter,
} from "openclaw/plugin-sdk/webhook-request-guards";
/** Re-exported googlechat plugin public API, starting with set Google Chat Runtime. */
export { setGoogleChatRuntime } from "./src/runtime.js";
