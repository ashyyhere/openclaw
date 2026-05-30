// Runtime boundary for security audit runtime behavior.
import { runSecurityAudit as runSecurityAuditImpl } from "./audit.js";

type RunSecurityAudit = typeof import("./audit.js").runSecurityAudit;

/** Lazy runtime shim for callers that import the audit runner through the runtime boundary. */
export function runSecurityAudit(
  ...args: Parameters<RunSecurityAudit>
): ReturnType<RunSecurityAudit> {
  return runSecurityAuditImpl(...args);
}
