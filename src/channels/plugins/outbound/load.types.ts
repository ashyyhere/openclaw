/** Function type for resolving channel outbound adapters by id. */
import type { ChannelId } from "../channel-id.types.js";
import type { ChannelOutboundAdapter } from "../outbound.types.js";

/** Shared type for Load Channel Outbound Adapter in src/channels/plugins. */
export type LoadChannelOutboundAdapter = (
  id: ChannelId,
) => Promise<ChannelOutboundAdapter | undefined>;
