// Node-host bridge for plugin-provided commands. The gateway loads plugin
// command metadata once, then this module exposes the registered capability and
// command set to node.invoke without importing plugin internals directly.
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { getActivePluginRegistry } from "../plugins/runtime.js";

let pluginRegistryLoaderModulePromise:
  | Promise<typeof import("../plugins/runtime/runtime-registry-loader.js")>
  | undefined;

async function loadPluginRegistryLoaderModule() {
  pluginRegistryLoaderModulePromise ??= import("../plugins/runtime/runtime-registry-loader.js");
  return await pluginRegistryLoaderModulePromise;
}

/** Load the plugin registry before node-host command discovery or invocation. */
export async function ensureNodeHostPluginRegistry(params: {
  config: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
}): Promise<void> {
  (await loadPluginRegistryLoaderModule()).ensurePluginRegistryLoaded({
    scope: "all",
    config: params.config,
    activationSourceConfig: params.config,
    env: params.env,
  });
}

/** Return deterministic plugin node-host capability and command names. */
export function listRegisteredNodeHostCapsAndCommands(): {
  caps: string[];
  commands: string[];
} {
  const registry = getActivePluginRegistry();
  const caps = new Set<string>();
  const commands = new Set<string>();
  for (const entry of registry?.nodeHostCommands ?? []) {
    if (entry.command.cap) {
      caps.add(entry.command.cap);
    }
    commands.add(entry.command.command);
  }
  return {
    caps: [...caps].toSorted((left, right) => left.localeCompare(right)),
    commands: [...commands].toSorted((left, right) => left.localeCompare(right)),
  };
}

/** Dispatch a plugin-owned node-host command by its manifest command id. */
export async function invokeRegisteredNodeHostCommand(
  command: string,
  paramsJSON?: string | null,
): Promise<string | null> {
  const registry = getActivePluginRegistry();
  const match = (registry?.nodeHostCommands ?? []).find(
    (entry) => entry.command.command === command,
  );
  if (!match) {
    return null;
  }
  return await match.command.handle(paramsJSON);
}
