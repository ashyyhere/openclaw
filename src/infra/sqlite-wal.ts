// infra sqlite wal helpers and runtime behavior.
import type { DatabaseSync } from "node:sqlite";

/** Reused constant for DEFAULT SQLITE WAL AUTOCHECKPOINT PAGES behavior in src/infra. */
export const DEFAULT_SQLITE_WAL_AUTOCHECKPOINT_PAGES = 1000;
/** Reused constant for DEFAULT SQLITE WAL TRUNCATE INTERVAL MS behavior in src/infra. */
export const DEFAULT_SQLITE_WAL_TRUNCATE_INTERVAL_MS = 30 * 60 * 1000;

type IntervalHandle = ReturnType<typeof setInterval> & {
  unref?: () => void;
};

type SqliteWalCheckpointMode = "PASSIVE" | "FULL" | "RESTART" | "TRUNCATE";

/** Shared type for Sqlite Wal Maintenance in src/infra. */
export type SqliteWalMaintenance = {
  checkpoint: () => boolean;
  close: () => boolean;
};

/** Shared type for Sqlite Wal Maintenance Options in src/infra. */
export type SqliteWalMaintenanceOptions = {
  autoCheckpointPages?: number;
  checkpointIntervalMs?: number;
  checkpointMode?: SqliteWalCheckpointMode;
  databaseLabel?: string;
  databasePath?: string;
  onCheckpointError?: (error: unknown) => void;
};

function normalizeNonNegativeInteger(value: number, label: string): number {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${label} must be a non-negative integer`);
  }
  return value;
}

/** Reused helper for configure Sqlite Wal Maintenance behavior in src/infra. */
export function configureSqliteWalMaintenance(
  db: DatabaseSync,
  options: SqliteWalMaintenanceOptions = {},
): SqliteWalMaintenance {
  const autoCheckpointPages = normalizeNonNegativeInteger(
    options.autoCheckpointPages ?? DEFAULT_SQLITE_WAL_AUTOCHECKPOINT_PAGES,
    "autoCheckpointPages",
  );
  const checkpointIntervalMs = normalizeNonNegativeInteger(
    options.checkpointIntervalMs ?? DEFAULT_SQLITE_WAL_TRUNCATE_INTERVAL_MS,
    "checkpointIntervalMs",
  );
  const checkpointMode = options.checkpointMode ?? "TRUNCATE";
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec(`PRAGMA wal_autocheckpoint = ${autoCheckpointPages};`);

  const checkpoint = (): boolean => {
    try {
      db.exec(`PRAGMA wal_checkpoint(${checkpointMode});`);
      return true;
    } catch (error) {
      options.onCheckpointError?.(error);
      return false;
    }
  };

  let timer: IntervalHandle | null = null;
  if (checkpointIntervalMs > 0) {
    timer = setInterval(checkpoint, checkpointIntervalMs) as IntervalHandle;
    timer.unref?.();
  }

  return {
    checkpoint,
    close: () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      return checkpoint();
    },
  };
}
