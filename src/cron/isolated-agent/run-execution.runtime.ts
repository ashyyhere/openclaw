// Runtime facade for isolated cron agent execution. Keeps the main runner on
// light imports while deferring CLI runner/session code until needed.
/** Resolves model fallback configuration for cron agent execution. */
export {
  resolveEffectiveModelFallbacks,
  resolveSubagentModelFallbacksOverride,
} from "../../agents/agent-scope.js";
/** Tracks bootstrap warning signatures already surfaced during cron runs. */
export { resolveBootstrapWarningSignaturesSeen } from "../../agents/bootstrap-budget.js";
/** Chooses the command lane used by cron agent execution. */
export { resolveCronAgentLane } from "../../agents/lanes.js";
/** Ensures the selected agent harness plugin is loaded before execution. */
export { ensureSelectedAgentHarnessPlugin } from "../../agents/harness/runtime-plugin.js";
/** Error type used when live session model switching fails. */
export { LiveSessionModelSwitchError } from "../../agents/live-model-switch-error.js";
/** Runs agent work with configured model fallback handling. */
export { runWithModelFallback } from "../../agents/model-fallback.js";
/** Detects providers that execute through CLI-backed agents. */
export { isCliProvider } from "../../agents/model-selection-cli.js";
/** Normalizes verbose thinking/logging levels for cron execution. */
export { normalizeVerboseLevel } from "../../auto-reply/thinking.shared.js";
/** Resolves transcript paths for cron-created sessions. */
export { resolveSessionTranscriptPath } from "../../config/sessions/paths.js";
/** Registers agent run context for event subscribers and diagnostics. */
export { registerAgentRunContext } from "../../infra/agent-events.js";
/** Warning logger used by isolated cron execution runtime. */
export { logWarn } from "../../logger.js";
import { createLazyImportLoader } from "../../shared/lazy-promise.js";

const cronExecutionCliRuntimeLoader = createLazyImportLoader(
  () => import("./run-execution-cli.runtime.js"),
);

async function loadCronExecutionCliRuntime() {
  return await cronExecutionCliRuntimeLoader.load();
}

/** Lazily resolves the CLI session id helper for cron agent runs. */
export async function getCliSessionId(
  ...args: Parameters<typeof import("../../agents/cli-session.js").getCliSessionId>
): Promise<ReturnType<typeof import("../../agents/cli-session.js").getCliSessionId>> {
  const runtime = await loadCronExecutionCliRuntime();
  return runtime.getCliSessionId(...args);
}

/** Lazily invokes the CLI agent runner for cron execution. */
export async function runCliAgent(
  ...args: Parameters<typeof import("../../agents/cli-runner.js").runCliAgent>
): ReturnType<typeof import("../../agents/cli-runner.js").runCliAgent> {
  const runtime = await loadCronExecutionCliRuntime();
  return runtime.runCliAgent(...args);
}
