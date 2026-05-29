// talk observability helpers and runtime behavior.
import { recordTalkDiagnosticEvent } from "./diagnostics.js";
import { recordTalkLogEvent } from "./logging.js";
import type { TalkEvent } from "./talk-events.js";

/** Reused helper for record Talk Observability Event behavior in src/talk. */
export function recordTalkObservabilityEvent(event: TalkEvent): void {
  recordTalkDiagnosticEvent(event);
  recordTalkLogEvent(event);
}
