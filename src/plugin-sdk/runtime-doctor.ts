/** Runtime SDK barrel for doctor/runtime config diagnostics. */
export { collectProviderDangerousNameMatchingScopes } from "../config/dangerous-name-matching.js";
/** Re-exported API for src/plugin-sdk. */
export {
  asObjectRecord,
  hasLegacyAccountStreamingAliases,
  hasLegacyStreamingAliases,
  normalizeLegacyChannelAliases,
  normalizeLegacyDmAliases,
  normalizeLegacyStreamingAliases,
} from "../config/channel-compat-normalization.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  CompatMutationResult,
  LegacyStreamingAliasOptions,
  NormalizeLegacyChannelAccountParams,
} from "../config/channel-compat-normalization.js";
/** Re-exported API for src/plugin-sdk. */
export {
  detectPluginInstallPathIssue,
  formatPluginInstallPathIssue,
} from "../infra/plugin-install-path-warnings.js";
/** Re-exported API for src/plugin-sdk, starting with remove Plugin From Config. */
export { removePluginFromConfig } from "../plugins/uninstall.js";
/** Re-exported API for src/plugin-sdk, starting with Doctor Session Route State Owner. */
export type { DoctorSessionRouteStateOwner } from "../plugins/doctor-session-route-state-owner-types.js";
