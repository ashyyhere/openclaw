// Runtime boundary for src/security audit nondeep runtime behavior.
/** Re-exported API for src/security. */
export {
  collectAttackSurfaceSummaryFindings,
  collectSmallModelRiskFindings,
} from "./audit-extra.summary.js";

/** Re-exported API for src/security. */
export {
  collectExposureMatrixFindings,
  collectGatewayHttpNoAuthFindings,
  collectGatewayHttpSessionKeyOverrideFindings,
  collectHooksHardeningFindings,
  collectLikelyMultiUserSetupFindings,
  collectMinimalProfileOverrideFindings,
  collectModelHygieneFindings,
  collectNodeDangerousAllowCommandFindings,
  collectNodeDenyCommandPatternFindings,
  collectSandboxDangerousConfigFindings,
  collectSandboxDockerNoopFindings,
  collectSecretsInConfigFindings,
  collectSyncedFolderFindings,
} from "./audit-extra.sync.js";

/** Re-exported API for src/security. */
export {
  collectSandboxBrowserHashLabelFindings,
  collectIncludeFilePermFindings,
  collectStateDeepFilesystemFindings,
  readConfigSnapshotForAudit,
} from "./audit-extra.async.js";
/** Re-exported API for src/security, starting with collect Workspace Skill Symlink Escape Findings. */
export { collectWorkspaceSkillSymlinkEscapeFindings } from "../skills/security/workspace-audit.js";
/** Re-exported API for src/security, starting with collect Plugins Trust Findings. */
export { collectPluginsTrustFindings } from "./audit-plugins-trust.js";
