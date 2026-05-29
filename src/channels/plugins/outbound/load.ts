/** Loads outbound adapters from the active channel plugin registry. */
import type { ChannelId } from "../channel-id.types.js";
import type { ChannelOutboundAdapter } from "../outbound.types.js";
import { createChannelRegistryLoader } from "../registry-loader.js";
import type { LoadChannelOutboundAdapter } from "./load.types.js";

// Channel docking: outbound sends should stay cheap to import.
//
// The full channel plugins (src/channels/plugins/*.ts) pull in status,
// setup, gateway monitors, etc. Outbound delivery only needs chunking +
// send primitives, so we keep a dedicated, lightweight loader here.
const loadOutboundAdapterFromRegistry = createChannelRegistryLoader<ChannelOutboundAdapter>(
  (entry) => entry.plugin.outbound,
);

/** Reused helper for load Channel Outbound Adapter behavior in src/channels/plugins. */
export async function loadChannelOutboundAdapter(
  id: ChannelId,
): Promise<ChannelOutboundAdapter | undefined> {
  return loadOutboundAdapterFromRegistry(id);
}

/** Re-exported API for src/channels/plugins, starting with Load Channel Outbound Adapter. */
export type { LoadChannelOutboundAdapter };
