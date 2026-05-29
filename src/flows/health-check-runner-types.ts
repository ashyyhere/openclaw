// flows health check runner types helpers and runtime behavior.
import type {
  HealthCheck,
  HealthCheckContext,
  HealthCheckScope,
  HealthFinding,
  HealthRepairDiff,
  HealthRepairEffect,
  HealthRepairResult,
} from "./health-checks.js";

/** Shared type for Health Check Run Context in src/flows. */
export interface HealthCheckRunContext extends HealthCheckContext {
  readonly repair: boolean;
  readonly diff?: boolean;
  readonly previewRepair?: boolean;
}

/** Shared type for Health Check Run Result in src/flows. */
export interface HealthCheckRunResult extends Omit<HealthRepairResult, "changes" | "status"> {
  readonly findings?: readonly HealthFinding[];
  readonly status?: "repairable" | "repaired" | "skipped" | "failed";
  readonly changes?: readonly string[];
  readonly diffs?: readonly HealthRepairDiff[];
  readonly effects?: readonly HealthRepairEffect[];
}

/** Shared type for Runnable Health Check in src/flows. */
export interface RunnableHealthCheck extends Pick<
  HealthCheck,
  "id" | "kind" | "description" | "source"
> {
  run(ctx: HealthCheckRunContext, scope?: HealthCheckScope): Promise<HealthCheckRunResult>;
}

/** Shared type for Health Check Input in src/flows. */
export type HealthCheckInput = HealthCheck | RunnableHealthCheck;

/** Shared type for Registered Health Check in src/flows. */
export interface RegisteredHealthCheck extends HealthCheck {
  readonly sourceContract: "split" | "run";
  run(ctx: HealthCheckRunContext, scope?: HealthCheckScope): Promise<HealthCheckRunResult>;
}
