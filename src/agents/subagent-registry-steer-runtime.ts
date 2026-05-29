/** Runtime bridge for replacing/interupting subagent runs during steer operations. */
import type { SubagentRunRecord } from "./subagent-registry.types.js";

type ReplaceSubagentRunAfterSteerParams = {
  previousRunId: string;
  nextRunId: string;
  fallback?: SubagentRunRecord;
  runTimeoutSeconds?: number;
  preserveFrozenResultFallback?: boolean;
  transcriptFile?: string;
};

type ReplaceSubagentRunAfterSteerFn = (params: ReplaceSubagentRunAfterSteerParams) => boolean;

type FinalizeInterruptedSubagentRunParams = {
  runId?: string;
  childSessionKey?: string;
  error: string;
  endedAt?: number;
};

type FinalizeInterruptedSubagentRunFn = (
  params: FinalizeInterruptedSubagentRunParams,
) => Promise<number>;

let replaceSubagentRunAfterSteerImpl: ReplaceSubagentRunAfterSteerFn | null = null;
let finalizeInterruptedSubagentRunImpl: FinalizeInterruptedSubagentRunFn | null = null;

/** Reused helper for configure Subagent Registry Steer Runtime behavior in src/agents. */
export function configureSubagentRegistrySteerRuntime(params: {
  replaceSubagentRunAfterSteer: ReplaceSubagentRunAfterSteerFn;
  finalizeInterruptedSubagentRun?: FinalizeInterruptedSubagentRunFn;
}) {
  replaceSubagentRunAfterSteerImpl = params.replaceSubagentRunAfterSteer;
  finalizeInterruptedSubagentRunImpl = params.finalizeInterruptedSubagentRun ?? null;
}

/** Reused helper for replace Subagent Run After Steer behavior in src/agents. */
export function replaceSubagentRunAfterSteer(params: ReplaceSubagentRunAfterSteerParams) {
  return replaceSubagentRunAfterSteerImpl?.(params) ?? false;
}

/** Reused helper for finalize Interrupted Subagent Run behavior in src/agents. */
export async function finalizeInterruptedSubagentRun(params: FinalizeInterruptedSubagentRunParams) {
  return (await finalizeInterruptedSubagentRunImpl?.(params)) ?? 0;
}
