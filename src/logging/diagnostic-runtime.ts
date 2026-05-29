// Emits lightweight runtime diagnostics when process diagnostics are enabled.
import {
  areDiagnosticsEnabledForProcess,
  emitInternalDiagnosticEvent as emitDiagnosticEvent,
} from "../infra/diagnostic-events.js";
import { createSubsystemLogger } from "./subsystem.js";

const diag = createSubsystemLogger("diagnostic");
let lastActivityAt = 0;

/** Subsystem logger used by diagnostic runtime events. */
export const diagnosticLogger = diag;

/** Marks the diagnostic subsystem active for watchdog and stability checks. */
export function markDiagnosticActivity(): void {
  lastActivityAt = Date.now();
}

/** Returns the last diagnostic activity timestamp in milliseconds since epoch. */
export function getLastDiagnosticActivityAt(): number {
  return lastActivityAt;
}

/** Clears diagnostic activity state for isolated tests. */
export function resetDiagnosticActivityForTest(): void {
  lastActivityAt = 0;
}

/** Emits an internal event when work enters a serialized runtime lane. */
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

/** Emits an internal event when work leaves a serialized runtime lane. */
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
