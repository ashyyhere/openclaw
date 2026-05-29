// Private runtime barrel for the bundled Nostr extension.
// Keep this barrel thin and aligned with the local extension surface.

/** Re-exported nostr plugin public API, starting with Open Claw Config. */
export type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
/** Re-exported nostr plugin public API, starting with get Plugin Runtime Gateway Request Scope. */
export { getPluginRuntimeGatewayRequestScope } from "openclaw/plugin-sdk/plugin-runtime";
/** Re-exported nostr plugin public API, starting with Plugin Runtime. */
export type { PluginRuntime } from "openclaw/plugin-sdk/runtime-store";
