// llm session resources helpers and runtime behavior.
/** Shared type for Session Resource Cleanup in src/llm. */
export type SessionResourceCleanup = (sessionId?: string) => void;

const sessionResourceCleanups = new Set<SessionResourceCleanup>();

/** Reused helper for register Session Resource Cleanup behavior in src/llm. */
export function registerSessionResourceCleanup(cleanup: SessionResourceCleanup): () => void {
  sessionResourceCleanups.add(cleanup);
  return () => {
    sessionResourceCleanups.delete(cleanup);
  };
}

/** Reused helper for cleanup Session Resources behavior in src/llm. */
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
