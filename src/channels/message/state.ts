// Durable message send state records and recovery classification.
import type { DurableMessageSendIntent, MessageReceipt } from "./types.js";

/** Durable send state persisted for recovery and diagnostics. */
export type DurableMessageSendState =
  | "pending"
  | "sent"
  | "suppressed"
  | "failed"
  | "unknown_after_send";

/** One durable send record with intent, state, receipt, and error metadata. */
export type DurableMessageStateRecord = {
  intent: DurableMessageSendIntent;
  state: DurableMessageSendState;
  receipt?: MessageReceipt;
  updatedAt: number;
  errorMessage?: string;
};

/** Create a durable send state record from an intent and optional result. */
export function createDurableMessageStateRecord(params: {
  intent: DurableMessageSendIntent;
  state?: DurableMessageSendState;
  receipt?: MessageReceipt;
  updatedAt?: number;
  error?: unknown;
}): DurableMessageStateRecord {
  return {
    intent: params.intent,
    state: params.state ?? (params.receipt ? "sent" : "pending"),
    ...(params.receipt ? { receipt: params.receipt } : {}),
    updatedAt: params.updatedAt ?? Date.now(),
    ...(params.error === undefined ? {} : { errorMessage: normalizeErrorMessage(params.error) }),
  };
}

/** Classify recovery state from durable intent/receipt presence. */
export function classifyDurableSendRecoveryState(params: {
  hasIntent: boolean;
  hasReceipt: boolean;
  platformSendMayHaveStarted: boolean;
  failed?: boolean;
  suppressed?: boolean;
}): DurableMessageSendState {
  if (params.failed) {
    return "failed";
  }
  if (params.suppressed) {
    return "suppressed";
  }
  if (params.hasReceipt) {
    return "sent";
  }
  if (params.hasIntent && params.platformSendMayHaveStarted) {
    return "unknown_after_send";
  }
  return "pending";
}

function normalizeErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
