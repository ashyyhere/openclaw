/** Public SDK barrel for config mutation logging and after-write hooks. */
export { logConfigUpdated } from "../config/logging.js";
/** Re-exported API for src/plugin-sdk, starting with read Config File Snapshot For Write. */
export { readConfigFileSnapshotForWrite } from "../config/io.js";
/** Re-exported API for src/plugin-sdk, starting with mutate Config File. */
export { mutateConfigFile, replaceConfigFile } from "../config/mutate.js";
/** Re-exported API for src/plugin-sdk, starting with Config Write After Write. */
export type { ConfigWriteAfterWrite } from "../config/runtime-snapshot.js";
/** Re-exported API for src/plugin-sdk, starting with update Config. */
export { updateConfig } from "../commands/models/shared.js";
