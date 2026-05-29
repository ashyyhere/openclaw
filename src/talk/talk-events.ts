// talk talk events helpers and runtime behavior.
/** Reused constant for TALK EVENT TYPES behavior in src/talk. */
export const TALK_EVENT_TYPES = [
  "session.started",
  "session.ready",
  "session.closed",
  "session.error",
  "session.replaced",
  "turn.started",
  "turn.ended",
  "turn.cancelled",
  "capture.started",
  "capture.stopped",
  "capture.cancelled",
  "capture.once",
  "input.audio.delta",
  "input.audio.committed",
  "transcript.delta",
  "transcript.done",
  "output.text.delta",
  "output.text.done",
  "output.audio.started",
  "output.audio.delta",
  "output.audio.done",
  "tool.call",
  "tool.progress",
  "tool.result",
  "tool.error",
  "usage.metrics",
  "latency.metrics",
  "health.changed",
] as const;

/** Shared type for Talk Event Type in src/talk. */
export type TalkEventType = (typeof TALK_EVENT_TYPES)[number];

/** Shared type for Talk Mode in src/talk. */
export type TalkMode = "realtime" | "stt-tts" | "transcription";

/** Shared type for Talk Transport in src/talk. */
export type TalkTransport = "webrtc" | "provider-websocket" | "gateway-relay" | "managed-room";

/** Shared type for Talk Brain in src/talk. */
export type TalkBrain = "agent-consult" | "direct-tools" | "none";

/** Shared type for Talk Event Context in src/talk. */
export type TalkEventContext = {
  sessionId: string;
  mode: TalkMode;
  transport: TalkTransport;
  brain: TalkBrain;
  provider?: string;
};

/** Shared type for Talk Event in src/talk. */
export type TalkEvent<TPayload = unknown> = TalkEventContext & {
  id: string;
  type: TalkEventType;
  turnId?: string;
  captureId?: string;
  seq: number;
  timestamp: string;
  final?: boolean;
  callId?: string;
  itemId?: string;
  parentId?: string;
  payload: TPayload;
};

/** Shared type for Talk Event Input in src/talk. */
export type TalkEventInput<TPayload = unknown> = {
  type: TalkEventType;
  payload: TPayload;
  turnId?: string;
  captureId?: string;
  timestamp?: string;
  final?: boolean;
  callId?: string;
  itemId?: string;
  parentId?: string;
};

/** Shared type for Talk Event Sequencer in src/talk. */
export type TalkEventSequencer = {
  next<TPayload>(input: TalkEventInput<TPayload>): TalkEvent<TPayload>;
};

const TURN_SCOPED_TALK_EVENT_TYPES = new Set<TalkEventType>([
  "turn.started",
  "turn.ended",
  "turn.cancelled",
  "input.audio.delta",
  "input.audio.committed",
  "transcript.delta",
  "transcript.done",
  "output.text.delta",
  "output.text.done",
  "output.audio.started",
  "output.audio.delta",
  "output.audio.done",
  "tool.call",
  "tool.progress",
  "tool.result",
  "tool.error",
]);

const CAPTURE_SCOPED_TALK_EVENT_TYPES = new Set<TalkEventType>([
  "capture.started",
  "capture.stopped",
  "capture.cancelled",
  "capture.once",
]);

function assertTalkEventCorrelation(input: TalkEventInput): void {
  if (TURN_SCOPED_TALK_EVENT_TYPES.has(input.type) && !input.turnId?.trim()) {
    throw new Error(`Talk event ${input.type} requires turnId`);
  }
  if (CAPTURE_SCOPED_TALK_EVENT_TYPES.has(input.type) && !input.captureId?.trim()) {
    throw new Error(`Talk event ${input.type} requires captureId`);
  }
}

/** Reused helper for create Talk Event Sequencer behavior in src/talk. */
export function createTalkEventSequencer(
  context: TalkEventContext,
  options: { now?: () => Date | string } = {},
): TalkEventSequencer {
  let seq = 0;
  const now = options.now ?? (() => new Date());
  return {
    next<TPayload>(input: TalkEventInput<TPayload>): TalkEvent<TPayload> {
      assertTalkEventCorrelation(input);
      seq += 1;
      const timestamp =
        input.timestamp ??
        (() => {
          const value = now();
          return typeof value === "string" ? value : value.toISOString();
        })();
      return {
        ...context,
        id: `${context.sessionId}:${seq}`,
        type: input.type,
        turnId: input.turnId,
        captureId: input.captureId,
        seq,
        timestamp,
        final: input.final,
        callId: input.callId,
        itemId: input.itemId,
        parentId: input.parentId,
        payload: input.payload,
      };
    },
  };
}
