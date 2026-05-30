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

/** Prefix template context prepared for channel replies. */
export type ReplyPrefixContext = ReplyPrefixContextBundle["prefixContext"];
/** Reply prefix bundle/options types re-exported for channel senders. */
export type { ReplyPrefixContextBundle, ReplyPrefixOptions };
/** Typing callback types re-exported for channel reply pipelines. */
export type { CreateTypingCallbacksParams, TypingCallbacks };
/** Prefix/typing helpers re-exported for channel reply pipelines. */
export { createReplyPrefixContext, createReplyPrefixOptions, createTypingCallbacks };
/** Source reply delivery mode type used by channel pipeline resolution. */
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

/** Reply pipeline pieces assembled for one channel/account context. */
export type ChannelReplyPipeline = ReplyPrefixOptions & {
  typingCallbacks?: TypingCallbacks;
  transformReplyPayload?: (payload: ReplyPayload) => ReplyPayload | null;
};

/** Inputs used to create channel-specific reply prefix, typing, and transform behavior. */
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
