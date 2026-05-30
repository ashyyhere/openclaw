/** Signal type used to stop a turn before mid-turn context overflow. */
import type { PreemptiveCompactionRoute } from "./preemptive-compaction.types.js";

/** Snapshot of the prompt-budget overflow detected before a mid-turn model call. */
export type MidTurnPrecheckRequest = {
  route: Exclude<PreemptiveCompactionRoute, "fits">;
  estimatedPromptTokens: number;
  promptBudgetBeforeReserve: number;
  overflowTokens: number;
  toolResultReducibleChars: number;
  effectiveReserveTokens: number;
};

/** Stable error message for mid-turn context overflow signals. */
export const MID_TURN_PRECHECK_ERROR_MESSAGE =
  "Context overflow: prompt too large for the model (mid-turn precheck).";

/** Error-like control signal carrying the mid-turn overflow route request. */
export class MidTurnPrecheckSignal extends Error {
  readonly request: MidTurnPrecheckRequest;

  constructor(request: MidTurnPrecheckRequest) {
    super(MID_TURN_PRECHECK_ERROR_MESSAGE);
    this.name = "MidTurnPrecheckSignal";
    this.request = request;
  }
}

/** Narrows thrown errors to mid-turn precheck overflow signals. */
export function isMidTurnPrecheckSignal(error: unknown): error is MidTurnPrecheckSignal {
  return error instanceof MidTurnPrecheckSignal;
}
