/** Runtime SDK barrel for reply dispatch chunk-mode resolution. */
export { resolveChunkMode } from "../auto-reply/chunk.js";
/** Re-exported API for src/plugin-sdk, starting with generate Conversation Label. */
export { generateConversationLabel } from "../auto-reply/reply/conversation-label-generator.js";
/** Re-exported API for src/plugin-sdk, starting with finalize Inbound Context. */
export { finalizeInboundContext } from "../auto-reply/reply/inbound-context.js";
/** Re-exported API for src/plugin-sdk, starting with Command Turn Context. */
export type { CommandTurnContext } from "../auto-reply/command-turn-context.js";
import type {
  DispatchReplyWithBufferedBlockDispatcher,
  DispatchReplyWithDispatcher,
} from "../auto-reply/reply/provider-dispatcher.types.js";

/** Re-exported API for src/plugin-sdk. */
export type {
  DispatchReplyWithBufferedBlockDispatcher,
  DispatchReplyWithDispatcher,
} from "../auto-reply/reply/provider-dispatcher.types.js";
/** Re-exported API for src/plugin-sdk, starting with Reply Payload. */
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

/** Reused constant for dispatch Reply With Dispatcher behavior in src/plugin-sdk. */
export const dispatchReplyWithDispatcher: DispatchReplyWithDispatcher = async (params) => {
  const { dispatchReplyWithDispatcher: dispatch } = await loadProviderDispatcherRuntimeModule();
  return await dispatch(params);
};
