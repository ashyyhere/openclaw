// Runtime boundary for security audit runtime behavior.
import { runSecurityAudit as runSecurityAuditImpl } from "./audit.js";

type RunSecurityAudit = typeof import("./audit.js").runSecurityAudit;

/** Reused helper for run Security Audit behavior in src/security. */
export function runSecurityAudit(
  ...args: Parameters<RunSecurityAudit>
): ReturnType<RunSecurityAudit> {
  return runSecurityAuditImpl(...args);
}
