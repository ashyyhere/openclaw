/** Compatibility barrel for legacy state migration helpers. */
export type { LegacyStateDetection } from "../infra/state-migrations.js";
/** Re-exported API for src/commands. */
export {
  autoMigrateLegacyStateDir,
  autoMigrateLegacyTaskStateSidecars,
  autoMigrateLegacyAgentDir,
  autoMigrateLegacyState,
  detectLegacyStateMigrations,
  migrateLegacyAgentDir,
  resetAutoMigrateLegacyStateDirForTest,
  resetAutoMigrateLegacyTaskStateSidecarsForTest,
  resetAutoMigrateLegacyAgentDirForTest,
  resetAutoMigrateLegacyStateForTest,
  runLegacyStateMigrations,
} from "../infra/state-migrations.js";
