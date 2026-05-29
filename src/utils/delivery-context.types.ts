// Delivery target metadata shared by session persistence and channel routing.
import type { ChannelRouteRef, ChannelRouteTargetInput } from "../plugin-sdk/channel-route.js";

/** Reference to an outbound delivery queue intent associated with a context. */
export type DeliveryIntentRef = {
  id: string;
  kind: "outbound_queue";
  queuePolicy?: "required" | "best_effort";
};

/** Canonical delivery target fields used to route outbound messages. */
export type DeliveryContext = Pick<
  ChannelRouteTargetInput,
  "accountId" | "channel" | "threadId" | "to"
> & {
  channel?: string;
  to?: string;
  accountId?: string;
  threadId?: string | number;
  deliveryIntent?: DeliveryIntentRef;
};

/** Session-like source fields that can be normalized into delivery context. */
export type DeliveryContextSessionSource = {
  route?: ChannelRouteRef;
  channel?: string;
  lastChannel?: string;
  lastTo?: string;
  lastAccountId?: string;
  lastThreadId?: string | number;
  origin?: {
    provider?: string;
    accountId?: string;
    threadId?: string | number;
  };
  deliveryContext?: DeliveryContext;
};
