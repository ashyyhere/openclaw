// Outbound delivery result and failure contracts.
// Shared by direct channel delivery, queue recovery, and result formatting.
import type { MessageReceipt } from "../../channels/message/types.js";
import type { ChannelId } from "../../channels/plugins/channel-id.types.js";

/** Platform send identity returned by a successful outbound delivery. */
export type OutboundDeliveryResult = {
  channel: Exclude<ChannelId, "none">;
  messageId: string;
  chatId?: string;
  channelId?: string;
  roomId?: string;
  conversationId?: string;
  timestamp?: number;
  toJid?: string;
  pollId?: string;
  receipt?: MessageReceipt;
  // Channel docking: stash channel-specific fields here to avoid core type churn.
  meta?: Record<string, unknown>;
};

/** Reason a payload was intentionally not delivered after hooks/visibility checks. */
export type OutboundPayloadDeliverySuppressionReason =
  | "cancelled_by_message_sending_hook"
  | "cancelled_by_reply_payload_sending_hook"
  | "empty_after_message_sending_hook"
  | "empty_after_reply_payload_sending_hook"
  | "no_visible_payload"
  | "adapter_returned_no_identity";

/** Delivery stage where a send failure occurred. */
export type OutboundDeliveryFailureStage = "platform_send" | "queue" | "unknown";

/** Per-payload delivery outcome for batch sends. */
export type OutboundPayloadDeliveryOutcome =
  | {
      index: number;
      status: "sent";
      results: OutboundDeliveryResult[];
    }
  | {
      index: number;
      status: "suppressed";
      reason: OutboundPayloadDeliverySuppressionReason;
      hookEffect?: {
        cancelReason?: string;
        metadata?: Record<string, unknown>;
      };
    }
  | {
      index: number;
      status: "failed";
      error: unknown;
      sentBeforeError: boolean;
      stage: OutboundDeliveryFailureStage;
    };

/** Error carrying partial send results and per-payload outcomes. */
export class OutboundDeliveryError extends Error {
  readonly results: OutboundDeliveryResult[];
  readonly payloadOutcomes: OutboundPayloadDeliveryOutcome[];
  readonly sentBeforeError: boolean;
  readonly stage: OutboundDeliveryFailureStage;

  constructor(
    message: string,
    options: {
      cause: unknown;
      results?: readonly OutboundDeliveryResult[];
      payloadOutcomes?: readonly OutboundPayloadDeliveryOutcome[];
      stage?: OutboundDeliveryFailureStage;
    },
  ) {
    super(message, { cause: options.cause });
    this.name = "OutboundDeliveryError";
    this.results = [...(options.results ?? [])];
    this.payloadOutcomes = [...(options.payloadOutcomes ?? [])];
    this.sentBeforeError = this.results.length > 0;
    this.stage = options.stage ?? "unknown";
  }
}

/** Narrow errors that include outbound delivery partial-result metadata. */
export function isOutboundDeliveryError(error: unknown): error is OutboundDeliveryError {
  return error instanceof OutboundDeliveryError;
}
