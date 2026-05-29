// Private runtime barrel for the bundled Microsoft Teams extension.
// Keep this barrel thin and aligned with the local extension surface.

/** Re-exported msteams plugin public API, starting with DEFAULT ACCOUNT ID. */
export { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-id";
/** Re-exported msteams plugin public API, starting with Allowlist Match. */
export type { AllowlistMatch } from "openclaw/plugin-sdk/allow-from";
/** Re-exported msteams plugin public API. */
export {
  mergeAllowlist,
  resolveAllowlistMatchSimple,
  summarizeMapping,
} from "openclaw/plugin-sdk/allow-from";
/** Re-exported msteams plugin public API. */
export type {
  BaseProbeResult,
  ChannelDirectoryEntry,
  ChannelGroupContext,
  ChannelMessageActionName,
  ChannelOutboundAdapter,
} from "openclaw/plugin-sdk/channel-contract";
/** Re-exported msteams plugin public API, starting with Channel Plugin. */
export type { ChannelPlugin } from "openclaw/plugin-sdk/channel-core";
/** Re-exported msteams plugin public API, starting with log Typing Failure. */
export { logTypingFailure } from "openclaw/plugin-sdk/channel-outbound";
/** Re-exported msteams plugin public API, starting with create Channel Pairing Controller. */
export { createChannelPairingController } from "openclaw/plugin-sdk/channel-pairing";
/** Re-exported msteams plugin public API, starting with resolve Tools By Sender. */
export { resolveToolsBySender } from "openclaw/plugin-sdk/channel-policy";
/** Re-exported msteams plugin public API, starting with create Channel Message Reply Pipeline. */
export { createChannelMessageReplyPipeline } from "openclaw/plugin-sdk/channel-outbound";
/** Re-exported msteams plugin public API. */
export {
  PAIRING_APPROVED_MESSAGE,
  buildProbeChannelStatusSummary,
  createDefaultChannelRuntimeState,
} from "openclaw/plugin-sdk/channel-status";
/** Re-exported msteams plugin public API. */
export {
  buildChannelKeyCandidates,
  normalizeChannelSlug,
  resolveChannelEntryMatchWithFallback,
  resolveNestedAllowlistDecision,
} from "openclaw/plugin-sdk/channel-targets";
/** Re-exported msteams plugin public API. */
export type {
  GroupPolicy,
  GroupToolPolicyConfig,
  MSTeamsChannelConfig,
  MSTeamsCloudName,
  MSTeamsConfig,
  MSTeamsReplyStyle,
  MSTeamsTeamConfig,
  MarkdownTableMode,
  OpenClawConfig,
} from "openclaw/plugin-sdk/config-contracts";
/** Re-exported msteams plugin public API, starting with is Dangerous Name Matching Enabled. */
export { isDangerousNameMatchingEnabled } from "openclaw/plugin-sdk/dangerous-name-runtime";
/** Re-exported msteams plugin public API, starting with resolve Default Group Policy. */
export { resolveDefaultGroupPolicy } from "openclaw/plugin-sdk/runtime-group-policy";
/** Re-exported msteams plugin public API, starting with with File Lock. */
export { withFileLock } from "openclaw/plugin-sdk/file-lock";
/** Re-exported msteams plugin public API, starting with keep Http Server Task Alive. */
export { keepHttpServerTaskAlive } from "openclaw/plugin-sdk/channel-outbound";
/** Re-exported msteams plugin public API. */
export {
  detectMime,
  extensionForMime,
  extractOriginalFilename,
  getFileExtension,
  resolveChannelMediaMaxBytes,
} from "openclaw/plugin-sdk/media-runtime";
/** Re-exported msteams plugin public API, starting with dispatch Reply From Config With Settled Dispatcher. */
export { dispatchReplyFromConfigWithSettledDispatcher } from "openclaw/plugin-sdk/channel-inbound";
/** Re-exported msteams plugin public API, starting with load Outbound Media From Url. */
export { loadOutboundMediaFromUrl } from "openclaw/plugin-sdk/outbound-media";
/** Re-exported msteams plugin public API, starting with build Media Payload. */
export { buildMediaPayload } from "openclaw/plugin-sdk/reply-payload";
/** Re-exported msteams plugin public API, starting with Reply Payload. */
export type { ReplyPayload } from "openclaw/plugin-sdk/reply-payload";
/** Re-exported msteams plugin public API, starting with Plugin Runtime. */
export type { PluginRuntime } from "openclaw/plugin-sdk/runtime-store";
/** Re-exported msteams plugin public API, starting with Runtime Env. */
export type { RuntimeEnv } from "openclaw/plugin-sdk/runtime";
/** Re-exported msteams plugin public API, starting with Ssr FPolicy. */
export type { SsrFPolicy } from "openclaw/plugin-sdk/ssrf-runtime";
/** Re-exported msteams plugin public API, starting with fetch With Ssr FGuard. */
export { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
/** Re-exported msteams plugin public API, starting with normalize String Entries. */
export { normalizeStringEntries } from "openclaw/plugin-sdk/string-normalization-runtime";
/** Re-exported msteams plugin public API, starting with chunk Text For Outbound. */
export { chunkTextForOutbound } from "openclaw/plugin-sdk/text-chunking";
/** Re-exported msteams plugin public API, starting with DEFAULT WEBHOOK MAX BODY BYTES. */
export { DEFAULT_WEBHOOK_MAX_BODY_BYTES } from "openclaw/plugin-sdk/webhook-ingress";
/** Re-exported msteams plugin public API, starting with set MSTeams Runtime. */
export { setMSTeamsRuntime } from "./src/runtime.js";
