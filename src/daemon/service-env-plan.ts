/** Mutable plan for assembling daemon service environment variables. */
import { normalizeEnvVarKey } from "../infra/host-env-security.js";
import type { GatewayServiceEnvironmentValueSource } from "./service-types.js";

/** Source category explaining where a service env value came from. */
export type ServiceEnvSource =
  | "state-dotenv"
  | "config-env"
  | "config-secretref-env"
  | "exec-passenv"
  | "auth-profile-env"
  | "existing-preserved"
  | "service-generated";

/** One normalized service env value recorded in a mutable plan. */
export type ServiceEnvPlanEntry = {
  rawKey: string;
  normalizedKey: string;
  value: string;
  source: ServiceEnvSource;
};

/** Mutable service env plan with raw env and normalized source tracking. */
export type MutableServiceEnvPlan = {
  environment: Record<string, string | undefined>;
  environmentValueSources: Record<string, GatewayServiceEnvironmentValueSource | undefined>;
  entriesByNormalizedKey: Map<string, ServiceEnvPlanEntry>;
};

/** Creates an empty mutable service environment plan. */
export function createMutableServiceEnvPlan(): MutableServiceEnvPlan {
  return {
    environment: {},
    environmentValueSources: {},
    entriesByNormalizedKey: new Map(),
  };
}

/** Normalizes a service env key for portable case-insensitive tracking. */
export function normalizeServiceEnvPlanKey(rawKey: string): string | undefined {
  return normalizeEnvVarKey(rawKey, { portable: true })?.toUpperCase();
}

/** Adds raw env entries to a mutable plan with normalized source metadata. */
export function addServiceEnvPlanEntries(
  plan: MutableServiceEnvPlan,
  entries: Record<string, string | undefined>,
  options: {
    source: ServiceEnvSource;
    includeRawKeys?: boolean;
    valueSource?:
      | GatewayServiceEnvironmentValueSource
      | ((params: {
          rawKey: string;
          normalizedKey: string;
        }) => GatewayServiceEnvironmentValueSource | undefined);
  },
): void {
  for (const [rawKey, rawValue] of Object.entries(entries)) {
    if (typeof rawValue !== "string" || !rawValue.trim()) {
      if (options.includeRawKeys) {
        plan.environment[rawKey] = rawValue;
        plan.environmentValueSources[rawKey] = "inline";
      }
      continue;
    }
    const value = rawValue;
    const normalizedKey = normalizeServiceEnvPlanKey(rawKey);
    if (!normalizedKey) {
      continue;
    }
    plan.environment[rawKey] = value;
    const valueSource =
      typeof options.valueSource === "function"
        ? options.valueSource({ rawKey, normalizedKey })
        : options.valueSource;
    plan.environmentValueSources[rawKey] = valueSource ?? "inline";
    plan.entriesByNormalizedKey.set(normalizedKey, {
      rawKey,
      normalizedKey,
      value,
      source: options.source,
    });
  }
}

/** Removes value-source metadata for env keys no longer present in the plan. */
export function compactServiceEnvPlanValueSources(plan: MutableServiceEnvPlan): void {
  for (const key of Object.keys(plan.environmentValueSources)) {
    if (!Object.hasOwn(plan.environment, key)) {
      delete plan.environmentValueSources[key];
    }
  }
}
