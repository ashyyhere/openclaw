// daemon restart logs helpers and runtime behavior.
import path from "node:path";
import { quoteCmdScriptArg } from "./cmd-argv.js";
import { resolveGatewayProfileSuffix } from "./constants.js";
import { resolveGatewayStateDir, resolveHomeDir } from "./paths.js";
import type { GatewayServiceEnv } from "./service-types.js";

/** Reused constant for GATEWAY RESTART LOG FILENAME behavior in src/daemon. */
export const GATEWAY_RESTART_LOG_FILENAME = "gateway-restart.log";

/** Shared type for Gateway Log Paths in src/daemon. */
export type GatewayLogPaths = {
  logDir: string;
  stdoutPath: string;
  stderrPath: string;
};

function resolveGatewayLogPrefix(env: GatewayServiceEnv): string {
  return env.OPENCLAW_LOG_PREFIX?.trim() || "gateway";
}

function resolveMacLaunchAgentLogPrefix(env: GatewayServiceEnv): string {
  return (
    env.OPENCLAW_LOG_PREFIX?.trim() || `gateway${resolveGatewayProfileSuffix(env.OPENCLAW_PROFILE)}`
  );
}

/** Reused helper for resolve Gateway Log Paths behavior in src/daemon. */
export function resolveGatewayLogPaths(env: GatewayServiceEnv): GatewayLogPaths {
  const stateDir = resolveGatewayStateDir(env);
  const logDir = path.join(stateDir, "logs");
  const prefix = resolveGatewayLogPrefix(env);
  return {
    logDir,
    stdoutPath: path.join(logDir, `${prefix}.log`),
    stderrPath: path.join(logDir, `${prefix}.err.log`),
  };
}

/** Reused helper for resolve Mac Launch Agent Log Paths behavior in src/daemon. */
export function resolveMacLaunchAgentLogPaths(env: GatewayServiceEnv): GatewayLogPaths {
  const home = resolveHomeDir(env).replaceAll("\\", "/");
  const logDir = path.posix.join(home, "Library", "Logs", "openclaw");
  const prefix = resolveMacLaunchAgentLogPrefix(env);
  return {
    logDir,
    stdoutPath: path.posix.join(logDir, `${prefix}.log`),
    stderrPath: path.posix.join(logDir, `${prefix}.err.log`),
  };
}

/** Reused helper for resolve Gateway Supervisor Log Paths behavior in src/daemon. */
export function resolveGatewaySupervisorLogPaths(
  env: GatewayServiceEnv,
  options?: { platform?: NodeJS.Platform },
): GatewayLogPaths {
  return (options?.platform ?? process.platform) === "darwin"
    ? resolveMacLaunchAgentLogPaths(env)
    : resolveGatewayLogPaths(env);
}

/** Reused helper for resolve Gateway Restart Log Path behavior in src/daemon. */
export function resolveGatewayRestartLogPath(env: GatewayServiceEnv): string {
  return path.join(resolveGatewayLogPaths(env).logDir, GATEWAY_RESTART_LOG_FILENAME);
}

/** Reused helper for shell Escape Restart Log Value behavior in src/daemon. */
export function shellEscapeRestartLogValue(value: string): string {
  return value.replace(/'/g, "'\\''");
}

/** Reused helper for render Posix Restart Log Setup behavior in src/daemon. */
export function renderPosixRestartLogSetup(env: GatewayServiceEnv): string {
  const logDir = path.dirname(resolveGatewayRestartLogPath(env));
  const logPath = resolveGatewayRestartLogPath(env);
  const escapedLogDir = shellEscapeRestartLogValue(logDir);
  const escapedLogPath = shellEscapeRestartLogValue(logPath);
  return `if mkdir -p '${escapedLogDir}' 2>/dev/null && : >>'${escapedLogPath}' 2>/dev/null; then
  exec >>'${escapedLogPath}' 2>&1
fi`;
}

/** Reused helper for render Cmd Restart Log Setup behavior in src/daemon. */
export function renderCmdRestartLogSetup(env: GatewayServiceEnv): {
  lines: string[];
  quotedLogPath: string;
} {
  const logPath = resolveGatewayRestartLogPath(env);
  const logDir = path.dirname(logPath);
  const quotedLogDir = quoteCmdScriptArg(logDir);
  const quotedLogPath = quoteCmdScriptArg(logPath);
  return {
    quotedLogPath,
    lines: [
      `if not exist ${quotedLogDir} mkdir ${quotedLogDir} >nul 2>&1`,
      `>> ${quotedLogPath} 2>&1 echo [%DATE% %TIME%] openclaw restart log initialized`,
    ],
  };
}
