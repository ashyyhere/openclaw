// Protocol version gates shared by gateway clients, probes, and servers.
/** Current gateway protocol version emitted by this package. */
export const PROTOCOL_VERSION = 4 as const;
/** Oldest client protocol version accepted by the gateway. */
export const MIN_CLIENT_PROTOCOL_VERSION = 4 as const;
/** Oldest probe protocol version accepted by health/check tooling. */
export const MIN_PROBE_PROTOCOL_VERSION = 4 as const;
