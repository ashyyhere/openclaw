// Shared health-check runner contracts for doctor detection and repair execution.
import type {
  HealthCheck,
  HealthCheckContext,
  HealthCheckScope,
  HealthFinding,
  HealthRepairDiff,
  HealthRepairEffect,
  HealthRepairResult,
} from "./health-checks.js";

/** Runtime context passed to a health check during detect or repair runs. */
export interface HealthCheckRunContext extends HealthCheckContext {
  readonly repair: boolean;
  readonly diff?: boolean;
  readonly previewRepair?: boolean;
}

/** Normalized result returned by runnable health checks. */
export interface HealthCheckRunResult extends Omit<HealthRepairResult, "changes" | "status"> {
  readonly findings?: readonly HealthFinding[];
  readonly status?: "repairable" | "repaired" | "skipped" | "failed";
  readonly changes?: readonly string[];
  readonly diffs?: readonly HealthRepairDiff[];
  readonly effects?: readonly HealthRepairEffect[];
}

/** Health check shape after legacy split detect/repair code is adapted to run(). */
export interface RunnableHealthCheck extends Pick<
  HealthCheck,
  "id" | "kind" | "description" | "source"
> {
  run(ctx: HealthCheckRunContext, scope?: HealthCheckScope): Promise<HealthCheckRunResult>;
}

/** Health check registry input before normalization. */
export type HealthCheckInput = HealthCheck | RunnableHealthCheck;

/** Health check shape stored by the runner after source contract normalization. */
export interface RegisteredHealthCheck extends HealthCheck {
  readonly sourceContract: "split" | "run";
  run(ctx: HealthCheckRunContext, scope?: HealthCheckScope): Promise<HealthCheckRunResult>;
}
