// Public provider auth environment variable helpers for plugin runtimes.

/** Re-exported API for src/plugin-sdk. */
export {
  getProviderEnvVars,
  listKnownProviderAuthEnvVarNames,
  omitEnvKeysCaseInsensitive,
  resolveProviderAuthEnvVarCandidates,
} from "../secrets/provider-env-vars.js";
