/** Public SDK barrel for channel config write scopes, targets, and authorization policy. */
export {
  authorizeConfigWrite,
  canBypassConfigWritePolicy,
  formatConfigWriteDeniedMessage,
  resolveChannelConfigWrites,
} from "./channel-config-helpers.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  ConfigWriteAuthorizationResult,
  ConfigWriteScope,
  ConfigWriteTarget,
} from "./channel-config-helpers.js";
