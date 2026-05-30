/** Runtime SDK barrel for reply dispatch chunk-mode resolution. */
export { resolveChunkMode } from "../auto-reply/chunk.js";
/** Conversation-label helper used by plugins that dispatch replies directly. */
export { generateConversationLabel } from "../auto-reply/reply/conversation-label-generator.js";
/** Finalize inbound reply context before dispatching plugin-generated replies. */
export { finalizeInboundContext } from "../auto-reply/reply/inbound-context.js";
/** Command turn context type shared with reply dispatch helpers. */
export type { CommandTurnContext } from "../auto-reply/command-turn-context.js";
import type {
  DispatchReplyWithBufferedBlockDispatcher,
  DispatchReplyWithDispatcher,
} from "../auto-reply/reply/provider-dispatcher.types.js";

/** Dispatcher function types mirrored from the runtime implementation. */
export type {
  DispatchReplyWithBufferedBlockDispatcher,
  DispatchReplyWithDispatcher,
} from "../auto-reply/reply/provider-dispatcher.types.js";
/** Reply payload shape accepted by dispatch helpers. */
export type { ReplyPayload } from "./reply-payload.js";

let providerDispatcherRuntimeModulePromise: Promise<
  typeof import("../auto-reply/reply/provider-dispatcher.runtime.js")
> | null = null;

const loadProviderDispatcherRuntimeModule = async () => {
  providerDispatcherRuntimeModulePromise ??=
    import("../auto-reply/reply/provider-dispatcher.runtime.js");
  return await providerDispatcherRuntimeModulePromise;
};

export const dispatchReplyWithBufferedBlockDispatcher: DispatchReplyWithBufferedBlockDispatcher =
  async (params) => {
    const { dispatchReplyWithBufferedBlockDispatcher: dispatch } =
      await loadProviderDispatcherRuntimeModule();
    return await dispatch(params);
  };

/** Lazy runtime wrapper for plain reply dispatch, preserving the SDK import boundary. */
export const dispatchReplyWithDispatcher: DispatchReplyWithDispatcher = async (params) => {
  const { dispatchReplyWithDispatcher: dispatch } = await loadProviderDispatcherRuntimeModule();
  return await dispatch(params);
};
