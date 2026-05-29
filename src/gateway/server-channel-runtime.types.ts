// Shared types for gateway server channel runtime types behavior.
import type { ChannelId, ChannelAccountSnapshot } from "../channels/plugins/types.public.js";

/** Shared type for Channel Runtime Snapshot in src/gateway. */
export type ChannelRuntimeSnapshot = {
  channels: Partial<Record<ChannelId, ChannelAccountSnapshot>>;
  channelAccounts: Partial<Record<ChannelId, Record<string, ChannelAccountSnapshot>>>;
};
