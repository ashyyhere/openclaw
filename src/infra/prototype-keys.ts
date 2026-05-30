/** Blocks object keys that can mutate prototypes during object materialization. */
const BLOCKED_OBJECT_KEYS = new Set(["__proto__", "prototype", "constructor"]);

/** Check whether a key is unsafe for plain object assignment. */
export function isBlockedObjectKey(key: string): boolean {
  return BLOCKED_OBJECT_KEYS.has(key);
}
