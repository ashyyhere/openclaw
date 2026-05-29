// Tracks generated owner display secrets until config write/repair code consumes them.
import type { OpenClawConfig } from "./types.openclaw.js";

/** Process-local generated owner-display secrets keyed by config path. */
export type OwnerDisplaySecretRuntimeState = {
  pendingByPath: Map<string, string>;
};

/** Retain or clear a generated owner-display secret without mutating the config object. */
export function retainGeneratedOwnerDisplaySecret(params: {
  config: OpenClawConfig;
  configPath: string;
  generatedSecret?: string;
  state: OwnerDisplaySecretRuntimeState;
}): OpenClawConfig {
  const { config, configPath, generatedSecret, state } = params;
  if (!generatedSecret) {
    state.pendingByPath.delete(configPath);
    return config;
  }

  state.pendingByPath.set(configPath, generatedSecret);
  return config;
}
