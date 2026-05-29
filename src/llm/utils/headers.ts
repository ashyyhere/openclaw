// Fetch header adapters for provider/client diagnostics.
/** Convert Fetch Headers into a plain object for logging or error payloads. */
export function headersToRecord(headers: Headers): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of headers.entries()) {
    result[key] = value;
  }
  return result;
}
