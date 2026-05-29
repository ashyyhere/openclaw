// Private runtime barrel for the bundled IRC extension.
// Keep this barrel thin and generic-only.

/** Re-exported irc plugin public API, starting with Base Probe Result. */
export type { BaseProbeResult } from "openclaw/plugin-sdk/channel-contract";
/** Re-exported irc plugin public API, starting with Channel Plugin. */
export type { ChannelPlugin } from "openclaw/plugin-sdk/channel-core";
/** Re-exported irc plugin public API, starting with Open Claw Config. */
export type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
/** Re-exported irc plugin public API, starting with Plugin Runtime. */
export type { PluginRuntime } from "openclaw/plugin-sdk/runtime-store";
/** Re-exported irc plugin public API, starting with Runtime Env. */
export type { RuntimeEnv } from "openclaw/plugin-sdk/runtime";
/** Re-exported irc plugin public API. */
export type {
  BlockStreamingCoalesceConfig,
  DmConfig,
  DmPolicy,
  GroupPolicy,
  GroupToolPolicyBySenderConfig,
  GroupToolPolicyConfig,
  MarkdownConfig,
} from "openclaw/plugin-sdk/config-contracts";
/** Re-exported irc plugin public API, starting with Outbound Reply Payload. */
export type { OutboundReplyPayload } from "openclaw/plugin-sdk/reply-payload";
/** Re-exported irc plugin public API, starting with DEFAULT ACCOUNT ID. */
export { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-id";
/** Re-exported irc plugin public API, starting with build Channel Config Schema. */
export { buildChannelConfigSchema } from "openclaw/plugin-sdk/channel-config-primitives";
/** Re-exported irc plugin public API. */
export {
  PAIRING_APPROVED_MESSAGE,
  buildBaseChannelStatusSummary,
} from "openclaw/plugin-sdk/channel-status";
/** Re-exported irc plugin public API, starting with create Channel Pairing Controller. */
export { createChannelPairingController } from "openclaw/plugin-sdk/channel-pairing";
/** Re-exported irc plugin public API, starting with create Account Status Sink. */
export { createAccountStatusSink } from "openclaw/plugin-sdk/channel-outbound";
/** Re-exported irc plugin public API, starting with resolve Control Command Gate. */
export { resolveControlCommandGate } from "openclaw/plugin-sdk/command-auth-native";
/** Re-exported irc plugin public API, starting with create Channel Message Reply Pipeline. */
export { createChannelMessageReplyPipeline } from "openclaw/plugin-sdk/channel-outbound";
/** Re-exported irc plugin public API, starting with chunk Text For Outbound. */
export { chunkTextForOutbound } from "openclaw/plugin-sdk/text-chunking";
/** Re-exported irc plugin public API. */
export {
  deliverFormattedTextWithAttachments,
  formatTextWithAttachmentLinks,
  resolveOutboundMediaUrls,
} from "openclaw/plugin-sdk/reply-payload";
/** Re-exported irc plugin public API. */
export {
  GROUP_POLICY_BLOCKED_LABEL,
  resolveAllowlistProviderRuntimeGroupPolicy,
  resolveDefaultGroupPolicy,
  warnMissingProviderGroupPolicyFallbackOnce,
} from "openclaw/plugin-sdk/runtime-group-policy";
/** Re-exported irc plugin public API, starting with is Dangerous Name Matching Enabled. */
export { isDangerousNameMatchingEnabled } from "openclaw/plugin-sdk/dangerous-name-runtime";
/** Re-exported irc plugin public API, starting with log Inbound Drop. */
export { logInboundDrop } from "openclaw/plugin-sdk/channel-inbound";
