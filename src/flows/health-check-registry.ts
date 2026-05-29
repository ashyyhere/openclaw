// flows health check registry helpers and runtime behavior.
import type { HealthCheck } from "./health-checks.js";

const REGISTRY = new Map<string, HealthCheck>();

/** Reused class for Health Check Registration Error behavior in src/flows. */
export class HealthCheckRegistrationError extends Error {
  readonly code = "OC_DOCTOR_DUPLICATE_CHECK";
  constructor(readonly checkId: string) {
    super(`health check already registered: ${checkId}`);
    this.name = "HealthCheckRegistrationError";
  }
}

/** Reused helper for register Health Check behavior in src/flows. */
export function registerHealthCheck(check: HealthCheck): void {
  if (REGISTRY.has(check.id)) {
    throw new HealthCheckRegistrationError(check.id);
  }
  REGISTRY.set(check.id, check);
}

/** Reused helper for list Health Checks behavior in src/flows. */
export function listHealthChecks(): readonly HealthCheck[] {
  return [...REGISTRY.values()];
}

/** Reused helper for get Health Check behavior in src/flows. */
export function getHealthCheck(id: string): HealthCheck | undefined {
  return REGISTRY.get(id);
}

/** Reused helper for clear Health Checks For Test behavior in src/flows. */
export function clearHealthChecksForTest(): void {
  REGISTRY.clear();
}
