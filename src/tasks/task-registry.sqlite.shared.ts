// tasks task registry sqlite shared helpers and runtime behavior.
import { chmodSync, existsSync, mkdirSync } from "node:fs";
import { isRecord } from "../utils.js";
import { normalizeDeliveryContext } from "../utils/delivery-context.shared.js";
import type { DeliveryContext } from "../utils/delivery-context.types.js";

/** Reused constant for SQLITE SIDECAR SUFFIXES behavior in src/tasks. */
export const SQLITE_SIDECAR_SUFFIXES = ["", "-shm", "-wal"] as const;

/** Reused helper for normalize Sqlite Number behavior in src/tasks. */
export function normalizeSqliteNumber(value: number | bigint | null): number | undefined {
  if (typeof value === "bigint") {
    return Number(value);
  }
  return typeof value === "number" ? value : undefined;
}

// oxlint-disable-next-line typescript/no-unnecessary-type-parameters -- Persisted JSON columns are typed by the receiving field.
/** Reused helper for parse Sqlite Json Value behavior in src/tasks. */
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

/** Reused helper for parse Delivery Context Json behavior in src/tasks. */
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

/** Reused helper for ensure Sqlite Store Permissions behavior in src/tasks. */
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
