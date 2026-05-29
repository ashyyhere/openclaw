// Session-scoped LLM resource cleanup registry.
/** Cleanup callback invoked when a session or all sessions release provider resources. */
export type SessionResourceCleanup = (sessionId?: string) => void;

const sessionResourceCleanups = new Set<SessionResourceCleanup>();

/** Registers a cleanup callback and returns its unregister function. */
export function registerSessionResourceCleanup(cleanup: SessionResourceCleanup): () => void {
  sessionResourceCleanups.add(cleanup);
  return () => {
    sessionResourceCleanups.delete(cleanup);
  };
}

/** Runs all registered cleanup callbacks and reports aggregate failures. */
export function cleanupSessionResources(sessionId?: string): void {
  const errors: unknown[] = [];
  for (const cleanup of sessionResourceCleanups) {
    try {
      cleanup(sessionId);
    } catch (error) {
      errors.push(error);
    }
  }
  if (errors.length > 0) {
    throw new AggregateError(errors, "Failed to cleanup session resources");
  }
}
