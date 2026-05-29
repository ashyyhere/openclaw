// shared agent liveness helpers and runtime behavior.
/** Reused helper for is Blocked Liveness State behavior in src/shared. */
export function isBlockedLivenessState(livenessState: unknown): boolean {
  return typeof livenessState === "string" && livenessState.trim().toLowerCase() === "blocked";
}

/** Reused helper for format Blocked Liveness Error behavior in src/shared. */
export function formatBlockedLivenessError(error: unknown): string {
  const message = typeof error === "string" ? error.trim() : "";
  return message || "Agent run blocked before producing a usable result.";
}

/** Reused helper for normalize Blocked Liveness Wait Status behavior in src/shared. */
export function normalizeBlockedLivenessWaitStatus<
  TStatus extends "ok" | "error" | "timeout" | "pending",
>(params: {
  status: TStatus;
  livenessState?: unknown;
  error?: unknown;
}): { status: TStatus | "error"; error?: string } {
  const error = typeof params.error === "string" ? params.error : undefined;
  if (!isBlockedLivenessState(params.livenessState)) {
    return { status: params.status, error };
  }
  return {
    status: "error",
    error: formatBlockedLivenessError(error),
  };
}
