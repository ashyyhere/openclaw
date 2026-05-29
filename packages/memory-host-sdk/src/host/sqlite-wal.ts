// SQLite WAL maintenance facade for memory database lifecycle code.
/** WAL defaults and controller factory used by memory SQLite stores. */
export {
  DEFAULT_SQLITE_WAL_AUTOCHECKPOINT_PAGES,
  DEFAULT_SQLITE_WAL_TRUNCATE_INTERVAL_MS,
  configureSqliteWalMaintenance,
} from "./openclaw-runtime-io.js";
/** WAL maintenance controller and tuning options. */
export type { SqliteWalMaintenance, SqliteWalMaintenanceOptions } from "./openclaw-runtime-io.js";
