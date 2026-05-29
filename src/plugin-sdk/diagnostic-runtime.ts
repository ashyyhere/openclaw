// Diagnostic flag/event helpers for plugins that want narrow runtime gating.

/** Re-exported API for src/plugin-sdk, starting with is Diagnostic Flag Enabled. */
export { isDiagnosticFlagEnabled } from "../infra/diagnostic-flags.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  DiagnosticEventMetadata,
  DiagnosticEventPayload,
  DiagnosticEventPrivateData,
  DiagnosticModelCallContent,
} from "../infra/diagnostic-events.js";
/** Re-exported API for src/plugin-sdk, starting with Diagnostic Model Content Capture Policy. */
export type { DiagnosticModelContentCapturePolicy } from "../infra/diagnostic-llm-content.js";
/** Re-exported API for src/plugin-sdk. */
export {
  emitDiagnosticEvent,
  emitTrustedDiagnosticEvent,
  emitTrustedDiagnosticEventWithPrivateData,
  hasPendingInternalDiagnosticEvent,
  isInternalDiagnosticEventMetadata,
  isDiagnosticsEnabled,
  onInternalDiagnosticEvent,
  onDiagnosticEvent,
  resetDiagnosticEventsForTest,
  waitForDiagnosticEventsDrained,
} from "../infra/diagnostic-events.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Diagnostic Model Content Capture Policy. */
export { resolveDiagnosticModelContentCapturePolicy } from "../infra/diagnostic-llm-content.js";
/** Re-exported API for src/plugin-sdk, starting with Diagnostic Trace Context. */
export type { DiagnosticTraceContext } from "../infra/diagnostic-trace-context.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createChildDiagnosticTraceContext,
  createDiagnosticTraceContext,
  createDiagnosticTraceContextFromActiveScope,
  freezeDiagnosticTraceContext,
  formatDiagnosticTraceparent,
  isValidDiagnosticSpanId,
  isValidDiagnosticTraceFlags,
  isValidDiagnosticTraceId,
  parseDiagnosticTraceparent,
} from "../infra/diagnostic-trace-context.js";
