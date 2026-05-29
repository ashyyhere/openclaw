// shared listeners helpers and runtime behavior.
/** Reused helper for notify Listeners behavior in src/shared. */
export function notifyListeners<T>(
  listeners: Iterable<(event: T) => void>,
  event: T,
  onError?: (error: unknown) => void,
): void {
  for (const listener of listeners) {
    try {
      listener(event);
    } catch (error) {
      onError?.(error);
    }
  }
}

/** Reused helper for register Listener behavior in src/shared. */
export function registerListener<T>(
  listeners: Set<(event: T) => void>,
  listener: (event: T) => void,
): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
