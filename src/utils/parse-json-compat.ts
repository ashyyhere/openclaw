// utils parse json compat helpers and runtime behavior.
import JSON5 from "json5";

/** Reused helper for parse Json With Json5 Fallback behavior in src/utils. */
export function parseJsonWithJson5Fallback(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return JSON5.parse(raw);
  }
}
