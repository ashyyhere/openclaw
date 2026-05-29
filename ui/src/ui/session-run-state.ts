// Session run-state helper shared by activity/chat UI indicators.
import type { SessionRunStatus } from "./types.ts";

type SessionRunState = {
  hasActiveRun?: boolean;
  status?: SessionRunStatus;
};

/** Return true when session metadata indicates an active run. */
export function isSessionRunActive(state: SessionRunState): boolean {
  if (state.status && state.status !== "running") {
    return false;
  }
  if (typeof state.hasActiveRun === "boolean") {
    return state.hasActiveRun;
  }
  return state.status === "running";
}
