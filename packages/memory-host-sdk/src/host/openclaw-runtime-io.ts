// IO, logging, concurrency, warning, and platform helpers shared by memory host code.
/** Runtime utility helpers reused by memory host adapters without importing core internals. */
export {
  CHARS_PER_TOKEN_ESTIMATE,
  DEFAULT_SQLITE_WAL_AUTOCHECKPOINT_PAGES,
  DEFAULT_SQLITE_WAL_TRUNCATE_INTERVAL_MS,
  applyWindowsSpawnProgramPolicy,
  configureSqliteWalMaintenance,
  root,
  createSubsystemLogger,
  detectMime,
  estimateStringChars,
  installProcessWarningFilter,
  materializeWindowsSpawnProgram,
  redactSensitiveText,
  resolveGlobalSingleton,
  resolveUserPath,
  resolveWindowsExecutablePath,
  resolveWindowsSpawnProgram,
  resolveWindowsSpawnProgramCandidate,
  runTasksWithConcurrency,
  shortenHomeInString,
  shortenHomePath,
  shouldIgnoreWarning,
  splitShellArgs,
  truncateUtf16Safe,
} from "./openclaw-runtime.js";

/** Platform and SQLite maintenance types exposed by the IO facade. */
export type {
  ProcessWarning,
  ResolveWindowsSpawnProgramCandidateParams,
  ResolveWindowsSpawnProgramParams,
  SqliteWalMaintenance,
  SqliteWalMaintenanceOptions,
  WindowsSpawnCandidateResolution,
  WindowsSpawnInvocation,
  WindowsSpawnProgram,
  WindowsSpawnProgramCandidate,
  WindowsSpawnResolution,
} from "./openclaw-runtime.js";
