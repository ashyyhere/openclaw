// config plugin auto enable helpers and runtime behavior.
/** Re-exported API for src/config. */
export {
  applyPluginAutoEnable,
  materializePluginAutoEnableCandidates,
} from "./plugin-auto-enable.apply.js";
/** Re-exported API for src/config, starting with detect Plugin Auto Enable Candidates. */
export { detectPluginAutoEnableCandidates } from "./plugin-auto-enable.detect.js";
/** Re-exported API for src/config. */
export type {
  PluginAutoEnableCandidate,
  PluginAutoEnableResult,
} from "./plugin-auto-enable.types.js";
/** Re-exported API for src/config, starting with resolve Plugin Auto Enable Candidate Reason. */
export { resolvePluginAutoEnableCandidateReason } from "./plugin-auto-enable.shared.js";
