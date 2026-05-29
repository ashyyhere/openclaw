// Private runtime barrel for the bundled Voice Call extension.
// Keep this barrel thin and aligned with the local extension surface.

/** Re-exported voice-call plugin public API, starting with define Plugin Entry. */
export { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
/** Re-exported voice-call plugin public API, starting with Open Claw Plugin Api. */
export type { OpenClawPluginApi } from "openclaw/plugin-sdk/plugin-entry";
/** Re-exported voice-call plugin public API, starting with Gateway Request Handler Options. */
export type { GatewayRequestHandlerOptions } from "openclaw/plugin-sdk/gateway-runtime";
/** Re-exported voice-call plugin public API. */
export {
  isRequestBodyLimitError,
  readRequestBodyWithLimit,
  requestBodyErrorToText,
} from "openclaw/plugin-sdk/webhook-request-guards";
/** Re-exported voice-call plugin public API, starting with fetch With Ssr FGuard. */
export { fetchWithSsrFGuard, isBlockedHostnameOrIp } from "openclaw/plugin-sdk/ssrf-runtime";
/** Re-exported voice-call plugin public API, starting with Session Entry. */
export type { SessionEntry } from "openclaw/plugin-sdk/session-store-runtime";
/** Re-exported voice-call plugin public API. */
export {
  TtsAutoSchema,
  TtsConfigSchema,
  TtsModeSchema,
  TtsProviderSchema,
} from "openclaw/plugin-sdk/tts-runtime";
/** Re-exported voice-call plugin public API, starting with sleep. */
export { sleep } from "openclaw/plugin-sdk/runtime-env";
