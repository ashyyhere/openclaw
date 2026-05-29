// Private runtime barrel for the bundled Nextcloud Talk extension.
// Keep this barrel thin and aligned with the local extension surface.

/** Re-exported nextcloud-talk plugin public API, starting with Allowlist Match. */
export type { AllowlistMatch } from "openclaw/plugin-sdk/allow-from";
/** Re-exported nextcloud-talk plugin public API, starting with Channel Group Context. */
export type { ChannelGroupContext } from "openclaw/plugin-sdk/channel-contract";
/** Re-exported nextcloud-talk plugin public API, starting with log Inbound Drop. */
export { logInboundDrop } from "openclaw/plugin-sdk/channel-inbound";
/** Re-exported nextcloud-talk plugin public API, starting with create Channel Pairing Controller. */
export { createChannelPairingController } from "openclaw/plugin-sdk/channel-pairing";
/** Re-exported nextcloud-talk plugin public API. */
export type {
  BlockStreamingCoalesceConfig,
  DmConfig,
  DmPolicy,
  GroupPolicy,
  GroupToolPolicyConfig,
  OpenClawConfig,
} from "openclaw/plugin-sdk/config-contracts";
/** Re-exported nextcloud-talk plugin public API. */
export {
  GROUP_POLICY_BLOCKED_LABEL,
  resolveAllowlistProviderRuntimeGroupPolicy,
  resolveDefaultGroupPolicy,
  warnMissingProviderGroupPolicyFallbackOnce,
} from "openclaw/plugin-sdk/runtime-group-policy";
/** Re-exported nextcloud-talk plugin public API, starting with create Channel Message Reply Pipeline. */
export { createChannelMessageReplyPipeline } from "openclaw/plugin-sdk/channel-outbound";
/** Re-exported nextcloud-talk plugin public API, starting with Outbound Reply Payload. */
export type { OutboundReplyPayload } from "openclaw/plugin-sdk/reply-payload";
/** Re-exported nextcloud-talk plugin public API, starting with deliver Formatted Text With Attachments. */
export { deliverFormattedTextWithAttachments } from "openclaw/plugin-sdk/reply-payload";
/** Re-exported nextcloud-talk plugin public API, starting with Plugin Runtime. */
export type { PluginRuntime } from "openclaw/plugin-sdk/runtime-store";
/** Re-exported nextcloud-talk plugin public API, starting with Runtime Env. */
export type { RuntimeEnv } from "openclaw/plugin-sdk/runtime";
/** Re-exported nextcloud-talk plugin public API, starting with Secret Input. */
export type { SecretInput } from "openclaw/plugin-sdk/secret-input";
/** Re-exported nextcloud-talk plugin public API, starting with fetch With Ssr FGuard. */
export { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
/** Re-exported nextcloud-talk plugin public API, starting with set Nextcloud Talk Runtime. */
export { setNextcloudTalkRuntime } from "./src/runtime.js";
