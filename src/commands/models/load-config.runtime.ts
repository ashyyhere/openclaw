// Runtime-config reexports used by model commands and their tests.
/** Re-exported API for src/commands/models, starting with get Models Command Secret Target Ids. */
export { getModelsCommandSecretTargetIds } from "../../cli/command-secret-targets.js";
/** Re-exported API for src/commands/models. */
export {
  getRuntimeConfig,
  getRuntimeConfigSourceSnapshot,
  setRuntimeConfigSnapshot,
  type OpenClawConfig,
} from "../../config/config.js";
