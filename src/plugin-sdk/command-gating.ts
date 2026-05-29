/** Public SDK barrel for command authorization gates shared by channel plugins. */
export type {
  CommandAuthorizer,
  CommandGatingModeWhenAccessGroupsOff,
} from "../channels/command-gating.js";
/** Re-exported API for src/plugin-sdk. */
export {
  resolveCommandAuthorizedFromAuthorizers,
  resolveControlCommandGate,
  resolveDualTextControlCommandGate,
} from "../channels/command-gating.js";
