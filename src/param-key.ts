// Tool parameter key lookup helpers that accept camelCase and snake_case inputs.
import { lowercasePreservingWhitespace } from "./shared/string-coerce.js";

function toSnakeCaseKey(key: string): string {
  const snakeKey = key
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2");
  return lowercasePreservingWhitespace(snakeKey);
}

/** Resolves a parameter key by exact name or equivalent snake_case name. */
export function resolveSnakeCaseParamKey(
  params: Record<string, unknown>,
  key: string,
): string | undefined {
  if (Object.hasOwn(params, key)) {
    return key;
  }
  const snakeKey = toSnakeCaseKey(key);
  if (snakeKey !== key && Object.hasOwn(params, snakeKey)) {
    return snakeKey;
  }
  return undefined;
}

/** Reads a raw tool parameter by exact or snake_case key. */
export function readSnakeCaseParamRaw(params: Record<string, unknown>, key: string): unknown {
  const resolvedKey = resolveSnakeCaseParamKey(params, key);
  if (resolvedKey) {
    return params[resolvedKey];
  }
  return undefined;
}
