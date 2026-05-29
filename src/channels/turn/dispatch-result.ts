/** Type guard helpers for dispatch results returned by channel turn handlers. */
import type { ReplyDispatchKind } from "../../auto-reply/reply/reply-dispatcher.types.js";

/** Shared type for Channel Turn Dispatch Result Like in src/channels/turn. */
export type ChannelTurnDispatchResultLike =
  | {
      queuedFinal?: boolean;
      counts?: Partial<Record<ReplyDispatchKind, number>>;
    }
  | null
  | undefined;

/** Shared type for Channel Turn Visible Delivery Signals in src/channels/turn. */
export type ChannelTurnVisibleDeliverySignals = {
  observedReplyDelivery?: boolean;
  fallbackDelivered?: boolean;
  deliverySummaryDelivered?: boolean;
};

/** Reused constant for EMPTY CHANNEL TURN DISPATCH COUNTS behavior in src/channels/turn. */
export const EMPTY_CHANNEL_TURN_DISPATCH_COUNTS: Record<ReplyDispatchKind, number> = {
  tool: 0,
  block: 0,
  final: 0,
};

/** Reused helper for resolve Channel Turn Dispatch Counts behavior in src/channels/turn. */
export function resolveChannelTurnDispatchCounts(
  result: ChannelTurnDispatchResultLike,
): Record<ReplyDispatchKind, number> {
  return {
    ...EMPTY_CHANNEL_TURN_DISPATCH_COUNTS,
    ...result?.counts,
  };
}

/** Reused helper for has Visible Channel Turn Dispatch behavior in src/channels/turn. */
export function hasVisibleChannelTurnDispatch(
  result: ChannelTurnDispatchResultLike,
  signals: ChannelTurnVisibleDeliverySignals = {},
): boolean {
  const counts = resolveChannelTurnDispatchCounts(result);
  return (
    signals.observedReplyDelivery === true ||
    signals.fallbackDelivered === true ||
    signals.deliverySummaryDelivered === true ||
    result?.queuedFinal === true ||
    counts.tool > 0 ||
    counts.block > 0 ||
    counts.final > 0
  );
}

/** Reused helper for has Final Channel Turn Dispatch behavior in src/channels/turn. */
export function hasFinalChannelTurnDispatch(
  result: ChannelTurnDispatchResultLike,
  signals: Pick<
    ChannelTurnVisibleDeliverySignals,
    "fallbackDelivered" | "deliverySummaryDelivered"
  > = {},
): boolean {
  const counts = resolveChannelTurnDispatchCounts(result);
  return (
    signals.fallbackDelivered === true ||
    signals.deliverySummaryDelivered === true ||
    result?.queuedFinal === true ||
    counts.final > 0
  );
}
