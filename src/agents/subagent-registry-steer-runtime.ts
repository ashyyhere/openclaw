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

/** Install steer-time registry callbacks supplied by the registry module. */
export function configureSubagentRegistrySteerRuntime(params: {
  replaceSubagentRunAfterSteer: ReplaceSubagentRunAfterSteerFn;
  finalizeInterruptedSubagentRun?: FinalizeInterruptedSubagentRunFn;
}) {
  replaceSubagentRunAfterSteerImpl = params.replaceSubagentRunAfterSteer;
  finalizeInterruptedSubagentRunImpl = params.finalizeInterruptedSubagentRun ?? null;
}

/** Replace a subagent run after a steer operation, when callbacks are installed. */
export function replaceSubagentRunAfterSteer(params: ReplaceSubagentRunAfterSteerParams) {
  return replaceSubagentRunAfterSteerImpl?.(params) ?? false;
}

/** Finalize an interrupted subagent run through the installed registry callback. */
export async function finalizeInterruptedSubagentRun(params: FinalizeInterruptedSubagentRunParams) {
  return (await finalizeInterruptedSubagentRunImpl?.(params)) ?? 0;
}
