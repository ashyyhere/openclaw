// hooks config helpers and runtime behavior.
import type { OpenClawConfig, HookConfig } from "../config/config.js";
import {
  evaluateRuntimeEligibility,
  hasBinary,
  isConfigPathTruthyWithDefaults,
} from "../shared/config-eval.js";
import { resolveHookConfig, resolveHookEnableState } from "./policy.js";
import type { HookEligibilityContext, HookEntry } from "./types.js";

const DEFAULT_CONFIG_VALUES: Record<string, boolean> = {
  "browser.enabled": true,
  "browser.evaluateEnabled": true,
  "workspace.dir": true,
};

/** Re-exported API for src/hooks, starting with has Binary. */
export { hasBinary };

/** Reused helper for is Config Path Truthy behavior in src/hooks. */
export function isConfigPathTruthy(config: OpenClawConfig | undefined, pathStr: string): boolean {
  return isConfigPathTruthyWithDefaults(config, pathStr, DEFAULT_CONFIG_VALUES);
}

/** Re-exported API for src/hooks, starting with resolve Hook Config. */
export { resolveHookConfig };

function evaluateHookRuntimeEligibility(params: {
  entry: HookEntry;
  config?: OpenClawConfig;
  hookConfig?: HookConfig;
  eligibility?: HookEligibilityContext;
}): boolean {
  const { entry, config, hookConfig, eligibility } = params;
  const remote = eligibility?.remote;
  const base = {
    os: entry.metadata?.os,
    remotePlatforms: remote?.platforms,
    always: entry.metadata?.always,
    requires: entry.metadata?.requires,
    hasRemoteBin: remote?.hasBin,
    hasAnyRemoteBin: remote?.hasAnyBin,
  };
  return evaluateRuntimeEligibility({
    ...base,
    hasBin: hasBinary,
    hasEnv: (envName) => Boolean(process.env[envName] || hookConfig?.env?.[envName]),
    isConfigPathTruthy: (configPath) => isConfigPathTruthy(config, configPath),
  });
}

/** Reused helper for should Include Hook behavior in src/hooks. */
export function shouldIncludeHook(params: {
  entry: HookEntry;
  config?: OpenClawConfig;
  eligibility?: HookEligibilityContext;
}): boolean {
  const { entry, config, eligibility } = params;
  const hookConfig = resolveHookConfig(
    config,
    params.entry.metadata?.hookKey ?? params.entry.hook.name,
  );
  if (!resolveHookEnableState({ entry, config, hookConfig }).enabled) {
    return false;
  }

  return evaluateHookRuntimeEligibility({
    entry,
    config,
    hookConfig,
    eligibility,
  });
}
