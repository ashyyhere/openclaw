// gateway channel status patches helpers and runtime behavior.
/** Shared type for Connected Channel Status Patch in src/gateway. */
export type ConnectedChannelStatusPatch = {
  connected: true;
  lastConnectedAt: number;
  lastEventAt: number;
};

/** Shared type for Transport Activity Channel Status Patch in src/gateway. */
export type TransportActivityChannelStatusPatch = {
  lastTransportActivityAt: number;
};

/** Reused helper for create Connected Channel Status Patch behavior in src/gateway. */
export function createConnectedChannelStatusPatch(
  at: number = Date.now(),
): ConnectedChannelStatusPatch {
  return {
    connected: true,
    lastConnectedAt: at,
    lastEventAt: at,
  };
}

/** Reused helper for create Transport Activity Status Patch behavior in src/gateway. */
export function createTransportActivityStatusPatch(
  at: number = Date.now(),
): TransportActivityChannelStatusPatch {
  return {
    lastTransportActivityAt: at,
  };
}
