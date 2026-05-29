// Hook inclusion helpers that combine config enablement, frontmatter requires, and runtime eligibility.
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

/** Re-export binary lookup helper used by hook eligibility evaluation. */
export { hasBinary };

/** Evaluates a config path with hook-specific default truthy values. */
export function isConfigPathTruthy(config: OpenClawConfig | undefined, pathStr: string): boolean {
  return isConfigPathTruthyWithDefaults(config, pathStr, DEFAULT_CONFIG_VALUES);
}

/** Re-export hook config resolver from the policy module. */
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

/** Decides whether a hook should be included for the current config and runtime eligibility context. */
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
