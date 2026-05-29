// JSON parser adapter that accepts strict JSON first, then JSON5 compatibility.
import JSON5 from "json5";

/** Parse JSON with a JSON5 fallback for legacy relaxed config bodies. */
export function parseJsonWithJson5Fallback(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return JSON5.parse(raw);
  }
}
