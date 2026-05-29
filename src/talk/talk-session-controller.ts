// talk talk session controller helpers and runtime behavior.
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

/** Shared type for Talk Turn Failure Reason in src/talk. */
export type TalkTurnFailureReason = "no_active_turn" | "stale_turn";

/** Shared type for Talk Turn Success in src/talk. */
export type TalkTurnSuccess = {
  event: TalkEvent;
  ok: true;
  turnId: string;
};

/** Shared type for Talk Turn Failure in src/talk. */
export type TalkTurnFailure = {
  ok: false;
  reason: TalkTurnFailureReason;
};

/** Shared type for Talk Turn Result in src/talk. */
export type TalkTurnResult = TalkTurnSuccess | TalkTurnFailure;

/** Shared type for Talk Ensure Turn Result in src/talk. */
export type TalkEnsureTurnResult = {
  event?: TalkEvent;
  turnId: string;
};

/** Shared type for Talk Session Controller in src/talk. */
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

/** Shared type for Talk Session Controller Params in src/talk. */
export type TalkSessionControllerParams = TalkEventContext & {
  maxRecentEvents?: number;
  turnIdPrefix?: string;
};

/** Shared type for Talk Session Controller Options in src/talk. */
export type TalkSessionControllerOptions = {
  now?: () => Date | string;
  onEvent?: (event: TalkEvent) => void;
  sequencer?: TalkEventSequencer;
};

/** Reused helper for create Talk Session Controller behavior in src/talk. */
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

/** Reused helper for normalize Talk Transport behavior in src/talk. */
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

/** Re-exported API for src/talk, starting with Talk Brain. */
export type { TalkBrain, TalkEvent, TalkEventContext, TalkEventInput, TalkMode, TalkTransport };
