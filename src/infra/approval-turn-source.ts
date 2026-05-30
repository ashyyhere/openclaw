// Checks whether an approval can route back to the initiating turn source.
import { getRuntimeConfig } from "../config/config.js";
import { resolveApprovalInitiatingSurfaceState } from "./exec-approval-surface.js";

/** Returns whether the initiating channel/account can receive approval UI. */
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
