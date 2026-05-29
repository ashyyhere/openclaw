/** Record-shape helpers shared by legacy config migrations. */
type JsonRecord = Record<string, unknown>;

import { isRecord } from "../../../utils.js";

/** Re-exported API for src/commands/doctor, starting with Json Record. */
export type { JsonRecord };
/** Re-exported API for src/commands/doctor, starting with is Record. */
export { isRecord };

/** Reused helper for clone Record behavior in src/commands/doctor. */
export function cloneRecord<T extends JsonRecord>(value: T | undefined): T {
  return { ...value } as T;
}

/** Reused helper for ensure Record behavior in src/commands/doctor. */
export function ensureRecord(target: JsonRecord, key: string): JsonRecord {
  const current = target[key];
  if (isRecord(current)) {
    return current;
  }
  const next: JsonRecord = {};
  target[key] = next;
  return next;
}

/** Reused helper for has Own Key behavior in src/commands/doctor. */
export function hasOwnKey(target: JsonRecord, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(target, key);
}
