/** Projects session route records into channel delivery contexts and labels. */
import type { SessionEntry } from "../config/sessions/types.js";
import type {
  ConversationRef,
  SessionBindingRecord,
} from "../infra/outbound/session-binding-service.js";
import {
  channelRouteThreadId,
  channelRouteTarget,
  normalizeChannelRouteRef,
  type ChannelRouteChatType,
  type ChannelRouteRef,
} from "../plugin-sdk/channel-route.js";
import {
  channelRouteFromDeliveryContext,
  deliveryContextFromChannelRoute,
  deliveryContextFromSession,
  normalizeDeliveryContext,
  normalizeSessionDeliveryFields,
  resolveConversationDeliveryTarget,
  type DeliveryContext,
} from "../utils/delivery-context.js";

/** Route ref guaranteed to include the channel id and delivery target needed to send. */
export type RoutableChannelRouteRef = ChannelRouteRef & {
  channel: string;
  target: {
    to: string;
    rawTo?: string;
    chatType?: ChannelRouteChatType;
  };
};

/** Session fields that preserve the last known route and legacy delivery context. */
export type SessionRouteDeliveryFields = {
  route?: ChannelRouteRef;
  deliveryContext?: DeliveryContext;
  lastChannel?: string;
  lastTo?: string;
  lastAccountId?: string;
  lastThreadId?: string | number;
};

/** Normalize a route and reject it unless it has enough data for channel delivery. */
export function normalizeRoutableChannelRoute(
  route?: ChannelRouteRef | null,
): RoutableChannelRouteRef | undefined {
  const normalized = normalizeChannelRouteRef({
    channel: route?.channel,
    accountId: route?.accountId,
    to: route?.target?.to,
    rawTo: route?.target?.rawTo,
    chatType: route?.target?.chatType,
    threadId: route?.thread?.id,
    threadKind: route?.thread?.kind,
    threadSource: route?.thread?.source,
  });
  if (!normalized?.channel || !normalized.target?.to) {
    return undefined;
  }
  return normalized as RoutableChannelRouteRef;
}

/** Convert legacy delivery-context fields into the canonical channel route shape. */
export function routeFromDeliveryContext(context?: DeliveryContext): ChannelRouteRef | undefined {
  return channelRouteFromDeliveryContext(normalizeDeliveryContext(context));
}

/** Project a canonical route back into legacy delivery-context fields. */
export function deliveryContextFromRoute(route?: ChannelRouteRef): DeliveryContext | undefined {
  return deliveryContextFromChannelRoute(route);
}

/** Read the best available route from a session entry, falling back to legacy fields. */
export function routeFromSessionEntry(entry?: SessionEntry | null): ChannelRouteRef | undefined {
  if (!entry) {
    return undefined;
  }
  return (
    normalizeSessionDeliveryFields(entry).route ??
    routeFromDeliveryContext(deliveryContextFromSession(entry))
  );
}

/** Build the session persistence fields for a canonical route. */
export function sessionDeliveryFieldsFromRoute(
  route?: ChannelRouteRef,
): SessionRouteDeliveryFields {
  return normalizeSessionDeliveryFields({ route });
}

/** Convert a persisted conversation binding reference into a delivery route. */
export function routeFromConversationRef(
  conversation?: ConversationRef | null,
): ChannelRouteRef | undefined {
  if (!conversation) {
    return undefined;
  }
  const target = resolveConversationDeliveryTarget({
    channel: conversation.channel,
    conversationId: conversation.conversationId,
    parentConversationId: conversation.parentConversationId,
  });
  return normalizeChannelRouteRef({
    channel: conversation.channel,
    accountId: conversation.accountId,
    to: target.to,
    threadId: target.threadId,
    threadSource: target.threadId ? "target" : undefined,
  });
}

/** Convert a conversation binding reference into a sendable route, if complete. */
export function routableRouteFromConversationRef(
  conversation?: ConversationRef | null,
): RoutableChannelRouteRef | undefined {
  return normalizeRoutableChannelRoute(routeFromConversationRef(conversation));
}

/** Extract the delivery route from a session binding record. */
export function routeFromBindingRecord(
  binding?: SessionBindingRecord | null,
): ChannelRouteRef | undefined {
  return routeFromConversationRef(binding?.conversation);
}

/** Extract a sendable route from a session binding record, if complete. */
export function routableRouteFromBindingRecord(
  binding?: SessionBindingRecord | null,
): RoutableChannelRouteRef | undefined {
  return normalizeRoutableChannelRoute(routeFromBindingRecord(binding));
}

/** Expand a canonical route into both legacy and flat delivery fields. */
export function routeToDeliveryFields(route?: ChannelRouteRef): {
  deliveryContext?: DeliveryContext;
  channel?: string;
  to?: string;
  accountId?: string;
  threadId?: string | number;
} {
  const deliveryContext = deliveryContextFromRoute(route);
  return {
    ...(deliveryContext ? { deliveryContext } : {}),
    ...(deliveryContext?.channel ? { channel: deliveryContext.channel } : {}),
    ...(deliveryContext?.to ? { to: deliveryContext.to } : {}),
    ...(deliveryContext?.accountId ? { accountId: deliveryContext.accountId } : {}),
    ...(deliveryContext?.threadId != null ? { threadId: deliveryContext.threadId } : {}),
  };
}

/** Compare whether two routes address the same channel/account/target/thread destination. */
export function routesShareDeliveryTarget(params: {
  left?: ChannelRouteRef | null;
  right?: ChannelRouteRef | null;
}): boolean {
  const left = normalizeRoutableChannelRoute(params.left);
  const right = normalizeRoutableChannelRoute(params.right);
  if (!left || !right) {
    return false;
  }
  return (
    left.channel === right.channel &&
    channelRouteTarget(left) === channelRouteTarget(right) &&
    (left.accountId == null || right.accountId == null || left.accountId === right.accountId) &&
    String(channelRouteThreadId(left) ?? "") === String(channelRouteThreadId(right) ?? "")
  );
}
