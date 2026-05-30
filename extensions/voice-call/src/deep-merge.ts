// Voice-call config merging preserves defined override values while blocking prototype pollution keys.
import { isRecord as isPlainObject } from "openclaw/plugin-sdk/string-coerce-runtime";

const BLOCKED_MERGE_KEYS = new Set(["__proto__", "prototype", "constructor"]);

/** Deep-merge objects while ignoring undefined override values and unsafe prototype keys. */
export function deepMergeDefined(base: unknown, override: unknown): unknown {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return override === undefined ? base : override;
  }

  const result: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (BLOCKED_MERGE_KEYS.has(key) || value === undefined) {
      continue;
    }

    const existing = result[key];
    result[key] = key in result ? deepMergeDefined(existing, value) : value;
  }

  return result;
}
