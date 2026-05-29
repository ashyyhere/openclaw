// Private runtime barrel for the bundled Twitch extension.
// Keep this barrel thin and aligned with the local extension surface.

/** Re-exported twitch plugin public API. */
export type {
  ChannelAccountSnapshot,
  ChannelCapabilities,
  ChannelGatewayContext,
  ChannelLogSink,
  ChannelMessageActionAdapter,
  ChannelMessageActionContext,
  ChannelMeta,
  ChannelOutboundAdapter,
  ChannelOutboundContext,
  ChannelResolveKind,
  ChannelResolveResult,
  ChannelStatusAdapter,
} from "openclaw/plugin-sdk/channel-contract";
/** Re-exported twitch plugin public API, starting with Channel Plugin. */
export type { ChannelPlugin } from "openclaw/plugin-sdk/channel-core";
/** Re-exported twitch plugin public API, starting with Outbound Delivery Result. */
export type { OutboundDeliveryResult } from "openclaw/plugin-sdk/channel-send-result";
/** Re-exported twitch plugin public API, starting with Open Claw Config. */
export type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
/** Re-exported twitch plugin public API, starting with Runtime Env. */
export type { RuntimeEnv } from "openclaw/plugin-sdk/runtime";
/** Re-exported twitch plugin public API, starting with Wizard Prompter. */
export type { WizardPrompter } from "openclaw/plugin-sdk/setup";
