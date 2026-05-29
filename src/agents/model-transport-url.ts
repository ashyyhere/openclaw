/** Sanitizes model transport URLs for debug output. */
/** Format a URL without credentials, query, or hash for debug logs. */
export function formatModelTransportDebugUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    parsed.username = "";
    parsed.password = "";
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return "<invalid-url>";
  }
}

/** Format a base URL or default marker for debug logs. */
export function formatModelTransportDebugBaseUrl(rawUrl: string | undefined): string {
  return rawUrl ? formatModelTransportDebugUrl(rawUrl) : "default";
}
