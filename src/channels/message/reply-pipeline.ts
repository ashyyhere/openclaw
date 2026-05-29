// Channel reply pipeline builder for prefixes, typing, and delivery mode.
import type { SourceReplyDeliveryMode } from "../../auto-reply/get-reply-options.types.js";
import type { ReplyPayload } from "../../auto-reply/reply-payload.js";
import {
  resolveSourceReplyDeliveryMode,
  type SourceReplyDeliveryModeContext,
} from "../../auto-reply/reply/source-reply-delivery-mode.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { getLoadedChannelPluginForRead } from "../plugins/registry-loaded-read.js";
import { normalizeAnyChannelId } from "../registry-normalize.js";
import {
  createReplyPrefixContext,
  createReplyPrefixOptions,
  type ReplyPrefixContextBundle,
  type ReplyPrefixOptions,
} from "../reply-prefix.js";
import {
  createTypingCallbacks,
  type CreateTypingCallbacksParams,
  type TypingCallbacks,
} from "../typing.js";

/** Shared type for Reply Prefix Context in src/channels/message. */
export type ReplyPrefixContext = ReplyPrefixContextBundle["prefixContext"];
/** Re-exported API for src/channels/message, starting with Reply Prefix Context Bundle. */
export type { ReplyPrefixContextBundle, ReplyPrefixOptions };
/** Re-exported API for src/channels/message, starting with Create Typing Callbacks Params. */
export type { CreateTypingCallbacksParams, TypingCallbacks };
/** Re-exported API for src/channels/message, starting with create Reply Prefix Context. */
export { createReplyPrefixContext, createReplyPrefixOptions, createTypingCallbacks };
/** Re-exported API for src/channels/message, starting with Source Reply Delivery Mode. */
export type { SourceReplyDeliveryMode };

/** Resolve source reply delivery mode for a channel message pipeline. */
export function resolveChannelSourceReplyDeliveryMode(params: {
  cfg: OpenClawConfig;
  ctx: SourceReplyDeliveryModeContext;
  requested?: SourceReplyDeliveryMode;
  messageToolAvailable?: boolean;
}): SourceReplyDeliveryMode {
  return resolveSourceReplyDeliveryMode(params);
}

/** Shared type for Channel Reply Pipeline in src/channels/message. */
export type ChannelReplyPipeline = ReplyPrefixOptions & {
  typingCallbacks?: TypingCallbacks;
  transformReplyPayload?: (payload: ReplyPayload) => ReplyPayload | null;
};

/** Shared type for Create Channel Reply Pipeline Params in src/channels/message. */
export type CreateChannelReplyPipelineParams = {
  cfg: Parameters<typeof createReplyPrefixOptions>[0]["cfg"];
  agentId: string;
  channel?: string;
  accountId?: string;
  typing?: CreateTypingCallbacksParams;
  typingCallbacks?: TypingCallbacks;
  transformReplyPayload?: (payload: ReplyPayload) => ReplyPayload | null;
};

/** Create channel reply pipeline helpers for one channel/account context. */
export function createChannelReplyPipeline(
  params: CreateChannelReplyPipelineParams,
): ChannelReplyPipeline {
  const channelId = params.channel
    ? (normalizeAnyChannelId(params.channel) ?? params.channel)
    : undefined;
  let plugin: ReturnType<typeof getLoadedChannelPluginForRead> | undefined;
  let pluginTransformResolved = false;
  const resolvePluginTransform = () => {
    if (pluginTransformResolved) {
      return plugin?.messaging?.transformReplyPayload;
    }
    pluginTransformResolved = true;
    plugin = channelId ? getLoadedChannelPluginForRead(channelId) : undefined;
    return plugin?.messaging?.transformReplyPayload;
  };
  const transformReplyPayload = params.transformReplyPayload
    ? params.transformReplyPayload
    : channelId
      ? (payload: ReplyPayload) =>
          resolvePluginTransform()?.({
            payload,
            cfg: params.cfg,
            accountId: params.accountId,
          }) ?? payload
      : undefined;
  return {
    ...createReplyPrefixOptions({
      cfg: params.cfg,
      agentId: params.agentId,
      channel: params.channel,
      accountId: params.accountId,
    }),
    ...(transformReplyPayload ? { transformReplyPayload } : {}),
    ...(params.typingCallbacks
      ? { typingCallbacks: params.typingCallbacks }
      : params.typing
        ? { typingCallbacks: createTypingCallbacks(params.typing) }
        : {}),
  };
}
