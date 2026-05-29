// ui/src/ui session run state helpers and runtime behavior.
import type { SessionRunStatus } from "./types.ts";

type SessionRunState = {
  hasActiveRun?: boolean;
  status?: SessionRunStatus;
};

/** Reused helper for is Session Run Active behavior in ui/src/ui. */
export function isSessionRunActive(state: SessionRunState): boolean {
  if (state.status && state.status !== "running") {
    return false;
  }
  if (typeof state.hasActiveRun === "boolean") {
    return state.hasActiveRun;
  }
  return state.status === "running";
}
