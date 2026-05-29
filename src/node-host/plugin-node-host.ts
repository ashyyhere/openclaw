// node-host plugin node host helpers and runtime behavior.
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { getActivePluginRegistry } from "../plugins/runtime.js";

let pluginRegistryLoaderModulePromise:
  | Promise<typeof import("../plugins/runtime/runtime-registry-loader.js")>
  | undefined;

async function loadPluginRegistryLoaderModule() {
  pluginRegistryLoaderModulePromise ??= import("../plugins/runtime/runtime-registry-loader.js");
  return await pluginRegistryLoaderModulePromise;
}

/** Reused helper for ensure Node Host Plugin Registry behavior in src/node-host. */
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

/** Reused helper for list Registered Node Host Caps And Commands behavior in src/node-host. */
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

/** Reused helper for invoke Registered Node Host Command behavior in src/node-host. */
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
