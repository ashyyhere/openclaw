// gateway node invoke system run approval errors helpers and runtime behavior.
type SystemRunApprovalGuardError = {
  ok: false;
  message: string;
  details: Record<string, unknown>;
};

/** Reused helper for system Run Approval Guard Error behavior in src/gateway. */
export function systemRunApprovalGuardError(params: {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}): SystemRunApprovalGuardError {
  const details = params.details ? { ...params.details } : {};
  return {
    ok: false,
    message: params.message,
    details: {
      code: params.code,
      ...details,
    },
  };
}

/** Reused helper for system Run Approval Required behavior in src/gateway. */
export function systemRunApprovalRequired(runId: string): SystemRunApprovalGuardError {
  return systemRunApprovalGuardError({
    code: "APPROVAL_REQUIRED",
    message: "approval required",
    details: { runId },
  });
}
