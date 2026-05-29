// Runtime boundary for cron/isolated-agent run execution runtime behavior.
/** Re-exported API for src/cron/isolated-agent. */
export {
  resolveEffectiveModelFallbacks,
  resolveSubagentModelFallbacksOverride,
} from "../../agents/agent-scope.js";
/** Re-exported API for src/cron/isolated-agent, starting with resolve Bootstrap Warning Signatures Seen. */
export { resolveBootstrapWarningSignaturesSeen } from "../../agents/bootstrap-budget.js";
/** Re-exported API for src/cron/isolated-agent, starting with resolve Cron Agent Lane. */
export { resolveCronAgentLane } from "../../agents/lanes.js";
/** Re-exported API for src/cron/isolated-agent, starting with ensure Selected Agent Harness Plugin. */
export { ensureSelectedAgentHarnessPlugin } from "../../agents/harness/runtime-plugin.js";
/** Re-exported API for src/cron/isolated-agent, starting with Live Session Model Switch Error. */
export { LiveSessionModelSwitchError } from "../../agents/live-model-switch-error.js";
/** Re-exported API for src/cron/isolated-agent, starting with run With Model Fallback. */
export { runWithModelFallback } from "../../agents/model-fallback.js";
/** Re-exported API for src/cron/isolated-agent, starting with is Cli Provider. */
export { isCliProvider } from "../../agents/model-selection-cli.js";
/** Re-exported API for src/cron/isolated-agent, starting with normalize Verbose Level. */
export { normalizeVerboseLevel } from "../../auto-reply/thinking.shared.js";
/** Re-exported API for src/cron/isolated-agent, starting with resolve Session Transcript Path. */
export { resolveSessionTranscriptPath } from "../../config/sessions/paths.js";
/** Re-exported API for src/cron/isolated-agent, starting with register Agent Run Context. */
export { registerAgentRunContext } from "../../infra/agent-events.js";
/** Re-exported API for src/cron/isolated-agent, starting with log Warn. */
export { logWarn } from "../../logger.js";
import { createLazyImportLoader } from "../../shared/lazy-promise.js";

const cronExecutionCliRuntimeLoader = createLazyImportLoader(
  () => import("./run-execution-cli.runtime.js"),
);

async function loadCronExecutionCliRuntime() {
  return await cronExecutionCliRuntimeLoader.load();
}

/** Reused helper for get Cli Session Id behavior in src/cron/isolated-agent. */
export async function getCliSessionId(
  ...args: Parameters<typeof import("../../agents/cli-session.js").getCliSessionId>
): Promise<ReturnType<typeof import("../../agents/cli-session.js").getCliSessionId>> {
  const runtime = await loadCronExecutionCliRuntime();
  return runtime.getCliSessionId(...args);
}

/** Reused helper for run Cli Agent behavior in src/cron/isolated-agent. */
export async function runCliAgent(
  ...args: Parameters<typeof import("../../agents/cli-runner.js").runCliAgent>
): ReturnType<typeof import("../../agents/cli-runner.js").runCliAgent> {
  const runtime = await loadCronExecutionCliRuntime();
  return runtime.runCliAgent(...args);
}
