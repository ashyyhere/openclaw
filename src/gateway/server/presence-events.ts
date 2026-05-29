// gateway/server presence events helpers and runtime behavior.
import { listSystemPresence } from "../../infra/system-presence.js";
import type { GatewayBroadcastFn } from "../server-broadcast-types.js";

/** Reused helper for broadcast Presence Snapshot behavior in src/gateway/server. */
export function broadcastPresenceSnapshot(params: {
  broadcast: GatewayBroadcastFn;
  incrementPresenceVersion: () => number;
  getHealthVersion: () => number;
}): number {
  const presenceVersion = params.incrementPresenceVersion();
  params.broadcast(
    "presence",
    { presence: listSystemPresence() },
    {
      dropIfSlow: true,
      stateVersion: {
        presence: presenceVersion,
        health: params.getHealthVersion(),
      },
    },
  );
  return presenceVersion;
}
