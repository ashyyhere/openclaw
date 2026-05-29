// extensions/voice-call api helpers and runtime behavior.
/** Re-exported voice-call plugin public API. */
export {
  definePluginEntry,
  fetchWithSsrFGuard,
  type GatewayRequestHandlerOptions,
  isBlockedHostnameOrIp,
  isRequestBodyLimitError,
  type OpenClawPluginApi,
  readRequestBodyWithLimit,
  requestBodyErrorToText,
  type SessionEntry,
  sleep,
  TtsAutoSchema,
  TtsConfigSchema,
  TtsModeSchema,
  TtsProviderSchema,
} from "./runtime-api.js";
