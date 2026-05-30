// Shared health-check contracts for doctor, lint, and fix flows.
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { RuntimeEnv } from "../runtime.js";

/** Severity levels emitted by health checks. */
export type HealthFindingSeverity = "info" | "warning" | "error";

/** Numeric ordering for comparing health finding severities. */
export const HEALTH_FINDING_SEVERITY_RANK: Record<HealthFindingSeverity, number> = {
  info: 0,
  warning: 1,
  error: 2,
};

/** Parse a CLI/config severity string into a health finding severity. */
export function parseHealthFindingSeverity(
  input: string | undefined,
): HealthFindingSeverity | null {
  if (input === "info" || input === "warning" || input === "error") {
    return input;
  }
  return null;
}

/** Return whether a finding is at least the requested minimum severity. */
export function healthFindingMeetsSeverity(
  finding: Pick<HealthFinding, "severity">,
  severityMin: HealthFindingSeverity,
): boolean {
  return (
    HEALTH_FINDING_SEVERITY_RANK[finding.severity] >= HEALTH_FINDING_SEVERITY_RANK[severityMin]
  );
}

/** Structured diagnostic emitted by a health check. */
export interface HealthFinding {
  readonly checkId: string;
  readonly severity: HealthFindingSeverity;
  readonly message: string;
  readonly source?: string;
  readonly path?: string;
  readonly line?: number;
  readonly column?: number;
  readonly ocPath?: string;
  readonly target?: string;
  readonly requirement?: string;
  readonly fixHint?: string;
}

/** Mode in which a health check is running. */
export type HealthCheckMode = "doctor" | "lint" | "fix";

/** Shared runtime/config context passed to health-check detectors. */
export interface HealthCheckContext {
  readonly mode: HealthCheckMode;
  readonly runtime: RuntimeEnv;
  readonly cfg: OpenClawConfig;
  readonly cwd?: string;
  readonly configPath?: string;
  readonly allowExecSecretRefs?: boolean;
}

/** Context passed to health-check repair functions. */
export interface HealthRepairContext extends Omit<HealthCheckContext, "mode"> {
  readonly mode: "fix";
  readonly dryRun?: boolean;
  readonly diff?: boolean;
}

/** Diff produced by a health-check repair. */
export interface HealthRepairDiff {
  readonly kind: "config" | "file";
  readonly path: string;
  readonly before?: string;
  readonly after?: string;
  readonly unifiedDiff?: string;
}

/** Side effect reported by a health-check repair. */
export interface HealthRepairEffect {
  readonly kind: "config" | "file" | "service" | "process" | "package" | "state" | "other";
  readonly action: string;
  readonly target?: string;
  readonly dryRunSafe?: boolean;
}

/** Result returned by one health-check repair function. */
export interface HealthRepairResult {
  readonly status?: "repaired" | "skipped" | "failed";
  readonly reason?: string;
  readonly config?: OpenClawConfig;
  readonly changes: readonly string[];
  readonly warnings?: readonly string[];
  readonly diffs?: readonly HealthRepairDiff[];
  readonly effects?: readonly HealthRepairEffect[];
}

/** Optional scope limiting a health check to existing findings or paths. */
export interface HealthCheckScope {
  readonly findings?: readonly HealthFinding[];
  readonly paths?: readonly string[];
  readonly ocPaths?: readonly string[];
}

/** Registered health check contract used by doctor, lint, and fix flows. */
export interface HealthCheck {
  readonly id: string;
  readonly kind: "core" | "plugin";
  readonly description: string;
  readonly source?: string;
  detect(ctx: HealthCheckContext, scope?: HealthCheckScope): Promise<readonly HealthFinding[]>;
  repair?(
    ctx: HealthRepairContext,
    findings: readonly HealthFinding[],
  ): Promise<HealthRepairResult>;
}
