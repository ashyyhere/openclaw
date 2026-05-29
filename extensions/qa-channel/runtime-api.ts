// extensions/qa-channel runtime api helpers and runtime behavior.
/** Re-exported qa-channel plugin public API. */
export {
  buildChannelConfigSchema,
  buildChannelOutboundSessionRoute,
  type ChannelGatewayContext,
  type ChannelMessageActionAdapter,
  type ChannelMessageActionName,
  type ChannelPlugin,
  createChatChannelPlugin,
  createComputedAccountStatusAdapter,
  createDefaultChannelRuntimeState,
  createPluginRuntimeStore,
  defineChannelPluginEntry,
  getChatChannelMeta,
  jsonResult,
  type OpenClawConfig,
  type PluginRuntime,
  readStringParam,
  type RuntimeEnv,
} from "./src/runtime-api.js";
/** Re-exported qa-channel plugin public API, starting with get Qa Channel Runtime. */
export { getQaChannelRuntime, setQaChannelRuntime } from "./src/runtime.js";
