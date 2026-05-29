// gateway/server-methods base hash helpers and runtime behavior.
/** Reused helper for resolve Base Hash Param behavior in src/gateway/server-methods. */
export function resolveBaseHashParam(params: unknown): string | null {
  const raw = (params as { baseHash?: unknown })?.baseHash;
  if (typeof raw !== "string") {
    return null;
  }
  const trimmed = raw.trim();
  return trimmed ? trimmed : null;
}
