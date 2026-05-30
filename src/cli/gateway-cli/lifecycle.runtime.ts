/** Runtime re-exports for embedded gateway lifecycle helpers. */
export {
  abortEmbeddedAgentRun,
  getActiveEmbeddedRunCount,
  listActiveEmbeddedRunSessionIds,
  listActiveEmbeddedRunSessionKeys,
  waitForActiveEmbeddedRuns,
} from "../../agents/embedded-agent-runner/runs.js";
/** Recovery hook for sessions interrupted by gateway restart. */
export { markRestartAbortedMainSessions } from "../../agents/main-session-restart-recovery.js";
/** Runtime config loader used by lifecycle commands. */
export { getRuntimeConfig } from "../../config/config.js";
/** Process respawn helpers for update-driven gateway restarts. */
export {
  respawnGatewayProcessForUpdate,
  restartGatewayProcessWithFreshPid,
} from "../../infra/process-respawn.js";
/** Restart intent state and SIGUSR1 orchestration helpers for gateway lifecycle. */
export {
  resolveGatewayRestartDeferralTimeoutMs,
  consumeGatewayRestartIntentPayloadSync,
  consumeGatewaySigusr1RestartIntent,
  consumeGatewayRestartIntentSync,
  consumeGatewaySigusr1RestartAuthorization,
  isGatewaySigusr1RestartExternallyAllowed,
  markGatewaySigusr1RestartHandled,
  peekGatewaySigusr1RestartReason,
  resetGatewayRestartStateForInProcessRestart,
  scheduleGatewaySigusr1Restart,
} from "../../infra/restart.js";
/** Synchronous restart handoff writer used before process replacement. */
export { writeGatewayRestartHandoffSync } from "../../infra/restart-handoff.js";
/** Sentinel failure marker for update restart diagnostics. */
export { markUpdateRestartSentinelFailure } from "../../infra/restart-sentinel.js";
/** Supervisor marker detector used to distinguish managed respawns. */
export { detectRespawnSupervisor } from "../../infra/supervisor-markers.js";
/** Diagnostic bundle writer for lifecycle failure closeout. */
export { writeDiagnosticStabilityBundleForFailureSync } from "../../logging/diagnostic-stability-bundle.js";
/** Command-queue drain helpers used before gateway shutdown/restart. */
export {
  getActiveTaskCount,
  markGatewayDraining,
  resetAllLanes,
  waitForActiveTasks,
} from "../../process/command-queue.js";
/** Task-registry restart blocker summary for operator diagnostics. */
export { getInspectableActiveTaskRestartBlockers } from "../../tasks/task-registry.maintenance.js";
/** Task-registry store reload hook used after lifecycle transitions. */
export { reloadTaskRegistryFromStore } from "../../tasks/runtime-internal.js";
