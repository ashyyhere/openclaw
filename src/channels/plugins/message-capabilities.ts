// Message capability helpers for channel plugin declarations.
/** Message capability ids channel plugins can advertise in their manifests. */
export const CHANNEL_MESSAGE_CAPABILITIES = ["presentation", "delivery-pin"] as const;

/** Supported channel message capability id. */
export type ChannelMessageCapability = (typeof CHANNEL_MESSAGE_CAPABILITIES)[number];
