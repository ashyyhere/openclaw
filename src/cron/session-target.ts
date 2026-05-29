// cron session target helpers and runtime behavior.
const INVALID_CRON_SESSION_TARGET_ID_ERROR = "invalid cron sessionTarget session id";

/** Reused helper for is Invalid Cron Session Target Id Error behavior in src/cron. */
export function isInvalidCronSessionTargetIdError(error: unknown): boolean {
  return error instanceof Error && error.message === INVALID_CRON_SESSION_TARGET_ID_ERROR;
}

/** Reused helper for assert Safe Cron Session Target Id behavior in src/cron. */
export function assertSafeCronSessionTargetId(sessionId: string): string {
  const trimmed = sessionId.trim();
  if (!trimmed) {
    throw new Error(INVALID_CRON_SESSION_TARGET_ID_ERROR);
  }
  if (trimmed.includes("\0")) {
    throw new Error(INVALID_CRON_SESSION_TARGET_ID_ERROR);
  }
  return trimmed;
}

/** Reused helper for resolve Cron Session Target Session Key behavior in src/cron. */
export function resolveCronSessionTargetSessionKey(
  sessionTarget?: string | null,
): string | undefined {
  if (typeof sessionTarget !== "string" || !sessionTarget.startsWith("session:")) {
    return undefined;
  }
  return assertSafeCronSessionTargetId(sessionTarget.slice(8));
}

/** Reused helper for resolve Cron Current Session Target behavior in src/cron. */
export function resolveCronCurrentSessionTarget(params: {
  sessionTarget?: string | null;
  sessionKey?: string | null;
}): string | undefined {
  if (params.sessionTarget !== "current") {
    return params.sessionTarget ?? undefined;
  }
  const sessionKey = params.sessionKey?.trim();
  return sessionKey ? `session:${assertSafeCronSessionTargetId(sessionKey)}` : "isolated";
}

/** Reused helper for resolve Cron Delivery Session Key behavior in src/cron. */
export function resolveCronDeliverySessionKey(job: {
  sessionTarget?: string | null;
  sessionKey?: string | null;
}): string | undefined {
  const sessionTargetKey = resolveCronSessionTargetSessionKey(job.sessionTarget);
  if (sessionTargetKey) {
    return sessionTargetKey;
  }
  return typeof job.sessionKey === "string" && job.sessionKey.trim()
    ? job.sessionKey.trim()
    : undefined;
}

/** Reused helper for resolve Cron Notification Session Key behavior in src/cron. */
export function resolveCronNotificationSessionKey(params: {
  jobId: string;
  sessionKey?: string | null;
}): string {
  return typeof params.sessionKey === "string" && params.sessionKey.trim()
    ? params.sessionKey.trim()
    : `cron:${params.jobId}:failure`;
}

/** Reused helper for resolve Cron Failure Notification Session Key behavior in src/cron. */
export function resolveCronFailureNotificationSessionKey(job: {
  id: string;
  sessionTarget?: string | null;
  sessionKey?: string | null;
}): string {
  return resolveCronNotificationSessionKey({
    jobId: job.id,
    sessionKey: resolveCronDeliverySessionKey(job),
  });
}
