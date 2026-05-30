// Voice-call webhook code reads case-insensitive HTTP headers through this helper.
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";

type HttpHeaderMap = Record<string, string | string[] | undefined>;

/** Read a header value by name regardless of incoming header casing. */
export function getHeader(headers: HttpHeaderMap, name: string): string | undefined {
  const target = normalizeLowercaseStringOrEmpty(name);
  const direct = headers[target];
  const value =
    direct ??
    Object.entries(headers).find(([key]) => normalizeLowercaseStringOrEmpty(key) === target)?.[1];
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}
