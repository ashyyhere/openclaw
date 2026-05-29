// infra approval turn source helpers and runtime behavior.
import { getRuntimeConfig } from "../config/config.js";
import { resolveApprovalInitiatingSurfaceState } from "./exec-approval-surface.js";

/** Reused helper for has Approval Turn Source Route behavior in src/infra. */
export function hasApprovalTurnSourceRoute(params: {
  turnSourceChannel?: string | null;
  turnSourceAccountId?: string | null;
  approvalKind?: "exec" | "plugin";
}): boolean {
  if (!params.turnSourceChannel?.trim()) {
    return false;
  }
  return (
    resolveApprovalInitiatingSurfaceState({
      channel: params.turnSourceChannel,
      accountId: params.turnSourceAccountId,
      cfg: getRuntimeConfig(),
      approvalKind: params.approvalKind ?? "exec",
    }).kind === "enabled"
  );
}
