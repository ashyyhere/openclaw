/** Combines command path policy and environment flags into startup behavior. */
import { isTruthyEnvValue } from "../infra/env.js";
import type { CliCommandPluginLoadPolicy } from "./command-catalog.js";
import { resolveCliCommandPathPolicy } from "./command-path-policy.js";

/** Reused helper for should Bypass Config Guard For Command Path behavior in src/cli. */
export function shouldBypassConfigGuardForCommandPath(commandPath: string[]): boolean {
  return resolveCliCommandPathPolicy(commandPath).bypassConfigGuard;
}

/** Reused helper for should Skip Route Config Guard For Command Path behavior in src/cli. */
export function shouldSkipRouteConfigGuardForCommandPath(params: {
  commandPath: string[];
  suppressDoctorStdout: boolean;
}): boolean {
  const routeConfigGuard = resolveCliCommandPathPolicy(params.commandPath).routeConfigGuard;
  return (
    routeConfigGuard === "always" ||
    (routeConfigGuard === "when-suppressed" && params.suppressDoctorStdout)
  );
}

/** Reused helper for should Load Plugins For Command Path behavior in src/cli. */
export function shouldLoadPluginsForCommandPath(params: {
  argv?: string[];
  commandPath: string[];
  jsonOutputMode: boolean;
}): boolean {
  return shouldLoadPlugins({
    loadPlugins: resolveCliCommandPathPolicy(params.commandPath).loadPlugins,
    argv: params.argv,
    commandPath: params.commandPath,
    jsonOutputMode: params.jsonOutputMode,
  });
}

function shouldLoadPlugins(params: {
  argv?: string[];
  commandPath: string[];
  jsonOutputMode: boolean;
  loadPlugins: CliCommandPluginLoadPolicy;
}): boolean {
  const loadPlugins = params.loadPlugins;
  if (typeof loadPlugins === "function") {
    return loadPlugins({
      argv: params.argv ?? [],
      commandPath: params.commandPath,
      jsonOutputMode: params.jsonOutputMode,
    });
  }
  return loadPlugins === "always" || (loadPlugins === "text-only" && !params.jsonOutputMode);
}

/** Reused helper for should Hide Cli Banner For Command Path behavior in src/cli. */
export function shouldHideCliBannerForCommandPath(
  commandPath: string[],
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return (
    isTruthyEnvValue(env.OPENCLAW_HIDE_BANNER) ||
    resolveCliCommandPathPolicy(commandPath).hideBanner
  );
}

/** Reused helper for should Ensure Cli Path For Command Path behavior in src/cli. */
export function shouldEnsureCliPathForCommandPath(commandPath: string[]): boolean {
  return commandPath.length === 0 || resolveCliCommandPathPolicy(commandPath).ensureCliPath;
}

/** Reused helper for resolve Cli Startup Policy behavior in src/cli. */
export function resolveCliStartupPolicy(params: {
  argv?: string[];
  commandPath: string[];
  jsonOutputMode: boolean;
  env?: NodeJS.ProcessEnv;
  routeMode?: boolean;
}) {
  const suppressDoctorStdout = params.jsonOutputMode;
  const commandPolicy = resolveCliCommandPathPolicy(params.commandPath);
  const env = params.env ?? process.env;
  return {
    suppressDoctorStdout,
    hideBanner: isTruthyEnvValue(env.OPENCLAW_HIDE_BANNER) || commandPolicy.hideBanner,
    skipConfigGuard: params.routeMode
      ? commandPolicy.routeConfigGuard === "always" ||
        (commandPolicy.routeConfigGuard === "when-suppressed" && suppressDoctorStdout)
      : false,
    loadPlugins: shouldLoadPlugins({
      argv: params.argv,
      commandPath: params.commandPath,
      jsonOutputMode: params.jsonOutputMode,
      loadPlugins: commandPolicy.loadPlugins,
    }),
    pluginRegistry: commandPolicy.pluginRegistry,
  };
}
