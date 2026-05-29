/** Resolves whether gateway service repairs should run automatically. */
import type { DoctorPrompter } from "./doctor-prompter.js";

type ServiceRepairPolicy = "auto" | "external";

/** Env key that lets externally supervised installs opt out of doctor service repair. */
export const SERVICE_REPAIR_POLICY_ENV = "OPENCLAW_SERVICE_REPAIR_POLICY";

/** Doctor note shown when service repair is delegated to an external supervisor. */
export const EXTERNAL_SERVICE_REPAIR_NOTE =
  "Gateway service is managed externally; skipped service install/start repair. Start or repair the gateway through your supervisor.";

/** Resolves service repair policy from env, defaulting to managed automatic repair. */
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

/** Checks whether doctor must avoid mutating gateway service supervision. */
export function isServiceRepairExternallyManaged(
  policy: ServiceRepairPolicy = resolveServiceRepairPolicy(),
): boolean {
  return policy === "external";
}

/** Confirms a service repair only when the active policy allows doctor-managed repair. */
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
