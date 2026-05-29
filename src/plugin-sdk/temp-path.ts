/** Public SDK barrel for temp path helpers. */
export {
  buildRandomTempFilePath,
  createTempDownloadTarget,
  resolvePreferredOpenClawTmpDir,
  sanitizeTempFileName,
  withTempDownloadPath,
} from "../infra/temp-download.js";
/** Re-exported API for src/plugin-sdk. */
export {
  tempWorkspace,
  tempWorkspaceSync,
  type TempWorkspace,
  type TempWorkspaceOptions,
  type TempWorkspaceSync,
  withTempWorkspace,
  withTempWorkspaceSync,
} from "../infra/private-temp-workspace.js";
