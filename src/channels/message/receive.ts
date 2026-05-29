// Message receive context and acknowledgement policy helpers.
import type { ChannelMessageReceiveAckPolicy } from "./types.js";

/** Ack policy used by a channel message receive adapter. */
export type MessageAckPolicy = ChannelMessageReceiveAckPolicy;

/** Pipeline stage after which a message may be acknowledged. */
export type MessageAckStage = "receive_record" | "agent_dispatch" | "durable_send" | "manual";

/** Current acknowledgement state for an inbound message. */
export type MessageAckState = "pending" | "acked" | "nacked";

/** Runtime receive context passed through channel message ingestion. */
export type MessageReceiveContext<TMessage = unknown> = {
  id: string;
  channel: string;
  accountId?: string;
  message: TMessage;
  ackPolicy: MessageAckPolicy;
  ackState: MessageAckState;
  ackedAt?: number;
  nackErrorMessage?: string;
  receivedAt: number;
  signal: AbortSignal;
  shouldAckAfter(stage: MessageAckStage): boolean;
  ack(): Promise<void>;
  nack(error: unknown): Promise<void>;
};

const neverAbortedSignal = new AbortController().signal;

/** Return true when a policy should ack after the given stage. */
export function shouldAckMessageAfterStage(
  policy: MessageAckPolicy,
  stage: MessageAckStage,
): boolean {
  switch (policy) {
    case "after_receive_record":
      return stage === "receive_record";
    case "after_agent_dispatch":
      return stage === "agent_dispatch";
    case "after_durable_send":
      return stage === "durable_send";
    case "manual":
      return false;
  }
  return false;
}

function normalizeAckErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** Reused helper for create Message Receive Context behavior in src/channels/message. */
export function createMessageReceiveContext<TMessage>(params: {
  id: string;
  channel: string;
  accountId?: string;
  message: TMessage;
  ackPolicy?: MessageAckPolicy;
  receivedAt?: number;
  signal?: AbortSignal;
  onAck?: () => Promise<void> | void;
  onNack?: (error: unknown) => Promise<void> | void;
}): MessageReceiveContext<TMessage> {
  const ctx: MessageReceiveContext<TMessage> = {
    id: params.id,
    channel: params.channel,
    ...(params.accountId ? { accountId: params.accountId } : {}),
    message: params.message,
    ackPolicy: params.ackPolicy ?? "after_receive_record",
    ackState: "pending",
    receivedAt: params.receivedAt ?? Date.now(),
    signal: params.signal ?? neverAbortedSignal,
    shouldAckAfter: (stage) => shouldAckMessageAfterStage(ctx.ackPolicy, stage),
    ack: async () => {
      if (ctx.ackState === "acked") {
        return;
      }
      await params.onAck?.();
      ctx.ackState = "acked";
      ctx.ackedAt = Date.now();
      delete ctx.nackErrorMessage;
    },
    nack: async (error) => {
      await params.onNack?.(error);
      ctx.ackState = "nacked";
      ctx.nackErrorMessage = normalizeAckErrorMessage(error);
    },
  };
  return ctx;
}
