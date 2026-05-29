// Message capability helpers for channel plugin declarations.
/** Reused constant for CHANNEL MESSAGE CAPABILITIES behavior in src/channels/plugins. */
export const CHANNEL_MESSAGE_CAPABILITIES = ["presentation", "delivery-pin"] as const;

/** Shared type for Channel Message Capability in src/channels/plugins. */
export type ChannelMessageCapability = (typeof CHANNEL_MESSAGE_CAPABILITIES)[number];
