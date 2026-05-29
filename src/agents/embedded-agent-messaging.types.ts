/** Shared messaging payload types emitted by embedded-agent tool handling. */
import type { ReplyPayload } from "../auto-reply/reply-payload.js";

/** Normalized send action extracted from core or channel messaging tools. */
export type MessagingToolSend = {
  tool: string;
  provider: string;
  accountId?: string;
  to?: string;
  threadId?: string;
  threadImplicit?: boolean;
  threadSuppressed?: boolean;
  text?: string;
  mediaUrls?: string[];
};

/** Reply payload fields that may be sourced from a messaging tool result. */
export type MessagingToolSourceReplyPayload = Pick<
  ReplyPayload,
  | "audioAsVoice"
  | "channelData"
  | "interactive"
  | "mediaUrl"
  | "mediaUrls"
  | "presentation"
  | "text"
> & {
  idempotencyKey?: string;
};
