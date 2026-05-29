/** Shared types for inbound channel session routing updates. */
import type { MsgContext } from "../auto-reply/templating.js";
import type { GroupKeyResolution, SessionEntry } from "../config/sessions/types.js";
import type { ChannelRouteRef } from "../plugin-sdk/channel-route.js";

/** Shared type for Inbound Last Route Update in src/channels. */
export type InboundLastRouteUpdate = {
  sessionKey: string;
  channel: SessionEntry["lastChannel"];
  to: string;
  accountId?: string;
  threadId?: string | number;
  route?: ChannelRouteRef;
  mainDmOwnerPin?: {
    ownerRecipient: string;
    senderRecipient: string;
    onSkip?: (params: { ownerRecipient: string; senderRecipient: string }) => void;
  };
};

/** Shared type for Record Inbound Session in src/channels. */
export type RecordInboundSession = (params: {
  storePath: string;
  sessionKey: string;
  ctx: MsgContext;
  groupResolution?: GroupKeyResolution | null;
  createIfMissing?: boolean;
  updateLastRoute?: InboundLastRouteUpdate;
  onRecordError: (err: unknown) => void;
  trackSessionMetaTask?: (task: Promise<unknown>) => void;
}) => Promise<void>;
