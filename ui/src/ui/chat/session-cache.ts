// ui/src/ui/chat session cache helpers and runtime behavior.
const MAX_CACHED_CHAT_SESSIONS = 20;

/** Reused helper for get Or Create Session Cache Value behavior in ui/src/ui/chat. */
export function getOrCreateSessionCacheValue<T>(
  map: Map<string, T>,
  sessionKey: string,
  create: () => T,
): T {
  if (map.has(sessionKey)) {
    const existing = map.get(sessionKey) as T;
    // Refresh insertion order so recently used sessions stay cached.
    map.delete(sessionKey);
    map.set(sessionKey, existing);
    return existing;
  }

  const created = create();
  map.set(sessionKey, created);
  while (map.size > MAX_CACHED_CHAT_SESSIONS) {
    const oldest = map.keys().next().value;
    if (typeof oldest !== "string") {
      break;
    }
    map.delete(oldest);
  }
  return created;
}
