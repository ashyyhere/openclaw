// extensions/copilot-proxy runtime api helpers and runtime behavior.
/** Re-exported copilot-proxy plugin public API, starting with define Plugin Entry. */
export { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
/** Re-exported copilot-proxy plugin public API. */
export type {
  OpenClawPluginApi,
  ProviderAuthContext,
  ProviderAuthResult,
} from "openclaw/plugin-sdk/core";
