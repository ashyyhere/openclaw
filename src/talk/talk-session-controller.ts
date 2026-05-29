// Talk session state machine for turns, output audio, and recent event history.
import { normalizeOptionalString } from "../shared/string-coerce.js";
import {
  createTalkEventSequencer,
  type TalkBrain,
  type TalkEvent,
  type TalkEventContext,
  type TalkEventInput,
  type TalkEventSequencer,
  type TalkMode,
  type TalkTransport,
} from "./talk-events.js";

/** Reason a turn-scoped operation could not be applied. */
export type TalkTurnFailureReason = "no_active_turn" | "stale_turn";

/** Successful turn operation with the emitted final event. */
export type TalkTurnSuccess = {
  event: TalkEvent;
  ok: true;
  turnId: string;
};

/** Failed turn operation that did not emit an event. */
export type TalkTurnFailure = {
  ok: false;
  reason: TalkTurnFailureReason;
};

/** Result returned by operations that end or cancel a turn. */
export type TalkTurnResult = TalkTurnSuccess | TalkTurnFailure;

/** Active or newly-created turn id, optionally with the start event. */
export type TalkEnsureTurnResult = {
  event?: TalkEvent;
  turnId: string;
};

/** Mutable session controller used by transports to emit correlated Talk events. */
export type TalkSessionController = {
  readonly activeTurnId: string | undefined;
  readonly context: TalkEventContext;
  readonly outputAudioActive: boolean;
  readonly recentEvents: readonly TalkEvent[];
  clearActiveTurn(): void;
  emit<TPayload>(input: TalkEventInput<TPayload>): TalkEvent<TPayload>;
  ensureTurn(params?: { payload?: unknown; turnId?: string }): TalkEnsureTurnResult;
  startTurn(params?: { payload?: unknown; turnId?: string }): TalkEnsureTurnResult;
  endTurn(params?: { payload?: unknown; turnId?: string }): TalkTurnResult;
  cancelTurn(params?: { payload?: unknown; turnId?: string }): TalkTurnResult;
  finishOutputAudio(params?: { payload?: unknown; turnId?: string }): TalkEvent | undefined;
  startOutputAudio(params?: { payload?: unknown; turnId?: string }): TalkEnsureTurnResult;
};

/** Session context and bounded history options for creating a controller. */
export type TalkSessionControllerParams = TalkEventContext & {
  maxRecentEvents?: number;
  turnIdPrefix?: string;
};

/** Controller hooks for deterministic clocks, event sinks, and custom sequencers. */
export type TalkSessionControllerOptions = {
  now?: () => Date | string;
  onEvent?: (event: TalkEvent) => void;
  sequencer?: TalkEventSequencer;
};

/** Creates a Talk session controller that owns active-turn and output-audio state. */
export function createTalkSessionController(
  params: TalkSessionControllerParams,
  options: TalkSessionControllerOptions = {},
): TalkSessionController {
  const { maxRecentEvents = 20, turnIdPrefix = "turn", ...context } = params;
  const sequencer = options.sequencer ?? createTalkEventSequencer(context, { now: options.now });
  const recentEvents: TalkEvent[] = [];
  let activeTurnId: string | undefined;
  let outputAudioActive = false;
  let turnSeq = 0;

  const remember = <TPayload>(event: TalkEvent<TPayload>): TalkEvent<TPayload> => {
    recentEvents.push(event as TalkEvent);
    if (recentEvents.length > maxRecentEvents) {
      recentEvents.splice(0, recentEvents.length - maxRecentEvents);
    }
    try {
      options.onEvent?.(event as TalkEvent);
    } catch {
      // Diagnostics hooks must not break Talk delivery.
    }
    return event;
  };

  const emit = <TPayload>(input: TalkEventInput<TPayload>): TalkEvent<TPayload> => {
    return remember(sequencer.next(input));
  };

  const resolveActiveTurn = (requestedTurnId: string | undefined): string | TalkTurnFailure => {
    if (!activeTurnId) {
      return { ok: false, reason: "no_active_turn" };
    }
    const normalizedRequested = normalizeOptionalString(requestedTurnId);
    if (normalizedRequested && normalizedRequested !== activeTurnId) {
      return { ok: false, reason: "stale_turn" };
    }
    return activeTurnId;
  };

  const ensureTurn = (ensureParams: { payload?: unknown; turnId?: string } = {}) => {
    if (activeTurnId) {
      return { turnId: activeTurnId };
    }
    return startTurn(ensureParams);
  };

  const startTurn = (startParams: { payload?: unknown; turnId?: string } = {}) => {
    const turnId = normalizeOptionalString(startParams.turnId) ?? `${turnIdPrefix}-${++turnSeq}`;
    outputAudioActive = false;
    activeTurnId = turnId;
    return {
      turnId,
      event: emit({
        type: "turn.started",
        turnId,
        payload: startParams.payload ?? {},
      }),
    };
  };

  const finishTurn = (
    type: "turn.ended" | "turn.cancelled",
    paramsForTurn: { payload?: unknown; turnId?: string } = {},
  ): TalkTurnResult => {
    const turnId = resolveActiveTurn(paramsForTurn.turnId);
    if (typeof turnId !== "string") {
      return turnId;
    }
    outputAudioActive = false;
    activeTurnId = undefined;
    return {
      ok: true,
      turnId,
      event: emit({
        type,
        turnId,
        payload: paramsForTurn.payload ?? {},
        final: true,
      }),
    };
  };

  return {
    get activeTurnId() {
      return activeTurnId;
    },
    context,
    get outputAudioActive() {
      return outputAudioActive;
    },
    get recentEvents() {
      return recentEvents;
    },
    clearActiveTurn() {
      activeTurnId = undefined;
      outputAudioActive = false;
    },
    emit,
    ensureTurn,
    startTurn,
    endTurn(paramsForTurn) {
      return finishTurn("turn.ended", paramsForTurn);
    },
    cancelTurn(paramsForTurn) {
      return finishTurn("turn.cancelled", paramsForTurn);
    },
    finishOutputAudio(paramsForOutput = {}) {
      if (!outputAudioActive) {
        return undefined;
      }
      const turnId = resolveActiveTurn(paramsForOutput.turnId);
      if (typeof turnId !== "string") {
        return undefined;
      }
      outputAudioActive = false;
      return emit({
        type: "output.audio.done",
        turnId,
        payload: paramsForOutput.payload ?? {},
        final: true,
      });
    },
    startOutputAudio(paramsForOutput = {}) {
      const turn = ensureTurn({ turnId: paramsForOutput.turnId, payload: {} });
      if (outputAudioActive) {
        return { turnId: turn.turnId };
      }
      outputAudioActive = true;
      return {
        turnId: turn.turnId,
        event: emit({
          type: "output.audio.started",
          turnId: turn.turnId,
          payload: paramsForOutput.payload ?? {},
        }),
      };
    },
  };
}

/** Normalizes legacy transport labels to the public Talk transport ids. */
export function normalizeTalkTransport(value: string | undefined): string | undefined {
  const normalized = normalizeOptionalString(value);
  if (!normalized) {
    return undefined;
  }
  if (normalized === "webrtc-sdp") {
    return "webrtc";
  }
  if (normalized === "json-pcm-websocket") {
    return "provider-websocket";
  }
  return normalized;
}

/** Public Talk event and transport types used by provider integrations. */
export type { TalkBrain, TalkEvent, TalkEventContext, TalkEventInput, TalkMode, TalkTransport };
