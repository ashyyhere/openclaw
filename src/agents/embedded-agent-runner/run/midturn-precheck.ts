/** Signal type used to stop a turn before mid-turn context overflow. */
import type { PreemptiveCompactionRoute } from "./preemptive-compaction.types.js";

/** Shared type for Mid Turn Precheck Request in src/agents/embedded-agent-runner. */
export type MidTurnPrecheckRequest = {
  route: Exclude<PreemptiveCompactionRoute, "fits">;
  estimatedPromptTokens: number;
  promptBudgetBeforeReserve: number;
  overflowTokens: number;
  toolResultReducibleChars: number;
  effectiveReserveTokens: number;
};

/** Reused constant for MID TURN PRECHECK ERROR MESSAGE behavior in src/agents/embedded-agent-runner. */
export const MID_TURN_PRECHECK_ERROR_MESSAGE =
  "Context overflow: prompt too large for the model (mid-turn precheck).";

/** Reused class for Mid Turn Precheck Signal behavior in src/agents/embedded-agent-runner. */
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
