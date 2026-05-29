/** Resolves doctor repair mode from options and environment. */
import { isTruthyEnvValue } from "../infra/env.js";
import type { DoctorOptions } from "./doctor.types.js";

/** Shared type for Doctor Repair Mode in src/commands. */
export type DoctorRepairMode = {
  shouldRepair: boolean;
  shouldForce: boolean;
  nonInteractive: boolean;
  canPrompt: boolean;
  updateInProgress: boolean;
};

/** Reused helper for resolve Doctor Repair Mode behavior in src/commands. */
export function resolveDoctorRepairMode(options: DoctorOptions): DoctorRepairMode {
  const yes = options.yes === true;
  const requestedNonInteractive = options.nonInteractive === true;
  const shouldRepair = options.repair === true || yes;
  const shouldForce = options.force === true;
  const isTty = process.stdin.isTTY;
  const nonInteractive = requestedNonInteractive || (!isTty && !yes);
  const updateInProgress = isTruthyEnvValue(process.env.OPENCLAW_UPDATE_IN_PROGRESS);
  const canPrompt = isTty && !yes && !nonInteractive;

  return {
    shouldRepair,
    shouldForce,
    nonInteractive,
    canPrompt,
    updateInProgress,
  };
}

/** Reused helper for is Doctor Update Repair Mode behavior in src/commands. */
export function isDoctorUpdateRepairMode(mode: DoctorRepairMode): boolean {
  return mode.updateInProgress && mode.nonInteractive;
}

/** Reused helper for should Auto Approve Doctor Fix behavior in src/commands. */
export function shouldAutoApproveDoctorFix(
  mode: DoctorRepairMode,
  params: {
    requiresForce?: boolean;
    blockDuringUpdate?: boolean;
  } = {},
): boolean {
  if (!mode.shouldRepair) {
    return false;
  }
  if (params.requiresForce && !mode.shouldForce) {
    return false;
  }
  if (params.blockDuringUpdate && isDoctorUpdateRepairMode(mode)) {
    return false;
  }
  return true;
}
