/** Converts message receipts into channel turn delivery result records. */
import { listMessageReceiptPlatformIds } from "../message/receipt.js";
import type { MessageReceipt } from "../message/types.js";
import type { ChannelDeliveryIntent, ChannelDeliveryResult } from "./types.js";

/** Reused helper for create Channel Delivery Result From Receipt behavior in src/channels/turn. */
export function createChannelDeliveryResultFromReceipt(params: {
  receipt: MessageReceipt;
  threadId?: string;
  replyToId?: string;
  visibleReplySent?: boolean;
  deliveryIntent?: ChannelDeliveryIntent;
}): ChannelDeliveryResult {
  const messageIds = listMessageReceiptPlatformIds(params.receipt);
  return {
    ...(messageIds.length > 0 ? { messageIds } : {}),
    receipt: params.receipt,
    ...(params.threadId ? { threadId: params.threadId } : {}),
    ...(params.replyToId ? { replyToId: params.replyToId } : {}),
    ...(params.visibleReplySent === undefined ? {} : { visibleReplySent: params.visibleReplySent }),
    ...(params.deliveryIntent ? { deliveryIntent: params.deliveryIntent } : {}),
  };
}
