// extensions/twitch api helpers and runtime behavior.
/** Re-exported twitch plugin public API. */
export {
  type ChannelAccountSnapshot,
  type ChannelCapabilities,
  type ChannelGatewayContext,
  type ChannelLogSink,
  type ChannelMessageActionAdapter,
  type ChannelMessageActionContext,
  type ChannelMeta,
  type ChannelOutboundAdapter,
  type ChannelOutboundContext,
  type ChannelPlugin,
  type ChannelResolveKind,
  type ChannelResolveResult,
  type ChannelStatusAdapter,
  type OpenClawConfig,
  type OutboundDeliveryResult,
  type RuntimeEnv,
  type WizardPrompter,
} from "./runtime-api.js";
/** Re-exported twitch plugin public API, starting with twitch Plugin. */
export { twitchPlugin } from "./src/plugin.js";
/** Re-exported twitch plugin public API, starting with set Twitch Runtime. */
export { setTwitchRuntime } from "./src/runtime.js";
