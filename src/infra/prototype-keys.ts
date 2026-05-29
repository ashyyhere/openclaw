// infra prototype keys helpers and runtime behavior.
const BLOCKED_OBJECT_KEYS = new Set(["__proto__", "prototype", "constructor"]);

/** Reused helper for is Blocked Object Key behavior in src/infra. */
export function isBlockedObjectKey(key: string): boolean {
  return BLOCKED_OBJECT_KEYS.has(key);
}
