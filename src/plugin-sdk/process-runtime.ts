// Public process helpers for plugins that spawn or probe local commands.

export * from "../process/exec.js";
/** Re-exported API for src/plugin-sdk, starting with prepare Oom Score Adjusted Spawn. */
export { prepareOomScoreAdjustedSpawn } from "../process/linux-oom-score.js";
/** Re-exported API for src/plugin-sdk, starting with Oom Score Adjusted Spawn. */
export type { OomScoreAdjustedSpawn, OomWrapOptions } from "../process/linux-oom-score.js";
