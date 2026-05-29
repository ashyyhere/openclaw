// config io owner display secret helpers and runtime behavior.
import type { OpenClawConfig } from "./types.openclaw.js";

/** Shared type for Owner Display Secret Runtime State in src/config. */
export type OwnerDisplaySecretRuntimeState = {
  pendingByPath: Map<string, string>;
};

/** Reused helper for retain Generated Owner Display Secret behavior in src/config. */
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
