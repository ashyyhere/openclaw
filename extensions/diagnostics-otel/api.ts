// extensions/diagnostics-otel api helpers and runtime behavior.
/** Re-exported diagnostics-otel plugin public API. */
export {
  createChildDiagnosticTraceContext,
  createDiagnosticTraceContext,
  emitDiagnosticEvent,
  formatDiagnosticTraceparent,
  isValidDiagnosticSpanId,
  isValidDiagnosticTraceFlags,
  isValidDiagnosticTraceId,
  onDiagnosticEvent,
  parseDiagnosticTraceparent,
  type DiagnosticEventMetadata,
  type DiagnosticEventPayload,
  type DiagnosticTraceContext,
} from "openclaw/plugin-sdk/diagnostic-runtime";
/** Re-exported diagnostics-otel plugin public API, starting with empty Plugin Config Schema. */
export { emptyPluginConfigSchema, type OpenClawPluginApi } from "openclaw/plugin-sdk/plugin-entry";
/** Re-exported diagnostics-otel plugin public API. */
export type {
  OpenClawPluginService,
  OpenClawPluginServiceContext,
} from "openclaw/plugin-sdk/plugin-entry";
/** Re-exported diagnostics-otel plugin public API, starting with redact Sensitive Text. */
export { redactSensitiveText } from "openclaw/plugin-sdk/security-runtime";
