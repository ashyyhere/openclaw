// Shared reply dispatcher types.
import type { ReplyPayload } from "../types.js";

/** Shared type for Reply Dispatch Kind in src/auto-reply/reply. */
export type ReplyDispatchKind = "tool" | "block" | "final";

/** Shared type for Reply Dispatch Before Deliver in src/auto-reply/reply. */
export type ReplyDispatchBeforeDeliver = (
  payload: ReplyPayload,
  info: { kind: ReplyDispatchKind },
) => Promise<ReplyPayload | null> | ReplyPayload | null;

/** Shared type for Reply Dispatcher in src/auto-reply/reply. */
export type ReplyDispatcher = {
  sendToolResult: (payload: ReplyPayload) => boolean;
  sendBlockReply: (payload: ReplyPayload) => boolean;
  sendFinalReply: (payload: ReplyPayload) => boolean;
  appendBeforeDeliver?: (hook: ReplyDispatchBeforeDeliver) => void;
  waitForIdle: () => Promise<void>;
  getQueuedCounts: () => Record<ReplyDispatchKind, number>;
  getCancelledCounts?: () => Record<ReplyDispatchKind, number>;
  getFailedCounts: () => Record<ReplyDispatchKind, number>;
  markComplete: () => void;
};
