/** Runtime re-exports for embedded gateway lifecycle helpers. */
export {
  abortEmbeddedAgentRun,
  getActiveEmbeddedRunCount,
  listActiveEmbeddedRunSessionIds,
  listActiveEmbeddedRunSessionKeys,
  waitForActiveEmbeddedRuns,
} from "../../agents/embedded-agent-runner/runs.js";
/** Re-exported API for src/cli/gateway-cli, starting with mark Restart Aborted Main Sessions. */
export { markRestartAbortedMainSessions } from "../../agents/main-session-restart-recovery.js";
/** Re-exported API for src/cli/gateway-cli, starting with get Runtime Config. */
export { getRuntimeConfig } from "../../config/config.js";
/** Re-exported API for src/cli/gateway-cli. */
export {
  respawnGatewayProcessForUpdate,
  restartGatewayProcessWithFreshPid,
} from "../../infra/process-respawn.js";
/** Re-exported API for src/cli/gateway-cli. */
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
/** Re-exported API for src/cli/gateway-cli, starting with write Gateway Restart Handoff Sync. */
export { writeGatewayRestartHandoffSync } from "../../infra/restart-handoff.js";
/** Re-exported API for src/cli/gateway-cli, starting with mark Update Restart Sentinel Failure. */
export { markUpdateRestartSentinelFailure } from "../../infra/restart-sentinel.js";
/** Re-exported API for src/cli/gateway-cli, starting with detect Respawn Supervisor. */
export { detectRespawnSupervisor } from "../../infra/supervisor-markers.js";
/** Re-exported API for src/cli/gateway-cli, starting with write Diagnostic Stability Bundle For Failure Sync. */
export { writeDiagnosticStabilityBundleForFailureSync } from "../../logging/diagnostic-stability-bundle.js";
/** Re-exported API for src/cli/gateway-cli. */
export {
  getActiveTaskCount,
  markGatewayDraining,
  resetAllLanes,
  waitForActiveTasks,
} from "../../process/command-queue.js";
/** Re-exported API for src/cli/gateway-cli, starting with get Inspectable Active Task Restart Blockers. */
export { getInspectableActiveTaskRestartBlockers } from "../../tasks/task-registry.maintenance.js";
/** Re-exported API for src/cli/gateway-cli, starting with reload Task Registry From Store. */
export { reloadTaskRegistryFromStore } from "../../tasks/runtime-internal.js";
