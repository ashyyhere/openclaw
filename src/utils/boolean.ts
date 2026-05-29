// Boolean coercion helpers for config, env, and provider option boundaries.
import { normalizeOptionalLowercaseString } from "../shared/string-coerce.js";

/** Optional token overrides for string-to-boolean parsing. */
export type BooleanParseOptions = {
  truthy?: string[];
  falsy?: string[];
};

const DEFAULT_TRUTHY = ["true", "1", "yes", "on"] as const;
const DEFAULT_FALSY = ["false", "0", "no", "off"] as const;
const DEFAULT_TRUTHY_SET = new Set<string>(DEFAULT_TRUTHY);
const DEFAULT_FALSY_SET = new Set<string>(DEFAULT_FALSY);

/** Returns the value only when it is already a boolean. */
export function asBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

/** Parses booleans from booleans or normalized strings such as true/false, yes/no, and on/off. */
export function parseBooleanValue(
  value: unknown,
  options: BooleanParseOptions = {},
): boolean | undefined {
  const booleanValue = asBoolean(value);
  if (booleanValue !== undefined) {
    return booleanValue;
  }
  if (typeof value !== "string") {
    return undefined;
  }
  const normalized = normalizeOptionalLowercaseString(value);
  if (!normalized) {
    return undefined;
  }
  const truthy = options.truthy ?? DEFAULT_TRUTHY;
  const falsy = options.falsy ?? DEFAULT_FALSY;
  const truthySet = truthy === DEFAULT_TRUTHY ? DEFAULT_TRUTHY_SET : new Set(truthy);
  const falsySet = falsy === DEFAULT_FALSY ? DEFAULT_FALSY_SET : new Set(falsy);
  if (truthySet.has(normalized)) {
    return true;
  }
  if (falsySet.has(normalized)) {
    return false;
  }
  return undefined;
}
