// Internal channel identifiers used by gateway/runtime paths that do not map to a deliverable plugin channel.
/** Canonical internal channel for webchat and non-plugin control surfaces. */
export const INTERNAL_MESSAGE_CHANNEL = "webchat" as const;
/** Type for the canonical internal message channel. */
export type InternalMessageChannel = typeof INTERNAL_MESSAGE_CHANNEL;

// Internal, non-delivery sources that may surface as a `channel` hint when an
// agent run is triggered by something other than a chat message — heartbeat
// ticks, cron jobs, or webhook receivers. They are not deliverable on their
// own, but they should still pass agent-param channel validation so internal
// callers (e.g. sessions_spawn from a heartbeat-driven parent run) are not
// rejected as "unknown channel".
/** Internal trigger channels that may appear in params but cannot receive normal chat delivery. */
export const INTERNAL_NON_DELIVERY_CHANNELS = ["heartbeat", "cron", "webhook", "voice"] as const;
/** Type union for non-deliverable internal trigger channels. */
export type InternalNonDeliveryChannel = (typeof INTERNAL_NON_DELIVERY_CHANNELS)[number];

/** Checks whether a normalized channel is an internal non-delivery trigger. */
export function isInternalNonDeliveryChannel(value: string): value is InternalNonDeliveryChannel {
  return (INTERNAL_NON_DELIVERY_CHANNELS as readonly string[]).includes(value);
}
