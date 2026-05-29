/** Dispatches embedded attempts through the selected agent harness backend. */
import { runAgentHarnessAttempt } from "../../harness/selection.js";
import type { EmbeddedRunAttemptParams, EmbeddedRunAttemptResult } from "./types.js";

/** Runs one embedded attempt through the active harness backend. */
export async function runEmbeddedAttemptWithBackend(
  params: EmbeddedRunAttemptParams,
): Promise<EmbeddedRunAttemptResult> {
  return runAgentHarnessAttempt(params);
}
