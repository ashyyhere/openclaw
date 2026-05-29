// logging diagnostic runtime helpers and runtime behavior.
import {
  areDiagnosticsEnabledForProcess,
  emitInternalDiagnosticEvent as emitDiagnosticEvent,
} from "../infra/diagnostic-events.js";
import { createSubsystemLogger } from "./subsystem.js";

const diag = createSubsystemLogger("diagnostic");
let lastActivityAt = 0;

/** Reused constant for diagnostic Logger behavior in src/logging. */
export const diagnosticLogger = diag;

/** Reused helper for mark Diagnostic Activity behavior in src/logging. */
export function markDiagnosticActivity(): void {
  lastActivityAt = Date.now();
}

/** Reused helper for get Last Diagnostic Activity At behavior in src/logging. */
export function getLastDiagnosticActivityAt(): number {
  return lastActivityAt;
}

/** Reused helper for reset Diagnostic Activity For Test behavior in src/logging. */
export function resetDiagnosticActivityForTest(): void {
  lastActivityAt = 0;
}

/** Reused helper for log Lane Enqueue behavior in src/logging. */
export function logLaneEnqueue(lane: string, queueSize: number): void {
  if (!areDiagnosticsEnabledForProcess()) {
    return;
  }
  diag.debug(`lane enqueue: lane=${lane} queueSize=${queueSize}`);
  emitDiagnosticEvent({
    type: "queue.lane.enqueue",
    lane,
    queueSize,
  });
  markDiagnosticActivity();
}

/** Reused helper for log Lane Dequeue behavior in src/logging. */
export function logLaneDequeue(lane: string, waitMs: number, queueSize: number): void {
  if (!areDiagnosticsEnabledForProcess()) {
    return;
  }
  diag.debug(`lane dequeue: lane=${lane} waitMs=${waitMs} queueSize=${queueSize}`);
  emitDiagnosticEvent({
    type: "queue.lane.dequeue",
    lane,
    queueSize,
    waitMs,
  });
  markDiagnosticActivity();
}
