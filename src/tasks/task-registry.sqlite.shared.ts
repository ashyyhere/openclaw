// Shared SQLite helpers for task registry and task-flow registry stores.
import { chmodSync, existsSync, mkdirSync } from "node:fs";
import { isRecord } from "../utils.js";
import { normalizeDeliveryContext } from "../utils/delivery-context.shared.js";
import type { DeliveryContext } from "../utils/delivery-context.types.js";

/** SQLite database and sidecar suffixes that need permission normalization. */
export const SQLITE_SIDECAR_SUFFIXES = ["", "-shm", "-wal"] as const;

/** Convert SQLite numeric values into JavaScript numbers when present. */
export function normalizeSqliteNumber(value: number | bigint | null): number | undefined {
  if (typeof value === "bigint") {
    return Number(value);
  }
  return typeof value === "number" ? value : undefined;
}

// oxlint-disable-next-line typescript/no-unnecessary-type-parameters -- Persisted JSON columns are typed by the receiving field.
/** Parse an optional JSON column from SQLite into the caller's expected type. */
export function parseSqliteJsonValue<T>(raw: string | null): T | undefined {
  if (!raw?.trim()) {
    return undefined;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

/** Parse and normalize a persisted delivery-context JSON column. */
export function parseDeliveryContextJson(raw: string | null): DeliveryContext | undefined {
  const parsed = parseSqliteJsonValue<unknown>(raw);
  if (!isRecord(parsed)) {
    return undefined;
  }
  return normalizeDeliveryContext({
    channel: typeof parsed.channel === "string" ? parsed.channel : undefined,
    to: typeof parsed.to === "string" ? parsed.to : undefined,
    accountId: typeof parsed.accountId === "string" ? parsed.accountId : undefined,
    threadId:
      typeof parsed.threadId === "string" || typeof parsed.threadId === "number"
        ? parsed.threadId
        : undefined,
  });
}

/** Ensure the SQLite store directory and existing database sidecars have expected modes. */
export function ensureSqliteStorePermissions(params: {
  dir: string;
  pathname: string;
  dirMode: number;
  fileMode: number;
}) {
  mkdirSync(params.dir, { recursive: true, mode: params.dirMode });
  chmodSync(params.dir, params.dirMode);
  for (const suffix of SQLITE_SIDECAR_SUFFIXES) {
    const candidate = `${params.pathname}${suffix}`;
    if (!existsSync(candidate)) {
      continue;
    }
    chmodSync(candidate, params.fileMode);
  }
}
