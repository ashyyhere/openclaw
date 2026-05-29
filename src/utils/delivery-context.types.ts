// Shared types for utils delivery context types behavior.
import type { ChannelRouteRef, ChannelRouteTargetInput } from "../plugin-sdk/channel-route.js";

/** Shared type for Delivery Intent Ref in src/utils. */
export type DeliveryIntentRef = {
  id: string;
  kind: "outbound_queue";
  queuePolicy?: "required" | "best_effort";
};

/** Shared type for Delivery Context in src/utils. */
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

/** Shared type for Delivery Context Session Source in src/utils. */
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
