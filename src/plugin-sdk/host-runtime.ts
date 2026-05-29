// Hostname and SCP host normalization helpers for plugin runtime callers.

/** Re-exported API for src/plugin-sdk, starting with normalize Hostname. */
export { normalizeHostname } from "../infra/net/hostname.ts";
/** Re-exported API for src/plugin-sdk, starting with normalize Scp Remote Host. */
export { normalizeScpRemoteHost } from "../infra/scp-host.ts";
