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

/** Shared type for Routable Channel Route Ref in src/channels. */
export type RoutableChannelRouteRef = ChannelRouteRef & {
  channel: string;
  target: {
    to: string;
    rawTo?: string;
    chatType?: ChannelRouteChatType;
  };
};

/** Shared type for Session Route Delivery Fields in src/channels. */
export type SessionRouteDeliveryFields = {
  route?: ChannelRouteRef;
  deliveryContext?: DeliveryContext;
  lastChannel?: string;
  lastTo?: string;
  lastAccountId?: string;
  lastThreadId?: string | number;
};

/** Reused helper for normalize Routable Channel Route behavior in src/channels. */
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

/** Reused helper for route From Delivery Context behavior in src/channels. */
export function routeFromDeliveryContext(context?: DeliveryContext): ChannelRouteRef | undefined {
  return channelRouteFromDeliveryContext(normalizeDeliveryContext(context));
}

/** Reused helper for delivery Context From Route behavior in src/channels. */
export function deliveryContextFromRoute(route?: ChannelRouteRef): DeliveryContext | undefined {
  return deliveryContextFromChannelRoute(route);
}

/** Reused helper for route From Session Entry behavior in src/channels. */
export function routeFromSessionEntry(entry?: SessionEntry | null): ChannelRouteRef | undefined {
  if (!entry) {
    return undefined;
  }
  return (
    normalizeSessionDeliveryFields(entry).route ??
    routeFromDeliveryContext(deliveryContextFromSession(entry))
  );
}

/** Reused helper for session Delivery Fields From Route behavior in src/channels. */
export function sessionDeliveryFieldsFromRoute(
  route?: ChannelRouteRef,
): SessionRouteDeliveryFields {
  return normalizeSessionDeliveryFields({ route });
}

/** Reused helper for route From Conversation Ref behavior in src/channels. */
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

/** Reused helper for routable Route From Conversation Ref behavior in src/channels. */
export function routableRouteFromConversationRef(
  conversation?: ConversationRef | null,
): RoutableChannelRouteRef | undefined {
  return normalizeRoutableChannelRoute(routeFromConversationRef(conversation));
}

/** Reused helper for route From Binding Record behavior in src/channels. */
export function routeFromBindingRecord(
  binding?: SessionBindingRecord | null,
): ChannelRouteRef | undefined {
  return routeFromConversationRef(binding?.conversation);
}

/** Reused helper for routable Route From Binding Record behavior in src/channels. */
export function routableRouteFromBindingRecord(
  binding?: SessionBindingRecord | null,
): RoutableChannelRouteRef | undefined {
  return normalizeRoutableChannelRoute(routeFromBindingRecord(binding));
}

/** Reused helper for route To Delivery Fields behavior in src/channels. */
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

/** Reused helper for routes Share Delivery Target behavior in src/channels. */
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
