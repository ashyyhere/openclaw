// Trusted diagnostic event adapter for realtime Talk events.
import {
  emitTrustedDiagnosticEvent,
  type DiagnosticEventInput,
} from "../infra/diagnostic-events.js";
import { firstFiniteTalkEventNumber, talkEventPayloadRecord } from "./event-metrics.js";
import type { TalkEvent } from "./talk-events.js";

type TalkDiagnosticEventInput = Extract<DiagnosticEventInput, { type: "talk.event" }>;

/** Converts a Talk event into the stable diagnostic-event payload shape. */
export function createTalkDiagnosticEvent(event: TalkEvent): TalkDiagnosticEventInput {
  const payload = talkEventPayloadRecord(event.payload);
  return {
    type: "talk.event",
    sessionId: event.sessionId,
    turnId: event.turnId,
    captureId: event.captureId,
    talkEventType: event.type,
    mode: event.mode,
    transport: event.transport,
    brain: event.brain,
    provider: event.provider,
    final: event.final,
    durationMs: firstFiniteTalkEventNumber(payload, ["durationMs", "latencyMs", "elapsedMs"]),
    byteLength: firstFiniteTalkEventNumber(payload, ["byteLength", "audioBytes"]),
  };
}

/** Emits a Talk diagnostic event through the trusted diagnostic channel. */
export function recordTalkDiagnosticEvent(event: TalkEvent): void {
  emitTrustedDiagnosticEvent(createTalkDiagnosticEvent(event));
}
