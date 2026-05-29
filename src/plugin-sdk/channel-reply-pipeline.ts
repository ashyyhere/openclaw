/**
 * @deprecated Legacy reply-pipeline subpath. New channel message code should
 * use `openclaw/plugin-sdk/channel-outbound`.
 */

export {
  createChannelReplyPipeline,
  createReplyPrefixContext,
  createReplyPrefixOptions,
  createTypingCallbacks,
  resolveChannelSourceReplyDeliveryMode,
} from "./channel-reply-core.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  ChannelReplyPipeline,
  CreateTypingCallbacksParams,
  ReplyPrefixContext,
  ReplyPrefixContextBundle,
  ReplyPrefixOptions,
  SourceReplyDeliveryMode,
  TypingCallbacks,
} from "./channel-reply-core.js";
