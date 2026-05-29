// Fanout point for Talk observability sinks.
import { recordTalkDiagnosticEvent } from "./diagnostics.js";
import { recordTalkLogEvent } from "./logging.js";
import type { TalkEvent } from "./talk-events.js";

/** Sends one Talk event to both diagnostics and structured logs. */
export function recordTalkObservabilityEvent(event: TalkEvent): void {
  recordTalkDiagnosticEvent(event);
  recordTalkLogEvent(event);
}
