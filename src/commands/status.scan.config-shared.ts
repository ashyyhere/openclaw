/** Shared config loading helpers for status scans. */
import { existsSync } from "node:fs";
import { resolveConfigPath } from "../config/paths.js";
import type { OpenClawConfig } from "../config/types.js";
import { resolveGatewayAuthTokenSourceConflict } from "../gateway/auth-token-source-conflict.js";

/** Reused helper for should Skip Status Scan Missing Config Fast Path behavior in src/commands. */
export function shouldSkipStatusScanMissingConfigFastPath(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return env.VITEST === "true" || env.VITEST_POOL_ID !== undefined || env.NODE_ENV === "test";
}

/** Reused helper for resolve Status Scan Cold Start behavior in src/commands. */
export function resolveStatusScanColdStart(params?: {
  env?: NodeJS.ProcessEnv;
  allowMissingConfigFastPath?: boolean;
}): boolean {
  const env = params?.env ?? process.env;
  const skipMissingConfigFastPath =
    params?.allowMissingConfigFastPath === true && shouldSkipStatusScanMissingConfigFastPath(env);
  return !skipMissingConfigFastPath && !existsSync(resolveConfigPath(env));
}

/** Reused helper for load Status Scan Command Config behavior in src/commands. */
export async function loadStatusScanCommandConfig(params: {
  commandName: string;
  readBestEffortConfig: () => Promise<OpenClawConfig>;
  resolveConfig: (
    sourceConfig: OpenClawConfig,
  ) => Promise<{ resolvedConfig: OpenClawConfig; diagnostics: string[] }>;
  env?: NodeJS.ProcessEnv;
  allowMissingConfigFastPath?: boolean;
}): Promise<{
  coldStart: boolean;
  sourceConfig: OpenClawConfig;
  resolvedConfig: OpenClawConfig;
  secretDiagnostics: string[];
}> {
  const env = params.env ?? process.env;
  const coldStart = resolveStatusScanColdStart({
    env,
    allowMissingConfigFastPath: params.allowMissingConfigFastPath,
  });
  const sourceConfig =
    coldStart && params.allowMissingConfigFastPath === true
      ? {}
      : await params.readBestEffortConfig();
  const { resolvedConfig, diagnostics } =
    coldStart && params.allowMissingConfigFastPath === true
      ? { resolvedConfig: sourceConfig, diagnostics: [] }
      : await params.resolveConfig(sourceConfig);
  const tokenConflict = resolveGatewayAuthTokenSourceConflict({ cfg: sourceConfig, env });
  return {
    coldStart,
    sourceConfig,
    resolvedConfig,
    secretDiagnostics: tokenConflict ? [...diagnostics, tokenConflict.diagnostic] : diagnostics,
  };
}
