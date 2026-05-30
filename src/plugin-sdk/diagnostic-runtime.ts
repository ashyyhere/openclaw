// Diagnostic flag/event helpers for plugins that want narrow runtime gating.

/** Diagnostic feature-flag lookup for plugins that gate extra telemetry. */
export { isDiagnosticFlagEnabled } from "../infra/diagnostic-flags.js";
/** Diagnostic event payload types visible to SDK consumers. */
export type {
  DiagnosticEventMetadata,
  DiagnosticEventPayload,
  DiagnosticEventPrivateData,
  DiagnosticModelCallContent,
} from "../infra/diagnostic-events.js";
/** Policy type describing whether diagnostic events may include model content. */
export type { DiagnosticModelContentCapturePolicy } from "../infra/diagnostic-llm-content.js";
/** Diagnostic event emitters and test drains exposed through the SDK runtime barrel. */
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
/** Resolve model-content capture policy from config/env for diagnostics. */
export { resolveDiagnosticModelContentCapturePolicy } from "../infra/diagnostic-llm-content.js";
/** Trace context propagated across plugin and runtime diagnostic events. */
export type { DiagnosticTraceContext } from "../infra/diagnostic-trace-context.js";
/** Trace context creation, validation, and traceparent parsing helpers. */
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
