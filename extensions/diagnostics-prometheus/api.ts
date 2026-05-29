// extensions/diagnostics-prometheus api helpers and runtime behavior.
/** Re-exported diagnostics-prometheus plugin public API. */
export type {
  DiagnosticEventMetadata,
  DiagnosticEventPayload,
} from "openclaw/plugin-sdk/diagnostic-runtime";
/** Re-exported diagnostics-prometheus plugin public API, starting with is Internal Diagnostic Event Metadata. */
export { isInternalDiagnosticEventMetadata } from "openclaw/plugin-sdk/diagnostic-runtime";
/** Re-exported diagnostics-prometheus plugin public API. */
export {
  emptyPluginConfigSchema,
  type OpenClawPluginApi,
  type OpenClawPluginHttpRouteHandler,
  type OpenClawPluginService,
  type OpenClawPluginServiceContext,
} from "openclaw/plugin-sdk/plugin-entry";
/** Re-exported diagnostics-prometheus plugin public API, starting with redact Sensitive Text. */
export { redactSensitiveText } from "openclaw/plugin-sdk/security-runtime";
