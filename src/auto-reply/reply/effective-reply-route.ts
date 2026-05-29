// Effective reply route resolution from session and inbound context.
import type { SessionEntry } from "../../config/sessions/types.js";
import type { FinalizedMsgContext } from "../templating.js";

/** Shared type for Effective Reply Route Context in src/auto-reply/reply. */
export type EffectiveReplyRouteContext = Pick<
  FinalizedMsgContext,
  "Provider" | "OriginatingChannel" | "OriginatingTo" | "AccountId"
>;

/** Shared type for Effective Reply Route Entry in src/auto-reply/reply. */
export type EffectiveReplyRouteEntry = Pick<
  SessionEntry,
  "deliveryContext" | "lastChannel" | "lastTo" | "lastAccountId"
>;

/** Shared type for Effective Reply Route in src/auto-reply/reply. */
export type EffectiveReplyRoute = {
  channel?: string;
  to?: string;
  accountId?: string;
};

/** Reused helper for is System Event Provider behavior in src/auto-reply/reply. */
export function isSystemEventProvider(provider?: string): boolean {
  return provider === "heartbeat" || provider === "cron-event" || provider === "exec-event";
}

/** Reused helper for resolve Effective Reply Route behavior in src/auto-reply/reply. */
export function resolveEffectiveReplyRoute(params: {
  ctx: EffectiveReplyRouteContext;
  entry?: EffectiveReplyRouteEntry;
}): EffectiveReplyRoute {
  if (!isSystemEventProvider(params.ctx.Provider)) {
    return {
      channel: params.ctx.OriginatingChannel,
      to: params.ctx.OriginatingTo,
      accountId: params.ctx.AccountId,
    };
  }
  const persistedDeliveryContext = params.entry?.deliveryContext;
  return {
    channel:
      params.ctx.OriginatingChannel ??
      persistedDeliveryContext?.channel ??
      params.entry?.lastChannel,
    to: params.ctx.OriginatingTo ?? persistedDeliveryContext?.to ?? params.entry?.lastTo,
    accountId:
      params.ctx.AccountId ?? persistedDeliveryContext?.accountId ?? params.entry?.lastAccountId,
  };
}
