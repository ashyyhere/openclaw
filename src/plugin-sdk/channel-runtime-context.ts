/** Public SDK barrel for channel runtime context contracts. */
export {
  getChannelRuntimeContext,
  registerChannelRuntimeContext,
  watchChannelRuntimeContexts,
} from "../infra/channel-runtime-context.js";
/** Re-exported API for src/plugin-sdk, starting with Channel Runtime Context Key. */
export type { ChannelRuntimeContextKey } from "../channels/plugins/channel-runtime-surface.types.js";
