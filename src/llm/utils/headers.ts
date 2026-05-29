// llm/utils headers helpers and runtime behavior.
/** Reused helper for headers To Record behavior in src/llm/utils. */
export function headersToRecord(headers: Headers): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of headers.entries()) {
    result[key] = value;
  }
  return result;
}
