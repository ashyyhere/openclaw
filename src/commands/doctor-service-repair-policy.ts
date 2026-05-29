/** Resolves whether gateway service repairs should run automatically. */
import type { DoctorPrompter } from "./doctor-prompter.js";

type ServiceRepairPolicy = "auto" | "external";

/** Reused constant for SERVICE REPAIR POLICY ENV behavior in src/commands. */
export const SERVICE_REPAIR_POLICY_ENV = "OPENCLAW_SERVICE_REPAIR_POLICY";

/** Reused constant for EXTERNAL SERVICE REPAIR NOTE behavior in src/commands. */
export const EXTERNAL_SERVICE_REPAIR_NOTE =
  "Gateway service is managed externally; skipped service install/start repair. Start or repair the gateway through your supervisor.";

/** Reused helper for resolve Service Repair Policy behavior in src/commands. */
export function resolveServiceRepairPolicy(
  env: NodeJS.ProcessEnv = process.env,
): ServiceRepairPolicy {
  const value = env[SERVICE_REPAIR_POLICY_ENV]?.trim().toLowerCase();
  switch (value) {
    case "auto":
    case "external":
      return value;
    default:
      return "auto";
  }
}

/** Reused helper for is Service Repair Externally Managed behavior in src/commands. */
export function isServiceRepairExternallyManaged(
  policy: ServiceRepairPolicy = resolveServiceRepairPolicy(),
): boolean {
  return policy === "external";
}

/** Reused helper for confirm Doctor Service Repair behavior in src/commands. */
export async function confirmDoctorServiceRepair(
  prompter: DoctorPrompter,
  params: Parameters<DoctorPrompter["confirmRuntimeRepair"]>[0],
  policy: ServiceRepairPolicy = resolveServiceRepairPolicy(),
): Promise<boolean> {
  if (isServiceRepairExternallyManaged(policy)) {
    return false;
  }

  return await prompter.confirmRuntimeRepair(params);
}
