// Test helper for subscribing to internal diagnostic log.record events.
import {
  onInternalDiagnosticEvent,
  type DiagnosticEventPayload,
} from "../../infra/diagnostic-events.js";

/** Captured diagnostic log event emitted by the logging transport. */
export type CapturedDiagnosticLogRecord = Extract<DiagnosticEventPayload, { type: "log.record" }>;

/** Waits a few ticks so async diagnostic log transports can flush. */
export async function flushDiagnosticLogRecords(): Promise<void> {
  for (let index = 0; index < 3; index += 1) {
    await new Promise<void>((resolve) => setImmediate(resolve));
  }
}

/** Subscribes to diagnostic log records and returns mutable capture state. */
export function createDiagnosticLogRecordCapture() {
  const records: CapturedDiagnosticLogRecord[] = [];
  const unsubscribe = onInternalDiagnosticEvent((event) => {
    if (event.type === "log.record") {
      records.push(event);
    }
  });

  return {
    records,
    flush: flushDiagnosticLogRecords,
    cleanup: unsubscribe,
  };
}
